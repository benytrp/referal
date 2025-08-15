import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, PlayCircle, RotateCcw, Copy, FileJson } from "lucide-react";

// ---------------- Types ----------------

type Operation = { op: string; parameters?: Record<string, any> };

type Phase = {
  phase_name: string;
  operations: Operation[];
  parallel_sandboxes?: boolean;
  entropy?: number;
};

type Schema = {
  trigger?: string;
  contract: { goal: string; constraints?: string[]; success_criteria?: string[] };
  phases: Phase[];
  metadata?: { created?: string; generator?: string };
};

// ---------------- Executor Core ----------------

type ExecutorOptions = {
  cycleLimit?: number; // default 25
  contestedThreshold?: number; // default 0.7
  returnFormat?: "string" | "object";
};

type AuditRow = {
  cycle: number; phase: string; ops: number; entropy: number; contested: boolean
};

type ExecResult = {
  ok: boolean;
  errors: string[];
  template: string;
  report: {
    generator: string;
    goal: string;
    totalCycles: number;
    avgEntropy: number;
    contestedCycles: number;
  };
  audit: AuditRow[];
};

function clamp01(n: any): number { const x = Number(n); return Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0; }

function executeOne(schema: Schema, opts: ExecutorOptions = {}): ExecResult {
  const cycleLimit = opts.cycleLimit ?? 25;
  const contestedThreshold = opts.contestedThreshold ?? 0.7;
  const errors: string[] = [];
  const audit: AuditRow[] = [];

  // 1) Initial validation
  if (!schema || !schema.contract || !schema.contract.goal) {
    return {
      ok: false,
      errors: ["Invalid schema: Missing contract or goal."],
      template: "",
      report: { generator: schema?.metadata?.generator ?? "Unknown", goal: "(missing)", totalCycles: 0, avgEntropy: 0, contestedCycles: 0 },
      audit: []
    };
  }
  if (!Array.isArray(schema.phases)) {
    return {
      ok: false,
      errors: ["Invalid schema: Missing phases array."],
      template: "",
      report: { generator: schema?.metadata?.generator ?? "Unknown", goal: schema.contract.goal, totalCycles: 0, avgEntropy: 0, contestedCycles: 0 },
      audit: []
    };
  }

  // 2) Metrics
  let totalEntropy = 0;
  let contestedCycles = 0;
  let cycleCount = 0;

  // 3) Process phases
  const blocks: string[] = [];
  for (const phase of schema.phases) {
    cycleCount++;

    if (cycleCount > cycleLimit) { errors.push(`Exceeded cycle limit of ${cycleLimit}.`); break; }

    if (!phase || typeof phase.phase_name !== "string" || !Array.isArray(phase.operations)) {
      errors.push(`Invalid phase at cycle ${cycleCount}: Missing name or operations array.`);
      continue;
    }

    const entropy = clamp01(phase.entropy);
    const contested = entropy > contestedThreshold;
    if (contested) contestedCycles++;
    totalEntropy += entropy;

    const opsTemplate = phase.operations.map((op, idx) => {
      if (!op || typeof op.op !== "string") {
        errors.push(`Phase '${phase.phase_name}' op[${idx}] missing 'op' string.`);
        return `Operation: (invalid)`;
      }
      const params = op.parameters ? JSON.stringify(op.parameters) : "{}";
      return `Operation: ${op.op} | Params: ${params}`;
    }).join("\n");

    audit.push({ cycle: cycleCount, phase: phase.phase_name, ops: phase.operations.length, entropy, contested });

    blocks.push([
      `⟦phase.${cycleCount}⟧`,
      `Name: ${phase.phase_name}`,
      `Entropy: ${entropy.toFixed(4)}`,
      `Parallel: ${!!phase.parallel_sandboxes}`,
      `Operations:`,
      opsTemplate
    ].join("\n"));
  }

  const avgEntropy = (cycleCount > 0) ? totalEntropy / cycleCount : 0;

  if (errors.length) {
    return {
      ok: false,
      errors,
      template: `Generated Template (Failed with errors):\n${errors.join("\n")}`,
      report: {
        generator: schema.metadata?.generator ?? "Unknown",
        goal: schema.contract.goal,
        totalCycles: cycleCount,
        avgEntropy,
        contestedCycles
      },
      audit
    };
  }

  const generatedTemplate = blocks.join("\n---\n");
  const header = [
    "Generated Template (Success)",
    "---------------------------------",
    `Generator: ${schema.metadata?.generator ?? "Unknown"}`,
    `Goal: ${schema.contract.goal}`,
    `Total Cycles: ${cycleCount}`,
    `Avg Entropy: ${avgEntropy.toFixed(4)}`,
    `Contested Cycles: ${contestedCycles}`,
    "",
  ].join("\n");

  return {
    ok: true,
    errors: [],
    template: `${header}\n${generatedTemplate}`,
    report: { generator: schema.metadata?.generator ?? "Unknown", goal: schema.contract.goal, totalCycles: cycleCount, avgEntropy, contestedCycles },
    audit
  };
}

