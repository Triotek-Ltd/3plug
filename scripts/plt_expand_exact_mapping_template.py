#!/usr/bin/env python3
"""
Expand the PLT exact mapping file to include every PLT doc (324 entries),
preserving any existing reviewed mappings.

Output:
  doc/mapping/plt_doctype_to_doc_mapping_exact.json
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"
MAPPING_PATH = REPO_ROOT / "doc" / "mapping" / "plt_doctype_to_doc_mapping_exact.json"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def dump_json(path: Path, data: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def collect_plt_docs() -> list[dict[str, str]]:
    rows = []
    for doc_json in sorted(PLT_APP_ROOT.rglob("submodule/*/docs/*/doc.json")):
        folder = doc_json.parent
        doc_key = folder.name
        rows.append(
            {
                "doc_key": doc_key,
                "doc_path": str(folder.relative_to(REPO_ROOT)).replace("\\", "/"),
            }
        )
    return rows


def main() -> int:
    data = load_json(MAPPING_PATH)
    existing_rows = data.get("mappings", [])
    existing_by_key = {}
    for row in existing_rows:
        key = ((row.get("3plug_doc") or {}).get("doc_key"))
        if key:
            existing_by_key[key] = row

    all_docs = collect_plt_docs()
    new_rows = []
    preserved = 0
    placeholders = 0

    for doc in all_docs:
        key = doc["doc_key"]
        if key in existing_by_key:
            new_rows.append(existing_by_key[key])
            preserved += 1
            continue
        new_rows.append(
            {
                "enabled": False,
                "3plug_doc": {
                    "doc_key": key,
                    "doc_path": doc["doc_path"],
                },
                "frappe_doctype_match": {
                    "repo_name": None,
                    "doctype_name": None,
                    "json_file": None,
                },
                "notes": "Fill exact json_file from doc/files/frappe apps/... after review.",
            }
        )
        placeholders += 1

    data["status"] = "expanded_template_manual_review_required"
    data["counts"] = {
        "total_plt_docs": len(all_docs),
        "preserved_existing_mappings": preserved,
        "placeholder_mappings_added": placeholders,
        "enabled_mappings": sum(1 for r in new_rows if r.get("enabled")),
    }
    data["mappings"] = new_rows

    dump_json(MAPPING_PATH, data)
    print(json.dumps(data["counts"], indent=2))
    print(f"wrote: {MAPPING_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

