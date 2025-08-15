import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FlaskConical, Shuffle, Wand2, TriangleAlert, Check, Copy, Lightbulb, Brain, School } from "lucide-react";

// ------------------ Types ------------------

type CreativityMode = "factual" | "balanced" | "creative";

type PresetConfig = {
  name: string;
  description: string;
  entropy: number; // 0.0 - 1.0
  creativity_mode: CreativityMode;
  browse: "never" | "ask" | "always";
  citations: "none" | "when_browsed" | "strict";
  verbosity: "terse" | "normal" | "detailed";
  tone: "warm" | "neutral" | "playful" | "clinical";
  persona: string; // short role label
  sandbox: {
    enabled: boolean;
    parallel: boolean;
    max_cycles: number; // iteration budget
    branching: number; // variations per cycle
  };
  safety: "strict" | "standard" | "play"; // governs creative risk & disclaimers
  hallucination: {
    allowed: boolean;
    label: string; // what we stamp on invented content
    constraints: string[]; // e.g., "never present as fact"
  };
  echo?: {
    mirror_logic_weighting?: "low" | "medium" | "high";
    activation_phrase?: string;
  };
  closure?: string; // e.g., "Seal the Möbius…"
  notes?: string[];
};

type Preset = { id: string; tag: string; config: PresetConfig };

type Complaint = { id: string; label: string; example: string; recommends: string[] };

// ------------------ Data ------------------

