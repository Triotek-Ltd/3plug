#!/usr/bin/env python3
"""
Sync translated PLT doc schemas (source of truth) into legacy PLT doctype JSON bridge files.

Why:
- Current Django migration/generation pipeline is still doctype-json driven.
- We already translated PLT docs into submodule docs/schema.json.
- This script mirrors schema fields into module doctype JSON bridge files so install-app/migrate
  can generate Django wrapper code from real field definitions.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def dump_json(path: Path, data: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def _to_int_bool(v: Any) -> int:
    return 1 if bool(v) else 0


def to_frappe_options(field: dict[str, Any]) -> Any:
    options = field.get("options")
    linked_doc = field.get("linked_doc")
    field_type = field.get("type")
    if field_type in {"Link", "Dynamic Link", "Table", "Table MultiSelect"} and linked_doc:
        return linked_doc
    if isinstance(options, dict):
        values = options.get("values")
        if isinstance(values, list):
            return "\n".join(str(v) for v in values)
        if "raw" in options:
            return options["raw"]
    return None


def to_doctype_field(doc_field: dict[str, Any]) -> dict[str, Any]:
    fieldname = doc_field.get("source", {}).get("frappe_fieldname") or doc_field.get("field_id")
    fieldtype = doc_field.get("source", {}).get("frappe_fieldtype") or doc_field.get("type") or "Data"
    row: dict[str, Any] = {
        "fieldname": fieldname,
        "fieldtype": fieldtype,
    }
    label = doc_field.get("label")
    if label:
        row["label"] = label
    if doc_field.get("required"):
        row["reqd"] = 1
    if doc_field.get("read_only"):
        row["read_only"] = 1
    default = doc_field.get("default")
    if default is not None:
        row["default"] = default

    ui = doc_field.get("ui") or {}
    if ui.get("list_visible"):
        row["in_list_view"] = 1
    if ui.get("filterable"):
        row["in_standard_filter"] = 1
    if ui.get("visible") is False:
        row["hidden"] = 1

    options = to_frappe_options(doc_field)
    if options not in (None, ""):
        row["options"] = options
    return row


def main() -> int:
    stats = {
        "docs_processed": 0,
        "doctype_json_found": 0,
        "doctype_updated": 0,
        "doctype_missing": 0,
        "schema_with_fields": 0,
    }

    for schema_path in sorted(PLT_ROOT.rglob("submodule/*/docs/*/schema.json")):
        stats["docs_processed"] += 1
        schema = load_json(schema_path)
        fields = schema.get("fields") or []
        if not isinstance(fields, list) or not fields:
            continue
        stats["schema_with_fields"] += 1

        doc_key = schema.get("doc_key") or schema_path.parent.name
        parts = schema_path.parts
        try:
            module_id = parts[parts.index("platform_core") + 1]
        except ValueError:
            continue

        doctype_json = PLT_ROOT / module_id / "doctype" / doc_key / f"{doc_key}.json"
        if not doctype_json.exists():
            stats["doctype_missing"] += 1
            continue
        stats["doctype_json_found"] += 1

        djson = load_json(doctype_json)
        djson["fields"] = [to_doctype_field(f) for f in fields if isinstance(f, dict)]

        # Borrow useful meta from translated schema when present.
        if schema.get("naming_rule"):
            nr = schema["naming_rule"]
            strategy = nr.get("strategy")
            pattern = nr.get("pattern")
            if strategy == "series" and pattern:
                djson["autoname"] = f"naming_series:{pattern}"
            elif strategy == "series":
                djson.setdefault("autoname", "naming_series:")
            elif strategy == "uuid":
                djson["autoname"] = "UUID"
            elif strategy == "hash":
                djson["autoname"] = "hash"
            elif strategy == "custom" and pattern:
                djson["autoname"] = pattern

        # Keep bridge metadata if available from schema seed reference.
        seed_ref = schema.get("frappe_seed_reference") or {}
        if seed_ref.get("default_view") and not djson.get("default_view"):
            djson["default_view"] = seed_ref["default_view"]
        if seed_ref.get("sort_field"):
            djson["sort_field"] = seed_ref["sort_field"]
        if seed_ref.get("sort_order"):
            djson["sort_order"] = seed_ref["sort_order"]

        dump_json(doctype_json, djson)
        stats["doctype_updated"] += 1

    print(json.dumps(stats, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

