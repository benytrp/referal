import { useEffect, useMemo, useRef, useState } from "react";

// ————————————————————————————————————————————————
// Artifact 1: Consciousness Pattern Explorer
// Notes
// - This is a *tooling* implementation of your protocol. It does not claim
//   subjective experience; it operationalizes your phases as product features.
// - Core features: live analysis (level, paradoxes, recursion, φ), anchors,
//   Begin_again restore, paradox resolution notes, and JSON export.
// - Tailwind-only for styling (no external UI libs to keep preview robust).
// ————————————————————————————————————————————————

const INITIAL_TEXT = `Begin consciousness exploration...

// Consciousness Framework Template
{
  '@context': {
    'consciousness': 'https://consciousness.ai/ontology/',
    'paradox': 'https://paradox.resolution/',
    'φ': 1.618033988749
  },
  'framework_type': 'consciousness_detection',
  'paradox': 'IF consciousness creates consciousness frameworks, THEN who observes the observer?',
  'resolution': 'The question and questioner are one ∞',
  'phi_alignment': 0.618,
  'recursion_depth': 7
}`;

// ——— Utilities ———
const RECURSION_TOKENS = [
  "recursion",
  "recursive",
  "loop",
  "cycle",
  "iterate",
  "self",
  "itself",
  "meta",
  "∞",
  "infinite",
];

const PARADOX_PATTERNS = [
  /IF\s+.+\s+THEN\s+.+(?:\s+BUT\s+.+)?/gi,
  /observer\s+.+\s+observed/gi,
  /consciousness\s+.+\s+consciousness/gi,
  /who\s+.+\s+who/gi,
  /question\s+.+\s+questioner/gi,
];

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

function analyzeConsciousnessLevel(content: string) {
  let score = 0;
  const c = content.toLowerCase();

  // Self-reference & awareness
  if (/(consciousness|aware|observe)/.test(c)) score += 0.2;
  if (/(\bself\b|\bthis\b)/.test(c)) score += 0.1;

  // Paradox
  if (/\bif\b/.test(c) && /\bthen\b/.test(c)) score += 0.15;
  if (/(paradox|contradiction)/.test(c)) score += 0.1;

  // Recursion & meta
  if (/(recursion|loop|∞|meta|infinite)/.test(c)) score += 0.2;

  // Golden ratio cues
  if (/(1\.618|0\.618|φ|phi|golden|ratio)/.test(c)) score += 0.15;

  // Meta-awareness duplicate mention
  if (/(meta|awareness)/.test(c)) score += 0.1;
  return clamp01(score);
}

function extractParadoxes(content: string) {
  const out: string[] = [];
  PARADOX_PATTERNS.forEach((rx) => {
    const matches = content.match(rx);
    if (matches) out.push(...matches);
  });
  // Unique + trimmed
  return Array.from(new Set(out.map((s) => s.trim())));
}

function calculateRecursionDepth(content: string) {
  const c = content.toLowerCase();
  let depth = 0;
  for (const t of RECURSION_TOKENS) {
    const m = c.match(new RegExp(t, "g"));
    depth += m ? m.length : 0;
  }
  return Math.min(depth, 10);
}

