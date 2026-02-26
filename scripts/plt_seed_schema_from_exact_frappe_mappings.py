#!/usr/bin/env python3
"""
Seed PLT submodule doc schema.json from exact approved Frappe doctype JSON mappings.

Reads only:
  doc/mapping/plt_doctype_to_doc_mapping_exact.json

This is exact-only: no heuristics, no candidate search.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
MAPPING_FILE = REPO_ROOT / "doc" / "mapping" / "plt_doctype_to_doc_mapping_exact.json"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def dump_json(path: Path, data: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def _to_bool(value: Any, default: bool = False) -> bool:
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "yes", "y"}
    return default


def translate_field(field: dict[str, Any]) -> dict[str, Any] | None:
    fieldtype = field.get("fieldtype")
    if fieldtype in {"Section Break", "Column Break", "Tab Break", "Button", "HTML"}:
        return None
    field_id = field.get("fieldname")
    if not field_id:
        return None

    linked_doc = field.get("options") if fieldtype in {"Link", "Dynamic Link", "Table", "Table MultiSelect"} else None
    options = None
    if fieldtype == "Select":
        raw = field.get("options")
        if isinstance(raw, str):
            options = {"values": [x.strip() for x in raw.split("\n") if x.strip()]}
        elif raw:
            options = {"raw": raw}

    return {
        "field_id": field_id,
        "label": field.get("label") or field_id.replace("_", " ").title(),
        "type": fieldtype or "Data",
        "required": _to_bool(field.get("reqd")),
        "read_only": _to_bool(field.get("read_only")),
        "options": options,
        "default": field.get("default"),
        "linked_doc": linked_doc if isinstance(linked_doc, str) and linked_doc else None,
        "indexed": _to_bool(field.get("search_index")) or _to_bool(field.get("unique")),
        "ui": {
            "visible": not _to_bool(field.get("hidden")),
            "list_visible": _to_bool(field.get("in_list_view")),
            "filterable": _to_bool(field.get("in_standard_filter")),
            "sortable": True
        },
        "source": {
            "frappe_fieldname": field_id,
            "frappe_fieldtype": fieldtype
        }
    }


def translate_doctype_meta(dt: dict[str, Any]) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    fields = []
    child_tables = []
    for raw in dt.get("fields", []) or []:
        if not isinstance(raw, dict):
            continue
        tf = translate_field(raw)
        if not tf:
            continue
        fields.append(tf)
        if raw.get("fieldtype") in {"Table", "Table MultiSelect"}:
            child_tables.append(
                {
                    "table_id": raw.get("fieldname"),
                    "row_doc_kind": "child",
                    "linked_doc": raw.get("options"),
                    "fields": []
                }
            )

    autoname = dt.get("autoname")
    naming_rule = {"strategy": "series", "pattern": None}
    if isinstance(autoname, str) and autoname.strip():
        if autoname.startswith("naming_series:"):
            naming_rule = {"strategy": "series", "pattern": autoname.split(":", 1)[1] or None}
        elif autoname.lower() == "hash":
            naming_rule = {"strategy": "hash", "pattern": None}
        elif autoname == "UUID":
            naming_rule = {"strategy": "uuid", "pattern": None}
        else:
            naming_rule = {"strategy": "custom", "pattern": autoname}
    return fields, child_tables, naming_rule


def main() -> int:
    parser = argparse.ArgumentParser(description="Seed PLT schema.json from exact Frappe doctype mappings.")
    parser.add_argument("--write", action="store_true", help="Write changes (default dry-run).")
    args = parser.parse_args()

    mapping = load_json(MAPPING_FILE)
    rows = mapping.get("mappings", [])
    summary = {
        "mappings_total": len(rows),
        "enabled": 0,
        "seedable": 0,
        "seeded": 0,
        "skipped_missing_files": 0,
        "skipped_existing_schema_fields": 0
    }

    for row in rows:
        if not row.get("enabled"):
            continue
        summary["enabled"] += 1

        doc_path_value = ((row.get("3plug_doc") or {}).get("doc_path"))
        frappe_json_value = ((row.get("frappe_doctype_match") or {}).get("json_file"))
        if not doc_path_value or not frappe_json_value:
            summary["skipped_missing_files"] += 1
            continue

        doc_folder = (REPO_ROOT / Path(doc_path_value)).resolve() if not Path(doc_path_value).is_absolute() else Path(doc_path_value)
        schema_path = doc_folder / "schema.json"
        if not schema_path.exists():
            summary["skipped_missing_files"] += 1
            continue

        frappe_json_path = Path(frappe_json_value)
        if not frappe_json_path.exists():
            summary["skipped_missing_files"] += 1
            continue

        schema = load_json(schema_path)
        existing_fields = schema.get("fields", [])
        if isinstance(existing_fields, list) and existing_fields:
            summary["skipped_existing_schema_fields"] += 1
            continue

        frappe_dt = load_json(frappe_json_path)
        fields, child_tables, naming_rule = translate_doctype_meta(frappe_dt)
        summary["seedable"] += 1
        if not fields:
            continue

        if args.write:
            schema["fields"] = fields
            schema["child_tables"] = child_tables
            schema["naming_rule"] = naming_rule
            schema["source"] = "frappe_doctype_exact_mapping_seed"
            schema["frappe_seed_reference"] = {
                "json_file": str(frappe_json_path),
                "doctype_name": frappe_dt.get("name"),
                "module": frappe_dt.get("module"),
                "default_view": frappe_dt.get("default_view"),
                "sort_field": frappe_dt.get("sort_field"),
                "sort_order": frappe_dt.get("sort_order")
            }
            dump_json(schema_path, schema)
            summary["seeded"] += 1

    print(json.dumps(summary, indent=2))
    print("mode:", "write" if args.write else "dry-run")
    print("note: exact-only mode reads approved mappings from doc/mapping/plt_doctype_to_doc_mapping_exact.json")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