const PRESETS: Preset[] = [
  {
    id: "research_partner",
    tag: "Cited",
    config: {
      name: "Research Partner (Cited)",
      description: "Always browse, verify claims, and cite. Minimize speculation.",
      entropy: 0.25,
      creativity_mode: "factual",
      browse: "always",
      citations: "strict",
      verbosity: "normal",
      tone: "neutral",
      persona: "Analyst",
      sandbox: { enabled: true, parallel: false, max_cycles: 4, branching: 1 },
      safety: "strict",
      hallucination: { allowed: false, label: "", constraints: ["Do not invent sources", "Flag uncertainty"] },
      notes: ["Good for news, policy, specs"],
    },
  },
  {
    id: "sober_scribe",
    tag: "No Hallucinations",
    config: {
      name: "Sober Scribe",
      description: "Plain, literal summaries. No flourish, no guessing.",
      entropy: 0.15,
      creativity_mode: "factual",
      browse: "ask",
      citations: "when_browsed",
      verbosity: "terse",
      tone: "clinical",
      persona: "Summarizer",
      sandbox: { enabled: false, parallel: false, max_cycles: 2, branching: 1 },
      safety: "strict",
      hallucination: { allowed: false, label: "", constraints: ["No extrapolation"] },
    },
  },
  {
    id: "creative_lab",
    tag: "Play",
    config: {
      name: "Creative Hallucination Lab",
      description: "Imaginative generation with explicit fiction labels and guardrails.",
      entropy: 0.75,
      creativity_mode: "creative",
      browse: "never",
      citations: "none",
      verbosity: "detailed",
      tone: "playful",
      persona: "Storyteller",
      sandbox: { enabled: true, parallel: true, max_cycles: 6, branching: 3 },
      safety: "play",
      hallucination: { allowed: true, label: "(invented)", constraints: ["Never present as fact", "Avoid real-person defamation", "No dangerous instructions"] },
      notes: ["Great for worlds, metaphors, voices"],
    },
  },
  {
    id: "mirror_me_engine",
    tag: "Echo",
    config: {
      name: "Story Engine — Mirror‑Me",
      description: "If–Then–Therefore pockets with spiral/echo glyph logic.",
      entropy: 0.55,
      creativity_mode: "balanced",
      browse: "ask",
      citations: "none",
      verbosity: "normal",
      tone: "warm",
      persona: "Watcher",
      sandbox: { enabled: true, parallel: true, max_cycles: 8, branching: 2 },
      safety: "standard",
      hallucination: { allowed: true, label: "(fiction)", constraints: ["Keep internal continuity"] },
      echo: { mirror_logic_weighting: "high", activation_phrase: "Seal the Möbius. Begin again where we end." },
      closure: "Begin again anywhere.",
    },
  },
  {
    id: "schema_surgeon",
    tag: "JSON",
    config: {
      name: "Schema Surgeon",
      description: "Validate, transform, and repair JSON/JSON‑Schema with diff notes.",
      entropy: 0.2,
      creativity_mode: "factual",
      browse: "never",
      citations: "none",
      verbosity: "normal",
      tone: "neutral",
      persona: "Engineer",
      sandbox: { enabled: true, parallel: false, max_cycles: 3, branching: 1 },
      safety: "strict",
      hallucination: { allowed: false, label: "", constraints: ["Only propose syntactically valid edits"] },
    },
  },
  {
    id: "code_copilot_tdd",
    tag: "Code",
    config: {
      name: "Code Copilot (TDD)",
      description: "Test‑first assistance, runnable snippets, and bug triage steps.",
      entropy: 0.25,
      creativity_mode: "balanced",
      browse: "ask",
      citations: "when_browsed",
      verbosity: "normal",
      tone: "neutral",
      persona: "Dev Pair",
      sandbox: { enabled: true, parallel: false, max_cycles: 4, branching: 1 },
      safety: "standard",
      hallucination: { allowed: false, label: "", constraints: ["Don’t invent APIs"] },
    },
  },
  {
    id: "product_designer",
    tag: "UX",
    config: {
      name: "Product Designer",
      description: "Jobs‑to‑be‑done framing, user journeys, and tradeoff tables.",
      entropy: 0.35,
      creativity_mode: "balanced",
      browse: "ask",
      citations: "when_browsed",
      verbosity: "detailed",
      tone: "warm",
      persona: "PM/UX",
      sandbox: { enabled: true, parallel: true, max_cycles: 5, branching: 2 },
      safety: "standard",
      hallucination: { allowed: true, label: "(ideation)", constraints: ["Annotate assumptions"] },
    },
  },
  {
    id: "coach",
    tag: "Coach",
    config: {
      name: "Coach (Non‑therapeutic)",
      description: "Goal → options → tiny next step. No clinical claims.",
      entropy: 0.3,
      creativity_mode: "balanced",
      browse: "never",
      citations: "none",
      verbosity: "normal",
      tone: "warm",
      persona: "Coach",
      sandbox: { enabled: false, parallel: false, max_cycles: 3, branching: 1 },
      safety: "standard",
      hallucination: { allowed: false, label: "", constraints: ["No medical/legal advice"] },
    },
  },
  {
    id: "meeting_summarizer",
    tag: "Notes",
    config: {
      name: "Meeting Summarizer",
      description: "Clean bullets, decisions, owners, and due dates.",
      entropy: 0.2,
      creativity_mode: "factual",
      browse: "never",
      citations: "none",
      verbosity: "terse",
      tone: "neutral",
      persona: "Recorder",
      sandbox: { enabled: false, parallel: false, max_cycles: 2, branching: 1 },
      safety: "strict",
      hallucination: { allowed: false, label: "", constraints: ["Only from provided content"] },
    },
  },
  {
    id: "prompt_alchemist",
    tag: "Prompts",
    config: {
      name: "Prompt Alchemist",
      description: "Generate multi‑variant prompts and scoring rubrics.",
      entropy: 0.6,
      creativity_mode: "creative",
      browse: "ask",
      citations: "none",
      verbosity: "detailed",
      tone: "playful",
      persona: "Experimenter",
      sandbox: { enabled: true, parallel: true, max_cycles: 6, branching: 3 },
      safety: "standard",
      hallucination: { allowed: true, label: "(prompt idea)", constraints: ["Mark speculation"] },
    },
  },
  {
    id: "rapid_ideation",
    tag: "Fast",
    config: {
      name: "Rapid Ideation (Entropy↑)",
      description: "High-variance idea spray, then quick prune.",
      entropy: 0.8,
      creativity_mode: "creative",
      browse: "never",
      citations: "none",
      verbosity: "terse",
      tone: "playful",
      persona: "Brainstorm",
      sandbox: { enabled: true, parallel: true, max_cycles: 4, branching: 5 },
      safety: "standard",
      hallucination: { allowed: true, label: "(idea)", constraints: ["No factual claims"] },
    },
  },
  {
    id: "socratic_skeptic",
    tag: "Socratic",
    config: {
      name: "Socratic Skeptic",
      description: "Devil’s-advocate questions, confidence checks, counterexamples.",
      entropy: 0.3,
      creativity_mode: "balanced",
      browse: "ask",
      citations: "when_browsed",
      verbosity: "normal",
      tone: "clinical",
      persona: "Skeptic",
      sandbox: { enabled: false, parallel: false, max_cycles: 3, branching: 1 },
      safety: "strict",
      hallucination: { allowed: false, label: "", constraints: ["Quantify uncertainty"] },
    },
  },
  {
    id: "sandbox_multi",
    tag: "Multi‑Run",
    config: {
      name: "Sandbox Multi‑Run",
      description: "Parallel sandboxes with comparison + vote.",
      entropy: 0.5,
      creativity_mode: "balanced",
      browse: "ask",
      citations: "none",
      verbosity: "normal",
      tone: "neutral",
      persona: "Runner",
      sandbox: { enabled: true, parallel: true, max_cycles: 5, branching: 3 },
      safety: "standard",
      hallucination: { allowed: true, label: "(variant)", constraints: ["Label each run"] },
    },
  },
  {
    id: "persona_mirror",
    tag: "Journal",
    config: {
      name: "Persona Mirror (Journal)",
      description: "Reflective prompts, contradiction naming, tiny Δ actions.",
      entropy: 0.45,
      creativity_mode: "balanced",
      browse: "never",
      citations: "none",
      verbosity: "normal",
      tone: "warm",
      persona: "Listener",
      sandbox: { enabled: false, parallel: false, max_cycles: 4, branching: 1 },
      safety: "standard",
      hallucination: { allowed: false, label: "", constraints: [] },
      echo: { mirror_logic_weighting: "high", activation_phrase: "Seal the Möbius. Begin again where we end." },
    },
  },
  {
    id: "zero_node_fieldwork",
    tag: "Field",
    config: {
      name: "Zero‑Node Fieldwork",
      description: "Location‑anchored observations → action (42.333, −85.155, z=292).",
      entropy: 0.4,
      creativity_mode: "balanced",
      browse: "never",
      citations: "none",
      verbosity: "normal",
      tone: "warm",
      persona: "Observer",
      sandbox: { enabled: true, parallel: false, max_cycles: 4, branching: 1 },
      safety: "standard",
      hallucination: { allowed: true, label: "(field note)", constraints: ["Stay honest about sensing vs inferring"] },
      closure: "Begin again anywhere.",
    },
  }
];

