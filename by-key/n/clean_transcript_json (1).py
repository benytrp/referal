#!/usr/bin/env python3
"""
clean_transcript_json.py

Usage:
  python clean_transcript_json.py INPUT_PATH [--outdir OUTDIR] [--emit-schema] [--validate]

What it does:
  - Reads a messy transcript or CMD paste that *contains* JSON islands.
  - Strips common noise lines and invisible filler characters.
  - Extracts valid JSON objects by scanning for balanced braces (skipping strings).
  - Deduplicates objects.
  - Classifies them (bridgefile / contract_spec / cycle_log_entry / unknown).
  - Saves:
      1) Nvrstry.cleaned.json => {"records": [...]} (all extracted JSON objects)
      2) Nvrstry.cleaned.summary.txt => quick report of what's inside
      3) Nvrstry.canonical.json => merged canonical JSON (BridgeFile + Contract + Cycle Log)
  - If --emit-schema is set, writes Nvrstry.canonical.schema.json (JSON Schema 2020-12)
  - If --validate is set, attempts to validate canonical against the schema (needs `jsonschema`)
"""

import argparse
import json
import os
import re
import sys
from typing import List, Tuple, Dict, Any

INVISIBLE = [
    "\u200b",  # zero-width space
    "\u200c",  # zero-width non-joiner
    "\u200d",  # zero-width joiner
    "\ufeff",  # BOM
    "ㅤ",       # hangul filler often pasted from UIs
]

NOISE_PREFIXES = (
    "You said:", "ChatGPT said:", "Thought", "Images created", "Share",
    "Process", "Clear", "Formatted Output", "Cycle:", "Operation:", "Output:",
    "Microsoft (R)", "Destination is not a directory:", "Reading documents",
)

DROP_PATTERNS = [
    re.compile(r".+ was unexpected at this time\.", re.IGNORECASE),
    re.compile(r"The system cannot find .+", re.IGNORECASE),
    re.compile(r"'.+' is not recognized as an internal or external command", re.IGNORECASE),
]

