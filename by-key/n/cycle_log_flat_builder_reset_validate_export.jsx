import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Download, RotateCcw, BadgeCheck } from "lucide-react";

// --- Default FLAT payload seeded with your 6-cycle example ---
const defaultPayload = {
  cycle_log: [
    {
      cycle: 1,
      phase: "Summon",
      op: "analyze_goal",
      output: "Interpret the primary goal: \"Co-write a short story about 'meta-cognition' and 'recursive loops'.\"",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.075Z",
      entropy: 0.9889039115262395,
      contested: false,
      hash_of_entry: "1ceb678f3b0d349e8f38101c2bd88de5438275ff66f31aa80aa705a63ff7472e"
    },
    {
      cycle: 2,
      phase: "Processing",
      op: "list_constraints",
      output: "Acknowledge constraints: [\"<500 words.\",\"Use glyphs: '∞', 'φ', '∴'.\"]",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.182Z",
      entropy: 0.7483837662038213,
      contested: false,
      hash_of_entry: "702304c83ab1a0ee63f70e7bcb1c2bae4be1e607798941b44feffac11f48005f"
    },
    {
      cycle: 3,
      phase: "Processing",
      op: "formulate_plan",
      output: "Develop a high-level execution strategy.",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.283Z",
      entropy: 0.3840690466304232,
      contested: false,
      hash_of_entry: "bd3b941c0546fdfe81dadbc8f84c4721f99286c85623b206f9ad856c1f83662f"
    },
    {
      cycle: 4,
      phase: "Processing",
      op: "develop_characters",
      output: "Flesh out the motivations for The Courier and The Architect.",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.383Z",
      entropy: 0.4659609497967585,
      contested: false,
      hash_of_entry: "6873d830afa9253acc12da42b089edb4dc55433cfa9ca0c6445488c57f9b7e19"
    },
    {
      cycle: 5,
      phase: "Processing",
      op: "write_opening_scene",
      output: "Draft the initial scene introducing the core conflict and the glyphs ∞, φ, ∴.",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.483Z",
      entropy: 0.5052336698761021,
      contested: false,
      hash_of_entry: "d6cdbb3ae3ab40a1d5caa55ae33f036213709d3d442ee7a7f0ebaeb08491b73c"
    },
    {
      cycle: 6,
      phase: "Echo",
      op: "finalize_output",
      output: "Consolidate results and prepare for final output.",
      contract_ref: "simulated_task",
      timestamp: "2025-08-09T21:24:43.583Z",
      entropy: 0.7211190494088391,
      contested: false,
      hash_of_entry: "623ff05e685fa8386990311c3068860da345eb42d6c4158cf5702f645eb193f6"
    }
  ]
};

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const isoRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z/;

type RowResult = { index: number; ok: boolean; messages: string[] };

export default function CycleLogFlatBuilder() {
  const [name, setName] = useState("nvrstry_flat_cycle_log.json");
  const [text, setText] = useState<string>(JSON.stringify(defaultPayload, null, 2));
  const [results, setResults] = useState<RowResult[] | null>(null);
  const [summary, setSummary] = useState<string>("");

  const validate = () => {
    const rows: RowResult[] = [];
    let okAll = true;
    try {
      const data = JSON.parse(text);
      if (!data || typeof data !== "object") throw new Error("Root must be an object");
      if (!Array.isArray(data.cycle_log)) throw new Error("Root.cycle_log must be an array");

      data.cycle_log.forEach((entry: any, i: number) => {
        const msgs: string[] = [];
        let ok = true;
        if (entry.cycle === undefined) { ok = false; msgs.push("missing: cycle"); }
        if (typeof entry.phase !== "string") { ok = false; msgs.push("phase must be string"); }
        if (typeof entry.op !== "string") { ok = false; msgs.push("op must be string"); }
        if (entry.output === undefined) { ok = false; msgs.push("missing: output"); }
        if (typeof entry.timestamp !== "string" || !isoRegex.test(entry.timestamp)) {
          ok = false; msgs.push("timestamp must be ISO-8601 UTC (…Z)");
        }
        rows.push({ index: i, ok, messages: msgs });
        if (!ok) okAll = false;
      });
      setResults(rows);
      setSummary(okAll ? "All rows look valid (flat mode)." : "Some rows need fixes. See details below.");
    } catch (e: any) {
      setResults(null);
      setSummary("Parse error: " + e.message);
    }
  };

  const reset = () => {
    setText(JSON.stringify(defaultPayload, null, 2));
    setResults(null);
    setSummary("");
  };

  const exportFile = () => download(name || "nvrstry_flat_cycle_log.json", text);

  const passCount = useMemo(() => results?.filter(r => r.ok).length ?? 0, [results]);

  return (
    <div className="mx-auto max-w-5xl p-4 space-y-4">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Cycle Log — Flat Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-2 items-end">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Filename</label>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="flex gap-2 md:justify-end">
              <Button variant="secondary" onClick={reset}><RotateCcw className="mr-2 h-4 w-4"/>Reset</Button>
              <Button onClick={validate}><BadgeCheck className="mr-2 h-4 w-4"/>Validate</Button>
              <Button onClick={exportFile}><Download className="mr-2 h-4 w-4"/>Export</Button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Flat JSON (root.cycle_log[])</label>
            <Textarea className="font-mono h-80" value={text} onChange={e => setText(e.target.value)} />
          </div>

          {summary && (
            <div className="text-sm mt-1">{summary}</div>
          )}

          {results && (
            <ul className="mt-2 space-y-1">
              {results.map(r => (
                <li key={r.index} className="flex items-start gap-2 text-sm">
                  {r.ok ? <CheckCircle className="h-4 w-4"/> : <XCircle className="h-4 w-4"/>}
                  <span className={r.ok ? "" : "text-red-600"}>row {r.index}: {r.ok ? "ok" : r.messages.join(", ")}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Flat requirements (quick check)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Each <code>cycle_log[]</code> item must have <code>cycle</code>, <code>phase</code>, <code>op</code>, <code>output</code>, <code>timestamp</code>. Extra fields (e.g., <code>entropy</code>, <code>contract_ref</code>, <code>scroll_id</code>) are allowed and preserved.
        </CardContent>
      </Card>
    </div>
  );
}