function universalExecutorV4(input: Schema | Schema[], opts: ExecutorOptions = {}) {
  const arr = Array.isArray(input) ? input : [input];
  const results = arr.map(s => executeOne(s, opts));
  const merged = {
    ok: results.every(r => r.ok),
    errors: results.flatMap(r => r.errors),
    templates: results.map(r => r.template).join("\n\n==============================\n\n"),
    reports: results.map(r => r.report),
    audits: results.map(r => r.audit)
  };
  return merged;
}

// ---------------- UI ----------------

const SAMPLE = {
  trigger: "<x>",
  contract: {
    goal: "adding AI optimized presets to my offline html using parallel testing",
    constraints: ["Maintain quality standards","Complete efficiently"],
    success_criteria: ["Goal achieved","No critical errors"]
  },
  phases: [
    { phase_name: "Analysis", operations: [ { op: "analyze_requirements", parameters: {} }, { op: "validate_inputs", parameters: {} } ], parallel_sandboxes: false, entropy: 0.4532 },
    { phase_name: "Planning", operations: [ { op: "generate_strategy", parameters: {} }, { op: "allocate_resources", parameters: {} } ], parallel_sandboxes: true, entropy: 0.8117 },
    { phase_name: "Execution", operations: [ { op: "implement_solution", parameters: {} }, { op: "monitor_progress", parameters: {} } ], parallel_sandboxes: false, entropy: 0.9415 },
    { phase_name: "Validation", operations: [ { op: "verify_outcomes", parameters: {} }, { op: "generate_report", parameters: {} } ], parallel_sandboxes: false, entropy: 0.2356 }
  ],
  metadata: { created: "2025-08-10T06:14:28.772Z", generator: "X-Logic Schema Builder v1.0" }
};

export default function UniversalExecutorAuditable() {
  const [json, setJson] = useState<string>(JSON.stringify(SAMPLE, null, 2));
  const [cycleLimit, setCycleLimit] = useState<number>(25);
  const [threshold, setThreshold] = useState<number>(0.7);
  const [fmt, setFmt] = useState<"string"|"object">("string");
  const [output, setOutput] = useState<string>("");
  const [audit, setAudit] = useState<AuditRow[] | null>(null);
  const [report, setReport] = useState<any>(null);

  const onRun = () => {
    try {
      const data = JSON.parse(json);
      const res = universalExecutorV4(data, { cycleLimit, contestedThreshold: threshold, returnFormat: fmt });
      setOutput(res.templates);
      setReport(res.reports?.[0] ?? null);
      setAudit(res.audits?.[0] ?? null);
    } catch (e: any) {
      setOutput("Error: " + e.message);
      setAudit(null);
      setReport(null);
    }
  };

  const onReset = () => {
    setJson(JSON.stringify(SAMPLE, null, 2));
    setOutput("");
    setAudit(null);
    setReport(null);
    setCycleLimit(25);
    setThreshold(0.7);
    setFmt("string");
  };

  const downloadText = (name: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Universal Schema Executor — v4 (auditable)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-2">
              <Label>Schema JSON (single object or array)</Label>
              <Textarea className="font-mono h-72" value={json} onChange={e=> setJson(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={onRun}><PlayCircle className="h-4 w-4 mr-2"/>Run</Button>
                <Button variant="secondary" onClick={onReset}><RotateCcw className="h-4 w-4 mr-2"/>Reset</Button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Cycle limit</Label>
                <Input type="number" min={1} max={100} value={cycleLimit} onChange={e=> setCycleLimit(Number(e.target.value))} />
              </div>
              <div>
                <Label>Contested threshold</Label>
                <Slider value={[Math.round(threshold*100)]} onValueChange={v=> setThreshold(v[0]/100)} max={100} step={1} />
                <div className="text-xs text-muted-foreground mt-1">{threshold.toFixed(2)}</div>
              </div>
              <div>
                <Label>Output format</Label>
                <Select value={fmt} onValueChange={(v: any)=> setFmt(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string (report text)</SelectItem>
                    <SelectItem value="object">object (JSON)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(output)}><Copy className="h-4 w-4 mr-2"/>Copy output</Button>
                <Button variant="outline" onClick={() => downloadText("universal_executor_report.txt", output)}><Download className="h-4 w-4 mr-2"/>Download</Button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <Label>Generated template / report</Label>
              <Textarea readOnly className="font-mono h-64" value={output} />
            </div>
            <div>
              <Label>Audit (per-phase)</Label>
              <Textarea readOnly className="font-mono h-64" value={audit ? JSON.stringify(audit, null, 2) : "(run to see audit)"} />
              <div className="mt-2">
                <Button variant="secondary" onClick={() => audit && downloadText("universal_executor_audit.json", JSON.stringify(audit, null, 2))}><FileJson className="h-4 w-4 mr-2"/>Export audit JSON</Button>
              </div>
            </div>
          </div>

          {report && (
            <div className="text-sm text-muted-foreground">Summary → Generator: <b>{report.generator}</b> · Total cycles: <b>{report.totalCycles}</b> · Avg entropy: <b>{report.avgEntropy.toFixed(4)}</b> · Contested: <b>{report.contestedCycles}</b></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