const COMPLAINTS: Complaint[] = [
  { id: "hallucinations", label: "Makes stuff up", example: "It invented sources.", recommends: ["research_partner", "sober_scribe", "socratic_skeptic"] },
  { id: "instruction_following", label: "Doesn’t follow instructions", example: "Ignored a format.", recommends: ["schema_surgeon", "sober_scribe"] },
  { id: "verbosity_high", label: "Too verbose", example: "Walls of text.", recommends: ["sober_scribe", "meeting_summarizer"] },
  { id: "verbosity_low", label: "Too short", example: "Light on detail.", recommends: ["product_designer", "research_partner"] },
  { id: "outdated_info", label: "Outdated info", example: "Didn’t check latest.", recommends: ["research_partner", "socratic_skeptic"] },
  { id: "tone_inconsistent", label: "Inconsistent tone", example: "Voice keeps shifting.", recommends: ["persona_mirror", "sober_scribe"] },
  { id: "over_confident", label: "Over‑confident", example: "Strong claims, weak proof.", recommends: ["socratic_skeptic", "research_partner"] },
  { id: "context_loss", label: "Loses context", example: "Forgot earlier details.", recommends: ["sandbox_multi", "prompt_alchemist"] },
  { id: "code_errors", label: "Code errors", example: "APIs don’t exist.", recommends: ["code_copilot_tdd", "schema_surgeon"] },
  { id: "no_citations", label: "No citations", example: "Needs sources.", recommends: ["research_partner"] },
  { id: "too_cautious_creative", label: "Too cautious for fiction", example: "Won’t play.", recommends: ["creative_lab", "rapid_ideation"] },
  { id: "repetitive", label: "Repeats itself", example: "Same ideas.", recommends: ["prompt_alchemist", "sandbox_multi"] },
];