def read_text(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def strip_invisibles(s: str) -> str:
    for ch in INVISIBLE:
        s = s.replace(ch, "")
    return s

def filter_lines(text: str) -> str:
    lines = text.splitlines()
    filtered = []
    for line in lines:
        s = line.strip()
        if not s:
            continue
        if s.startswith("'"):  # echoed token column
            continue
        if any(s.startswith(pfx) for pfx in NOISE_PREFIXES):
            continue
        if any(p.search(s) for p in DROP_PATTERNS):
            continue
        if s.lower() == "continue":
            continue
        filtered.append(line)
    return "\n".join(filtered)

def extract_json_objects(text: str) -> List[Any]:
    """Scan text for balanced-brace JSON objects, skipping braces inside strings."""
    objs = []
    seen = set()

    depth = 0
    start_idx = None
    in_string = False
    escape = False

    for i, ch in enumerate(text):
        if in_string:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == "{":
                if depth == 0:
                    start_idx = i
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0 and start_idx is not None:
                    candidate = text[start_idx:i+1]
                    try:
                        obj = json.loads(candidate)
                        key = json.dumps(obj, sort_keys=True, ensure_ascii=False)
                        if key not in seen:
                            seen.add(key)
                            objs.append(obj)
                    except Exception:
                        pass
                    start_idx = None
    return objs

def classify(o: Any) -> str:
    if isinstance(o, dict):
        if "project_metadata" in o and "story_elements" in o:
            return "bridgefile"
        if "trigger" in o and "contract" in o and "phases" in o:
            return "contract_spec"
        if all(k in o for k in ("cycle", "phase", "op", "output", "timestamp")):
            return "cycle_log_entry"
    if isinstance(o, list):
        if o and isinstance(o[0], dict) and "cycle" in o[0]:
            return "cycle_log_array"
    return "unknown"

def is_template_bridgefile(b: Dict[str, Any]) -> bool:
    try:
        title = b["project_metadata"].get("title", "")
        return title.strip().lower().startswith("the official title of the creative work")
    except Exception:
        return False

def choose_bridgefile(bridgefiles: List[Dict[str, Any]]) -> Dict[str, Any]:
    for b in bridgefiles:
        if not is_template_bridgefile(b):
            return b
    return bridgefiles[0] if bridgefiles else {}

def score_contract(c: Dict[str, Any]) -> int:
    goal = str(c.get("contract", {}).get("goal", ""))
    constraints = " ".join(map(str, c.get("contract", {}).get("constraints", [])))
    hay = (goal + " " + constraints).lower()
    return int("if then therefore" in hay or "if–then–therefore" in hay or "if-then-therefore" in hay)

def choose_contract(contracts: List[Dict[str, Any]]) -> Dict[str, Any]:
    if not contracts:
        return {}
    contracts = sorted(contracts, key=score_contract, reverse=True)
    return contracts[0]

def build_canonical(records: List[Any]) -> Dict[str, Any]:
    bridgefiles = [o for o in records if isinstance(o, dict) and "project_metadata" in o and "story_elements" in o]
    contracts = [o for o in records if isinstance(o, dict) and "trigger" in o and "contract" in o and "phases" in o]
    cycles = [o for o in records if isinstance(o, dict) and all(k in o for k in ("cycle","phase","op","output","timestamp"))]

    canonical: Dict[str, Any] = {}

    bf = choose_bridgefile(bridgefiles)
    if bf:
        canonical.update(bf)

    ct = choose_contract(contracts)
    if ct:
        canonical["trigger"] = ct.get("trigger")
        canonical["contract"] = ct.get("contract")
        canonical["phases"] = ct.get("phases")
        canonical["metadata"] = ct.get("metadata", {})

    if cycles:
        canonical["cycle_log"] = cycles

    return canonical

def write_json(path: str, data: Any) -> None:
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def make_summary(objs: List[Any]) -> str:
    lines = [f"Found {len(objs)} JSON object(s)."]
    for idx, o in enumerate(objs, 1):
        t = classify(o)
        if isinstance(o, dict):
            keys = list(o.keys())
            preview = ", ".join(keys[:4]) + ("..." if len(keys) > 4 else "")
        else:
            preview = f"{type(o).__name__}"
        lines.append(f"[{idx:02}] type={t} keys={preview}")
    return "\n".join(lines)

def make_canonical_schema() -> Dict[str, Any]:
    """Return a JSON Schema (2020-12) for the canonical artifact with $defs."""
    return {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "title": "Nvrstry Canonical Artifact",
        "type": "object",
        "properties": {
            "project_metadata": { "$ref": "#/$defs/ProjectMetadata" },
            "story_elements": { "$ref": "#/$defs/StoryElements" },
            "technical_details": { "$ref": "#/$defs/TechnicalDetails" },
            "version_control": { "$ref": "#/$defs/VersionControl" },
            "trigger": { "type": ["string", "null"] },
            "contract": { "$ref": "#/$defs/Contract" },
            "phases": {
                "type": "array",
                "items": { "$ref": "#/$defs/Phase" }
            },
            "metadata": { "$ref": "#/$defs/Metadata" },
            "cycle_log": {
                "type": "array",
                "items": { "$ref": "#/$defs/CycleLogEntry" }
            }
        },
        "additionalProperties": True,
        "$defs": {
            "ProjectMetadata": {
                "type": "object",
                "properties": {
                    "title": { "type": "string" },
                    "logline": { "type": "string" },
                    "project_id": { "type": "string" }
                },
                "additionalProperties": True
            },
            "StoryElements": {
                "type": "object",
                "properties": {
                    "genre": { "type": "array", "items": { "type": "string" } },
                    "themes": { "type": "array", "items": { "type": "string" } },
                    "setting": {
                        "type": "object",
                        "properties": {
                            "primary_location": { "type": "string" },
                            "time_period": { "type": "string" }
                        },
                        "additionalProperties": True
                    },
                    "characters": {
                        "type": "object",
                        "properties": {
                            "protagonist": {
                                "type": "object",
                                "properties": {
                                    "name": { "type": "string" },
                                    "arc": { "type": "string" }
                                },
                                "additionalProperties": True
                            },
                            "antagonist": {
                                "type": "object",
                                "properties": {
                                    "name": { "type": "string" }
                                },
                                "additionalProperties": True
                            }
                        },
                        "additionalProperties": True
                    },
                    "plot": {
                        "type": "object",
                        "properties": {
                            "inciting_incident": { "type": "string" },
                            "climax": { "type": "string" },
                            "resolution": { "type": "string" }
                        },
                        "additionalProperties": True
                    }
                },
                "additionalProperties": True
            },
            "TechnicalDetails": {
                "type": "object",
                "properties": {
                    "medium": { "type": "string" },
                    "word_count_target": { "type": ["string", "number"] },
                    "status": { "type": "string" }
                },
                "additionalProperties": True
            },
            "VersionControl": {
                "type": "object",
                "properties": {
                    "last_edited_by": { "type": "string" },
                    "version": { "type": "string" },
                    "timestamp": { "type": "string", "format": "date-time" }
                },
                "additionalProperties": True
            },
            "Contract": {
                "type": "object",
                "properties": {
                    "goal": { "type": "string" },
                    "constraints": { "type": "array", "items": { "type": "string" } },
                    "success_criteria": { "type": "array", "items": { "type": "string" } }
                },
                "additionalProperties": True
            },
            "Phase": {
                "type": "object",
                "properties": {
                    "phase_name": { "type": "string" },
                    "operations": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "op": { "type": "string" },
                                "parameters": { "type": "object" }
                            },
                            "required": ["op"],
                            "additionalProperties": True
                        }
                    },
                    "parallel_sandboxes": { "type": "boolean" },
                    "entropy": { "type": "number", "minimum": 0, "maximum": 1 }
                },
                "required": ["phase_name"],
                "additionalProperties": True
            },
            "Metadata": {
                "type": "object",
                "properties": {
                    "created": { "type": "string", "format": "date-time" },
                    "complexity_level": { "type": "string" },
                    "risk_tolerance": { "type": "string" },
                    "generator": { "type": "string" }
                },
                "additionalProperties": True
            },
            "CycleLogEntry": {
                "type": "object",
                "properties": {
                    "cycle": { "type": ["integer", "string"] },
                    "phase": { "type": "string" },
                    "op": { "type": "string" },
                    "output": {},
                    "contract_ref": { "type": ["string", "null"] },
                    "timestamp": { "type": "string", "format": "date-time" },
                    "entropy": { "type": ["number", "null"] },
                    "contested": { "type": ["boolean", "null"] },
                    "hash_of_entry": { "type": ["string", "null"] }
                },
                "required": ["cycle", "phase", "op", "output", "timestamp"],
                "additionalProperties": True
            }
        }
    }