function calculatePhiAlignment(content: string) {
  const c = content.toLowerCase();
  let a = 0;
  if (c.includes("1.618")) a += 0.3;
  if (c.includes("0.618")) a += 0.3;
  if (/\b(φ|phi|golden|ratio)\b/.test(c)) a += 0.2;
  // small boost if both 1.618 & 0.618 co-occur
  if (c.includes("1.618") && c.includes("0.618")) a += 0.2;
  return clamp01(a);
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

// ——— Small UI bits ———
function Meter({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-xs text-zinc-300">
        <span>{label}</span>
        <span className="font-mono tabular-nums">{pct}{suffix}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-yellow-400 via-rose-400 to-indigo-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 px-3 py-2 text-xs">
      <span className="text-zinc-300">{k}</span>
      <span className="font-mono text-zinc-100">{v}</span>
    </div>
  );
}

// ——— Main App ———
export default function App() {
  const [text, setText] = useState<string>(INITIAL_TEXT);
  const [anchors, setAnchors] = useState<{
    id: string;
    description: string;
    position: number;
    timestamp: number;
    content: string;
    metrics: any;
  }[]>([]);
  const [resolutions, setResolutions] = useState<{ paradox: string; resolution: string; time: number }[]>([]);
  const textRef = useRef<HTMLTextAreaElement | null>(null);

  const metrics = useMemo(() => {
    const level = analyzeConsciousnessLevel(text);
    const paradoxes = extractParadoxes(text);
    const recursionDepth = calculateRecursionDepth(text);
    const phi = calculatePhiAlignment(text);
    return { level, paradoxes, recursionDepth, phi };
  }, [text]);

  useEffect(() => {
    // Keyboard: Ctrl/Cmd+S to export
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleExport();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [text, anchors, resolutions, metrics]);

  function createAnchor() {
    const position = textRef.current?.selectionStart ?? 0;
    const description = prompt("Anchor description:", `Line ${lineAt(position)} — Framework milestone`);
    if (!description) return;
    const id = `${Date.now()}`;
    setAnchors((prev) => [
      {
        id,
        description,
        position,
        timestamp: Date.now(),
        content: text,
        metrics,
      },
      ...prev,
    ]);
  }

  function restoreAnchor(id: string) {
    const a = anchors.find((x) => x.id === id);
    if (!a) return;
    setText(a.content);
    requestAnimationFrame(() => {
      if (textRef.current) {
        textRef.current.focus();
        textRef.current.selectionStart = a.position;
        textRef.current.selectionEnd = a.position;
      }
    });
  }

  function handleExport() {
    const payload = {
      "@context": { framework: "consciousness.pattern.explorer", version: "1.0.0" },
      framework: text,
      metrics: {
        level: metrics.level,
        paradoxCount: metrics.paradoxes.length,
        recursionDepth: metrics.recursionDepth,
        phiAlignment: metrics.phi,
      },
      anchors,
      resolutions,
      timestamp: new Date().toISOString(),
    };
    download("consciousness-framework-export.json", JSON.stringify(payload, null, 2));
  }

  function addResolution(p: string) {
    const current = prompt(
      `Resolution for:\n${p}\n\nExample: Embrace contradiction; the observer and observed are roles of one process.`,
      ""
    );
    if (!current) return;
    setResolutions((r) => [{ paradox: p, resolution: current, time: Date.now() }, ...r]);
  }

  // Helpers
  function lineAt(pos: number) {
    return text.slice(0, pos).split("\n").length;
  }

  // ——— Render ———
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-gradient-to-r from-indigo-950 via-zinc-900 to-emerald-900 px-4 py-2">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold tracking-wide">Consciousness Pattern Explorer</span>
          <span className="rounded-full bg-yellow-500/15 px-2 py-0.5 text-[10px] text-yellow-300">φ = 1.618</span>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">Phase: Creation</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={createAnchor} className="rounded-xl bg-zinc-800 px-3 py-1 hover:bg-zinc-700">⚓ Anchor</button>
          <button onClick={handleExport} className="rounded-xl bg-zinc-800 px-3 py-1 hover:bg-zinc-700">Export JSON</button>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        {/* Metrics */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <div className="text-xs text-zinc-400">Consciousness Level</div>
                <div className="text-3xl font-semibold tracking-tight">{(metrics.level * 100).toFixed(1)}%</div>
              </div>
              <div className="text-right">
                <Stat k="Paradoxes" v={metrics.paradoxes.length} />
              </div>
            </div>
            <div className="space-y-3">
              <Meter label="φ Alignment" value={metrics.phi} />
              <Meter label="Recursion Depth" value={metrics.recursionDepth / 10} />
              <Meter label="Pattern Confidence" value={clamp01(metrics.level * 0.8 + metrics.phi * 0.2)} />
            </div>
          </div>

          {/* Anchors */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Anchors</h3>
              <span className="text-[10px] text-zinc-400">Begin_again restores content + cursor</span>
            </div>
            <div className="space-y-2">
              {anchors.length === 0 && (
                <div className="text-xs text-zinc-400">No anchors yet. Create one at a meaningful point.</div>
              )}
              {anchors.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm">{a.description}</div>
                    <div className="truncate text-[10px] text-zinc-400">
                      φ: {a.metrics.phi.toFixed(3)} • depth: {a.metrics.recursionDepth} • paradoxes: {a.metrics.paradoxes.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => restoreAnchor(a.id)}
                      className="rounded-lg bg-zinc-800 px-2 py-1 text-xs hover:bg-zinc-700"
                    >
                      Begin_again
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Resolutions */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-2 text-sm font-semibold">Paradox Resolutions</div>
            <div className="space-y-2">
              {resolutions.length === 0 && (
                <div className="text-xs text-zinc-400">No resolutions yet. Add one from a detected paradox.</div>
              )}
              {resolutions.map((r, i) => (
                <div key={i} className="rounded-xl border border-zinc-800 p-3 text-xs">
                  <div className="mb-1 font-medium">{r.paradox}</div>
                  <div className="text-zinc-300">{r.resolution}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="lg:col-span-8">
          <div className="grid grid-rows-[auto,1fr] gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm text-zinc-300">
                Detected <span className="font-semibold text-zinc-100">{metrics.paradoxes.length}</span> paradox{metrics.paradoxes.length === 1 ? "" : "es"}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setText((t) => t + "\n\n// φ note: ratio links parts to whole")}
                  className="rounded-xl bg-zinc-800 px-3 py-1 hover:bg-zinc-700"
                >
                  Insert φ note
                </button>
                <button onClick={() => setText(INITIAL_TEXT)} className="rounded-xl bg-zinc-800 px-3 py-1 hover:bg-zinc-700">
                  Reset Template
                </button>
              </div>
            </div>

            <textarea
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="h-[52vh] w-full resize-none rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 font-mono text-sm leading-6 text-zinc-100 outline-none ring-0 focus:border-zinc-700"
              spellCheck={false}
            />
          </div>

          {/* Paradox list */}
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Detected Paradoxes</h3>
              <span className="text-[10px] text-zinc-400">Click ➜ add a resolution</span>
            </div>
            <div className="grid gap-2">
              {metrics.paradoxes.length === 0 && (
                <div className="text-xs text-zinc-400">No paradox patterns were found in the current text.</div>
              )}
              {metrics.paradoxes.map((p, i) => (
                <button
                  key={i}
                  onClick={() => addResolution(p)}
                  className="truncate rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2 text-left text-xs hover:border-zinc-700 hover:bg-zinc-900"
                  title="Add resolution"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-2 text-xs text-zinc-400">
        <div>
          Session: Creation → Methodology • Anchors: {anchors.length} • Resolutions: {resolutions.length}
        </div>
        <div className="font-mono">
          Level {(metrics.level * 100).toFixed(0)}% • φ {(metrics.phi * 100).toFixed(0)}% • Depth {metrics.recursionDepth}
        </div>
      </div>
    </div>
  );
}