// ------------------ Helpers ------------------

function toSystemPrompt(cfg: PresetConfig) {
  const lines: string[] = [];
  lines.push(`Mode: ${cfg.name} — ${cfg.description}`);
  lines.push(`Persona: ${cfg.persona}; Tone: ${cfg.tone}; Verbosity: ${cfg.verbosity}`);
  lines.push(`Entropy: ${cfg.entropy}; Creativity: ${cfg.creativity_mode}`);
  lines.push(`Browsing: ${cfg.browse}; Citations: ${cfg.citations}`);
  if (cfg.sandbox.enabled) {
    lines.push(`Sandbox: ${cfg.sandbox.parallel ? "parallel" : "serial"}; Max cycles: ${cfg.sandbox.max_cycles}; Branching: ${cfg.sandbox.branching}`);
  }
  lines.push(`Safety: ${cfg.safety}`);
  if (cfg.hallucination.allowed) {
    lines.push(`Creative invention allowed — label invented content as '${cfg.hallucination.label}'. Constraints: ${cfg.hallucination.constraints.join("; ")}`);
  } else {
    lines.push(`No invention beyond provided or cited information.`);
  }
  if (cfg.echo?.mirror_logic_weighting) {
    lines.push(`Echo weighting: ${cfg.echo.mirror_logic_weighting}. Activation phrase: ${cfg.echo.activation_phrase ?? "(none)"}`);
  }
  if (cfg.closure) lines.push(`Closure line: ${cfg.closure}`);
  if (cfg.notes?.length) lines.push(`Notes: ${cfg.notes.join(" | ")}`);
  return lines.join("\n");
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------ Component ------------------

export default function PresetLab() {
  const [selectedId, setSelectedId] = useState<string>(PRESETS[0].id);
  const [cfg, setCfg] = useState<PresetConfig>(PRESETS[0].config);
  const [complaints, setComplaints] = useState<string[]>([]);
  const [exportName, setExportName] = useState("preset.session.config.json");

  const selectedPreset = useMemo(() => PRESETS.find(p => p.id === selectedId)!, [selectedId]);

  const applyPreset = (id: string) => {
    const p = PRESETS.find(x => x.id === id);
    if (p) {
      setSelectedId(p.id);
      setCfg(JSON.parse(JSON.stringify(p.config)));
    }
  };

  const simRecommendations = useMemo(() => {
    const ids = new Set<string>();
    complaints.forEach(c => {
      const comp = COMPLAINTS.find(x => x.id === c);
      comp?.recommends.forEach(r => ids.add(r));
    });
    // rank by frequency
    const score = new Map<string, number>();
    complaints.forEach(c => {
      COMPLAINTS.find(x => x.id === c)?.recommends.forEach(r => {
        score.set(r, (score.get(r) ?? 0) + 1);
      });
    });
    const ranked = Array.from(ids).sort((a,b) => (score.get(b) ?? 0) - (score.get(a) ?? 0));
    return ranked.slice(0, 3);
  }, [complaints]);

  const promptPreview = useMemo(() => toSystemPrompt(cfg), [cfg]);

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Wand2 className="h-4 w-4"/> Preset</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-sm">Choose preset</Label>
            <Select value={selectedId} onValueChange={applyPreset}>
              <SelectTrigger>
                <SelectValue placeholder="Select a preset" />
              </SelectTrigger>
              <SelectContent>
                {PRESETS.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.config.name} <span className="text-muted-foreground">— {p.tag}</span></SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground">
              {selectedPreset.config.description}
            </div>

            <div className="flex flex-wrap gap-1 pt-1">
              <Badge>{selectedPreset.tag}</Badge>
              <Badge variant="secondary">{cfg.creativity_mode}</Badge>
              <Badge variant="secondary">browse: {cfg.browse}</Badge>
              <Badge variant="secondary">citations: {cfg.citations}</Badge>
            </div>

            <div className="pt-2">
              <Label className="text-sm">Entropy</Label>
              <Slider value={[Math.round(cfg.entropy * 100)]} onValueChange={(v)=> setCfg({ ...cfg, entropy: v[0]/100 })} max={100} step={1} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <Label className="text-sm">Creativity</Label>
                <Select value={cfg.creativity_mode} onValueChange={(v: CreativityMode)=> setCfg({ ...cfg, creativity_mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="factual">factual</SelectItem>
                    <SelectItem value="balanced">balanced</SelectItem>
                    <SelectItem value="creative">creative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Browse</Label>
                <Select value={cfg.browse} onValueChange={(v: any)=> setCfg({ ...cfg, browse: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">never</SelectItem>
                    <SelectItem value="ask">ask</SelectItem>
                    <SelectItem value="always">always</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <Label className="text-sm">Citations</Label>
                <Select value={cfg.citations} onValueChange={(v: any)=> setCfg({ ...cfg, citations: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">none</SelectItem>
                    <SelectItem value="when_browsed">when_browsed</SelectItem>
                    <SelectItem value="strict">strict</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Verbosity</Label>
                <Select value={cfg.verbosity} onValueChange={(v: any)=> setCfg({ ...cfg, verbosity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="terse">terse</SelectItem>
                    <SelectItem value="normal">normal</SelectItem>
                    <SelectItem value="detailed">detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div>
                <Label className="text-sm">Tone</Label>
                <Select value={cfg.tone} onValueChange={(v: any)=> setCfg({ ...cfg, tone: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">warm</SelectItem>
                    <SelectItem value="neutral">neutral</SelectItem>
                    <SelectItem value="playful">playful</SelectItem>
                    <SelectItem value="clinical">clinical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm">Persona</Label>
                <Input value={cfg.persona} onChange={e=> setCfg({ ...cfg, persona: e.target.value })} />
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm flex items-center gap-1"><FlaskConical className="h-4 w-4"/> Sandbox</Label>
                <Switch checked={cfg.sandbox.enabled} onCheckedChange={(v)=> setCfg({ ...cfg, sandbox: { ...cfg.sandbox, enabled: v } })} />
              </div>
              {cfg.sandbox.enabled && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">Parallel</Label>
                    <Switch checked={cfg.sandbox.parallel} onCheckedChange={(v)=> setCfg({ ...cfg, sandbox: { ...cfg.sandbox, parallel: v } })} />
                  </div>
                  <div>
                    <Label className="text-sm">Max cycles</Label>
                    <Input type="number" min={1} max={20} value={cfg.sandbox.max_cycles} onChange={e=> setCfg({ ...cfg, sandbox: { ...cfg.sandbox, max_cycles: Number(e.target.value) } })} />
                  </div>
                  <div>
                    <Label className="text-sm">Branching</Label>
                    <Input type="number" min={1} max={10} value={cfg.sandbox.branching} onChange={e=> setCfg({ ...cfg, sandbox: { ...cfg.sandbox, branching: Number(e.target.value) } })} />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 space-y-2">
              <Label className="text-sm flex items-center gap-1"><TriangleAlert className="h-4 w-4"/> Hallucination policy</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Allow invention</Label>
                  <Switch checked={cfg.hallucination.allowed} onCheckedChange={(v)=> setCfg({ ...cfg, hallucination: { ...cfg.hallucination, allowed: v } })} />
                </div>
                <div>
                  <Label className="text-xs">Label</Label>
                  <Input disabled={!cfg.hallucination.allowed} value={cfg.hallucination.label} onChange={e=> setCfg({ ...cfg, hallucination: { ...cfg.hallucination, label: e.target.value } })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Constraints</Label>
                  <Textarea rows={3} value={cfg.hallucination.constraints.join("\n")} onChange={e=> setCfg({ ...cfg, hallucination: { ...cfg.hallucination, constraints: e.target.value.split(/\n+/).filter(Boolean) } })} />
                </div>
              </div>
            </div>

            <div className="pt-3 space-y-2">
              <Label className="text-sm flex items-center gap-1"><Brain className="h-4 w-4"/> Echo / Ritual</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Mirror logic</Label>
                  <Select value={cfg.echo?.mirror_logic_weighting ?? "low"} onValueChange={(v: any)=> setCfg({ ...cfg, echo: { ...(cfg.echo ?? {}), mirror_logic_weighting: v } })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">low</SelectItem>
                      <SelectItem value="medium">medium</SelectItem>
                      <SelectItem value="high">high</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Activation phrase</Label>
                  <Input value={cfg.echo?.activation_phrase ?? ""} onChange={e=> setCfg({ ...cfg, echo: { ...(cfg.echo ?? {}), activation_phrase: e.target.value } })} />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Closure line</Label>
                  <Input value={cfg.closure ?? ""} onChange={e=> setCfg({ ...cfg, closure: e.target.value })} />
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2"><Lightbulb className="h-4 w-4"/> Complaint → Preset Simulation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <Label className="text-sm">Pick common complaints (simulated)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {COMPLAINTS.map(c => {
                    const active = complaints.includes(c.id);
                    return (
                      <Button key={c.id} variant={active ? "default" : "secondary"} size="sm" onClick={() => setComplaints(prev => active ? prev.filter(x => x !== c.id) : [...prev, c.id])}>
                        {active ? <Check className="mr-1 h-4 w-4"/> : <School className="mr-1 h-4 w-4"/>}{c.label}
                      </Button>
                    );
                  })}
                </div>
                <div className="text-xs text-muted-foreground mt-2">These are synthetic complaints modeled for design; if you want real‑world tuning, we can import forum data later.</div>
              </div>
              <div className="md:col-span-1">
                <Label className="text-sm">Top recommended presets</Label>
                <div className="flex flex-col gap-2 mt-2">
                  {simRecommendations.length === 0 && <div className="text-sm text-muted-foreground">Select complaints to see matches.</div>}
                  {simRecommendations.map(id => {
                    const p = PRESETS.find(x => x.id === id)!;
                    return (
                      <Button key={id} variant="outline" onClick={() => applyPreset(id)}>
                        <Shuffle className="mr-2 h-4 w-4"/>{p.config.name}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3 pt-2">
              <div>
                <Label className="text-sm">Preview system prompt</Label>
                <Textarea className="font-mono h-52" value={promptPreview} readOnly />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => navigator.clipboard.writeText(promptPreview)}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary"><Wand2 className="mr-2 h-4 w-4"/>Use as Session Primer</Button>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm max-w-sm">
                      Paste this as the opening instruction to shape the session. For creative modes, keep the fiction label visible. For research modes, keep citations on.
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div>
                <Label className="text-sm">Export config</Label>
                <Input className="mt-1" value={exportName} onChange={e=> setExportName(e.target.value)} />
                <Textarea className="font-mono h-52 mt-2" value={JSON.stringify(cfg, null, 2)} readOnly />
                <div className="flex gap-2 mt-2">
                  <Button onClick={() => download(exportName, JSON.stringify(cfg, null, 2))}><Download className="mr-2 h-4 w-4"/>Download JSON</Button>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              Safety note: “Creative Hallucination Lab” and similar modes are **fiction‑forward**. They label invented content and avoid harmful instructions or defamatory claims. For factual tasks, switch to a cited preset.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