def try_validate(schema_path: str, json_path: str) -> None:
    try:
        import jsonschema  # type: ignore
    except Exception:
        print("[validate] Skipped (install with: pip install jsonschema)", file=sys.stderr)
        return
    with open(schema_path, "r", encoding="utf-8") as f:
        schema = json.load(f)
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    jsonschema.validate(instance=data, schema=schema)
    print("[validate] canonical JSON is valid against schema.")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", help="Path to messy transcript file containing JSON islands")
    ap.add_argument("--outdir", default=None, help="Directory to write outputs (default: alongside input)")
    ap.add_argument("--emit-schema", action="store_true", help="Also emit JSON Schema for the canonical artifact")
    ap.add_argument("--validate", action="store_true", help="Validate canonical against the emitted schema (requires jsonschema)")
    args = ap.parse_args()

    in_path = args.input
    outdir = args.outdir or os.path.dirname(os.path.abspath(in_path)) or "."

    raw = read_text(in_path)
    raw = strip_invisibles(raw)
    filtered = filter_lines(raw)

    objs = extract_json_objects(filtered)
    cleaned = {"records": objs}

    cleaned_path = os.path.join(outdir, "Nvrstry.cleaned.json")
    with open(cleaned_path, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    summary = make_summary(objs)
    summary_path = os.path.join(outdir, "Nvrstry.cleaned.summary.txt")
    with open(summary_path, "w", encoding="utf-8") as f:
        f.write(summary)

    canonical = build_canonical(objs)
    canonical_path = os.path.join(outdir, "Nvrstry.canonical.json")
    with open(canonical_path, "w", encoding="utf-8") as f:
        json.dump(canonical, f, ensure_ascii=False, indent=2)

    print("Wrote:")
    print(" ", cleaned_path)
    print(" ", summary_path)
    print(" ", canonical_path)
    print()
    print(summary)

    if args.emit_schema:
        schema = make_canonical_schema()
        schema_path = os.path.join(outdir, "Nvrstry.canonical.schema.json")
        with open(schema_path, "w", encoding="utf-8") as f:
            json.dump(schema, f, ensure_ascii=False, indent=2)
        print(" ", schema_path)

        if args.validate:
            try_validate(schema_path, canonical_path)

if __name__ == "__main__":
    main()
