#!/usr/bin/env python3
"""
Fill placeholder entries in the PLT exact mapping file using PLT seed candidates.

Rules:
- preserve reviewed/enabled mappings as-is
- fill only placeholders (null frappe_doctype_match.json_file)
- keep filled placeholders disabled (manual exact review still required)
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
EXACT_PATH = REPO_ROOT / "doc" / "mapping" / "plt_doctype_to_doc_mapping_exact.json"
SEED_PATH = REPO_ROOT / "doc" / "mapping" / "plt_doctype_to_doc_mapping_seed.json"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def dump_json(path: Path, data: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main() -> int:
    exact = load_json(EXACT_PATH)
    seed = load_json(SEED_PATH)

    seed_by_key: dict[str, dict[str, Any]] = {}
    for row in seed.get("mappings", []):
        key = ((row.get("3plug_doc") or {}).get("doc_key"))
        if key:
            seed_by_key[key] = row

    stats = {
        "exact_rows": 0,
        "preserved_enabled": 0,
        "filled_placeholders": 0,
        "no_seed_candidate": 0,
        "build_from_scratch_candidates": 0,
    }

    for row in exact.get("mappings", []):
        stats["exact_rows"] += 1
        if row.get("enabled"):
            stats["preserved_enabled"] += 1
            continue

        doc_key = ((row.get("3plug_doc") or {}).get("doc_key"))
        match = row.get("frappe_doctype_match") or {}
        if match.get("json_file"):
            continue

        seed_row = seed_by_key.get(doc_key)
        if not seed_row:
            stats["no_seed_candidate"] += 1
            continue

        top = seed_row.get("frappe_doctype_match")
        if not top:
            stats["build_from_scratch_candidates"] += 1
            row["notes"] = "No candidate in PLT seed mapping. Build from scratch unless manually mapped."
            continue

        row["frappe_doctype_match"] = {
            "repo_name": top.get("repo_name"),
            "doctype_name": top.get("doctype_name"),
            "json_file": top.get("json_file"),
        }
        # Keep exact mapping disabled until reviewed.
        row["enabled"] = False
        fit = top.get("fit_score")
        conf = seed_row.get("confidence")
        row["notes"] = (
            f"Draft candidate from PLT seed mapping (fit={fit}, confidence={conf}). "
            "Review exactness before enabling."
        )
        stats["filled_placeholders"] += 1

    exact["status"] = "expanded_template_with_draft_candidates_manual_review_required"
    exact["draft_fill_stats"] = stats
    dump_json(EXACT_PATH, exact)
    print(json.dumps(stats, indent=2))
    print(f"updated: {EXACT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

