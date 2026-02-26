#!/usr/bin/env python3
"""
Seed the remaining PLT docs (no Frappe mapping candidate) with minimal 3plug-native schema templates.

Targets are the docs that still have empty schema.fields after exact Frappe seeding.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8-sig"))


def dump_json(path: Path, data: dict[str, Any]) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def base_field(field_id: str, label: str, ftype: str, *, required: bool = False, read_only: bool = False, default=None):
    return {
        "field_id": field_id,
        "label": label,
        "type": ftype,
        "required": required,
        "read_only": read_only,
        "options": None,
        "default": default,
        "linked_doc": None,
        "indexed": False,
        "ui": {
            "visible": True,
            "list_visible": False,
            "filterable": False,
            "sortable": True,
        },
        "source": {
            "kind": "3plug_native_seed",
        },
    }


def select_field(field_id: str, label: str, values: list[str], *, default=None, required: bool = False):
    f = base_field(field_id, label, "Select", required=required, default=default)
    f["options"] = {"values": values}
    return f


def doc_fields_for_role(doc_key: str) -> list[dict[str, Any]]:
    common = [
        base_field("record_id", "Record ID", "Data", read_only=True),
        base_field("title", "Title", "Data", required=True),
        base_field("description", "Description", "Long Text"),
        select_field("priority", "Priority", ["low", "medium", "high", "critical"], default="medium"),
        base_field("owner_user", "Owner User", "Link"),
        base_field("created_at", "Created At", "Datetime", read_only=True),
        base_field("updated_at", "Updated At", "Datetime", read_only=True),
    ]

    if "_bt1_request" in doc_key:
        return common + [
            select_field("request_type", "Request Type", ["test", "restore", "alert", "incident", "policy"], required=True),
            base_field("target_scope", "Target Scope", "Data", required=True),
            select_field("status", "Status", ["draft", "submitted", "queued"], default="draft", required=True),
        ]
    if "_bt2_status" in doc_key:
        return common + [
            base_field("source_record_id", "Source Record ID", "Data", required=True),
            select_field("current_status", "Current Status", ["open", "in_progress", "blocked", "resolved", "closed"], required=True),
            base_field("status_reason", "Status Reason", "Small Text"),
            base_field("effective_at", "Effective At", "Datetime", required=True),
        ]
    if "_bt2_work_log" in doc_key:
        return common + [
            base_field("source_record_id", "Source Record ID", "Data", required=True),
            select_field("work_type", "Work Type", ["observation", "action", "validation", "escalation"], required=True),
            base_field("work_note", "Work Note", "Long Text", required=True),
            base_field("worked_at", "Worked At", "Datetime", required=True),
        ]
    if "_bt3_closure" in doc_key:
        return common + [
            base_field("source_record_id", "Source Record ID", "Data", required=True),
            select_field("closure_status", "Closure Status", ["closed", "completed", "cancelled"], required=True),
            base_field("closure_summary", "Closure Summary", "Long Text", required=True),
            base_field("closed_at", "Closed At", "Datetime", required=True),
        ]
    # fallback
    return common


def main() -> int:
    seeded = 0
    targets = []
    for schema_path in sorted(PLT_APP_ROOT.rglob("submodule/*/docs/*/schema.json")):
        schema = load_json(schema_path)
        if schema.get("fields"):
            continue
        doc_key = schema.get("doc_key") or schema_path.parent.name
        targets.append((schema_path, doc_key))

    for schema_path, doc_key in targets:
        schema = load_json(schema_path)
        schema["fields"] = doc_fields_for_role(doc_key)
        schema["child_tables"] = schema.get("child_tables") or []
        schema["validation_rules"] = schema.get("validation_rules") or []
        schema["naming_rule"] = schema.get("naming_rule") or {"strategy": "series", "pattern": None}
        schema["source"] = "3plug_native_manual_seed"
        schema["native_seed_reference"] = {
            "generator": "scripts/plt_seed_remaining_native_docs.py",
            "reason": "No exact Frappe mapping candidate available (build_from_scratch)",
        }
        dump_json(schema_path, schema)
        seeded += 1

    print(json.dumps({"remaining_targets_found": len(targets), "seeded": seeded}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

