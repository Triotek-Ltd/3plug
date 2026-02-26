#!/usr/bin/env python3
"""
Generate PLT doc-level runtime files from internal submodule docs.

Source of truth:
  bundles/plt/platform_core/**/submodule/**/docs/<doc_key>/{doc.json,schema.json,actions.json}

Outputs (in the same doc folder):
  <doc_key>.json
  <doc_key>.py
  <doc_key>.js

This is PLT-only on purpose. It is the first step before install/seeding.
"""

from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"
DOC_ACTIONS_MODEL = REPO_ROOT / "doc" / "mapping" / "doc_actions_model.json"


@dataclass
class DocFolder:
    path: Path
    module_id: str
    submodule_id: str
    doc_key: str
    doc_json: Path
    schema_json: Path
    actions_json: Path
    doctype_json: Path | None = None


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def dump_json(path: Path, data: dict[str, Any]) -> None:
    with path.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def find_doc_folders() -> list[DocFolder]:
    results: list[DocFolder] = []
    for doc_json in PLT_APP_ROOT.rglob("docs/*/doc.json"):
        folder = doc_json.parent
        schema_json = folder / "schema.json"
        actions_json = folder / "actions.json"
        if not schema_json.exists() or not actions_json.exists():
            continue

        parts = folder.parts
        try:
            module_idx = parts.index("platform_core") + 1
            submodule_idx = parts.index("submodule") + 1
            docs_idx = parts.index("docs") + 1
        except ValueError:
            continue

        module_path = PLT_APP_ROOT / parts[module_idx]
        candidate_doctype_json = module_path / "doctype" / parts[docs_idx] / f"{parts[docs_idx]}.json"
        results.append(
            DocFolder(
                path=folder,
                module_id=parts[module_idx],
                submodule_id=parts[submodule_idx],
                doc_key=parts[docs_idx],
                doc_json=doc_json,
                schema_json=schema_json,
                actions_json=actions_json,
                doctype_json=candidate_doctype_json if candidate_doctype_json.exists() else None,
            )
        )
    return sorted(results, key=lambda x: str(x.path))


def load_action_vocabulary() -> set[str]:
    model = load_json(DOC_ACTIONS_MODEL)
    return {item.get("action_id") for item in model.get("actions", []) if item.get("action_id")}


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


def translate_doctype_field(field: dict[str, Any]) -> dict[str, Any] | None:
    fieldtype = field.get("fieldtype")
    if fieldtype in {"Section Break", "Column Break", "Tab Break", "HTML", "Button"}:
        return None
    field_id = field.get("fieldname")
    if not field_id:
        return None

    linked_doc = field.get("options") if fieldtype in {"Link", "Dynamic Link", "Table", "Table MultiSelect"} else None
    options_obj = None
    if fieldtype == "Select":
        raw = field.get("options")
        if isinstance(raw, str):
            values = [line.strip() for line in raw.split("\n") if line.strip()]
            options_obj = {"values": values}
        elif raw:
            options_obj = {"raw": raw}
    elif field.get("options") and fieldtype not in {"Link", "Dynamic Link", "Table", "Table MultiSelect"}:
        options_obj = {"raw": field.get("options")}

    return {
        "field_id": field_id,
        "label": field.get("label") or field_id.replace("_", " ").title(),
        "type": fieldtype or "Data",
        "required": _to_bool(field.get("reqd")),
        "read_only": _to_bool(field.get("read_only")),
        "options": options_obj,
        "default": field.get("default"),
        "linked_doc": linked_doc if isinstance(linked_doc, str) and linked_doc else None,
        "indexed": _to_bool(field.get("search_index")) or _to_bool(field.get("unique")),
        "ui": {
            "visible": not _to_bool(field.get("hidden")),
            "list_visible": _to_bool(field.get("in_list_view")),
            "filterable": _to_bool(field.get("in_standard_filter")),
            "sortable": True,
        },
        "source": {
            "doctype_fieldtype": fieldtype,
            "doctype_fieldname": field_id,
        },
    }


def translate_doctype_to_schema_seed(doctype_meta: dict[str, Any]) -> dict[str, Any]:
    raw_fields = doctype_meta.get("fields", []) or []
    translated_fields: list[dict[str, Any]] = []
    child_tables: list[dict[str, Any]] = []

    for raw in raw_fields:
        if not isinstance(raw, dict):
            continue
        translated = translate_doctype_field(raw)
        if not translated:
            continue
        translated_fields.append(translated)
        if raw.get("fieldtype") in {"Table", "Table MultiSelect"}:
            child_tables.append(
                {
                    "table_id": raw.get("fieldname"),
                    "row_doc_kind": "child",
                    "linked_doc": raw.get("options"),
                    "fields": [],
                }
            )

    naming_rule = {"strategy": "series", "pattern": None}
    autoname = doctype_meta.get("autoname")
    if isinstance(autoname, str) and autoname.strip():
        if autoname.startswith("naming_series:"):
            naming_rule = {"strategy": "series", "pattern": autoname.split(":", 1)[1] or None}
        elif autoname in {"hash", "UUID"}:
            naming_rule = {"strategy": "uuid" if autoname == "UUID" else "hash", "pattern": None}
        else:
            naming_rule = {"strategy": "custom", "pattern": autoname}

    permissions = doctype_meta.get("permissions", []) if isinstance(doctype_meta.get("permissions"), list) else []
    permission_seed = [
        {
            "role_id": p.get("role"),
            "actions": [k for k in ("read", "write", "create", "delete", "submit", "cancel", "amend") if _to_bool(p.get(k))]
        }
        for p in permissions
        if isinstance(p, dict) and p.get("role")
    ]

    return {
        "fields": translated_fields,
        "child_tables": child_tables,
        "validation_rules": [],
        "naming_rule": naming_rule,
        "doctype_meta": {
            "name": doctype_meta.get("name"),
            "module": doctype_meta.get("module"),
            "default_view": doctype_meta.get("default_view"),
            "sort_field": doctype_meta.get("sort_field"),
            "sort_order": doctype_meta.get("sort_order"),
            "permissions": permissions,
            "role_action_matrix_seed": permission_seed,
        },
    }


def build_runtime_json(
    doc_meta: dict[str, Any],
    schema: dict[str, Any],
    actions: dict[str, Any],
    doctype_meta: dict[str, Any] | None,
) -> dict[str, Any]:
    action_ids = actions.get("actions", [])
    doctype_seed = translate_doctype_to_schema_seed(doctype_meta) if doctype_meta else None
    schema_fields = schema.get("fields", [])
    schema_child_tables = schema.get("child_tables", [])
    schema_validation_rules = schema.get("validation_rules", [])
    schema_naming_rule = schema.get("naming_rule", {})

    # Borrow from doctype JSON if schema is still empty scaffold.
    if doctype_seed:
        if not schema_fields and doctype_seed.get("fields"):
            schema_fields = doctype_seed["fields"]
        if not schema_child_tables and doctype_seed.get("child_tables"):
            schema_child_tables = doctype_seed["child_tables"]
        if not schema_validation_rules and doctype_seed.get("validation_rules"):
            schema_validation_rules = doctype_seed["validation_rules"]
        if (not schema_naming_rule or not schema_naming_rule.get("pattern")) and doctype_seed.get("naming_rule"):
            schema_naming_rule = doctype_seed["naming_rule"]

    return {
        "doc_key": doc_meta.get("doc_key"),
        "doc_title": doc_meta.get("doc_title"),
        "doc_kind": doc_meta.get("doc_kind"),
        "status": doc_meta.get("status"),
        "classification": doc_meta.get("classification", {}),
        "allowed_actions": action_ids,
        "schema": {
            "schema_version": schema.get("schema_version"),
            "source": schema.get("source"),
            "fields": schema_fields,
            "child_tables": schema_child_tables,
            "validation_rules": schema_validation_rules,
            "naming_rule": schema_naming_rule,
        },
        "interop": {
            "doctype_json_source": {
                "mapped": bool(doctype_meta),
                "path": str(doctype_meta.get("_source_path")) if doctype_meta else None,
                "name": doctype_meta.get("name") if doctype_meta else None,
                "module": doctype_meta.get("module") if doctype_meta else None,
            },
            "borrowed_doctype_meta": doctype_seed.get("doctype_meta") if doctype_seed else None,
        },
        "runtime": {
            "source_of_truth": "doc_folder",
            "generated_from": ["doc.json", "schema.json", "actions.json"],
            "generator": "scripts/plt_generate_doc_runtime.py",
            "todo": [
                "Populate schema.fields and child_tables using PLT mapping translation before install-app seeding",
                "Replace scaffold action sets with doc-specific action subsets where applicable",
            ],
        },
    }


def build_runtime_py(doc_key: str, action_ids: list[str]) -> str:
    methods = []
    for action_id in action_ids:
        methods.append(
            f"    def action_{action_id}(self, doc_id, payload=None):\n"
            f"        \"\"\"Handle '{action_id}' for {doc_key}.\"\"\"\n"
            f"        raise NotImplementedError(\"Implement {doc_key}.{action_id} in backend runtime\")\n"
        )
    methods_block = "\n".join(methods) if methods else "    pass\n"
    return (
        '"""PLT doc runtime hooks for {doc_key}. Generated from internal docs (source of truth)."""\n\n'
        "class DocRuntime:\n"
        f"    doc_key = \"{doc_key}\"\n\n"
        "    def validate(self, payload):\n"
        "        \"\"\"Validate payload against translated schema rules.\"\"\"\n"
        "        return payload\n\n"
        "    def allowed_actions(self):\n"
        f"        return {action_ids!r}\n\n"
        f"{methods_block}"
    ).format(doc_key=doc_key)


def build_runtime_js(doc_key: str, action_ids: list[str]) -> str:
    return (
        f"// PLT doc client/runtime hooks for {doc_key}.\n"
        "// Generated from internal docs (source of truth).\n"
        "// TODO: refine field interactions after schema.fields translation is complete.\n\n"
        f"export const DOC_KEY = \"{doc_key}\";\n"
        f"export const ALLOWED_ACTIONS = {json.dumps(action_ids)};\n\n"
        "export function getVisibleActions(context = {}) {\n"
        "  const { disabledActions = [] } = context;\n"
        "  return ALLOWED_ACTIONS.filter((action) => !disabledActions.includes(action));\n"
        "}\n\n"
        "export function applyFieldBehaviors(values = {}) {\n"
        "  return values;\n"
        "}\n"
    )


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate PLT doc runtime files from internal docs.")
    parser.add_argument("--write", action="store_true", help="Write files to disk (default is dry-run).")
    parser.add_argument("--limit", type=int, default=0, help="Limit number of docs processed (for testing).")
    args = parser.parse_args()

    vocab = load_action_vocabulary()
    folders = find_doc_folders()
    if args.limit and args.limit > 0:
        folders = folders[: args.limit]

    summary = {
        "docs_found": len(folders),
        "generated": 0,
        "invalid_action_refs": 0,
        "schema_empty_fields": 0,
        "doctype_json_found": 0,
        "doctype_fields_borrowed": 0,
    }

    for item in folders:
        doc_meta = load_json(item.doc_json)
        schema = load_json(item.schema_json)
        actions = load_json(item.actions_json)
        doctype_meta = None
        doctype_seed = None
        if item.doctype_json and item.doctype_json.exists():
            doctype_meta = load_json(item.doctype_json)
            doctype_meta["_source_path"] = str(item.doctype_json)
            doctype_seed = translate_doctype_to_schema_seed(doctype_meta)
            summary["doctype_json_found"] += 1
            if doctype_seed.get("fields"):
                summary["doctype_fields_borrowed"] += 1

        action_ids = [a for a in actions.get("actions", []) if isinstance(a, str)]
        invalid = [a for a in action_ids if a not in vocab]
        if invalid:
            summary["invalid_action_refs"] += 1

        fields = schema.get("fields", [])
        if not fields:
            summary["schema_empty_fields"] += 1

        runtime_json = build_runtime_json(doc_meta, schema, actions, doctype_meta)
        runtime_py = build_runtime_py(item.doc_key, action_ids)
        runtime_js = build_runtime_js(item.doc_key, action_ids)

        out_json = item.path / f"{item.doc_key}.json"
        out_py = item.path / f"{item.doc_key}.py"
        out_js = item.path / f"{item.doc_key}.js"

        if args.write:
            # Seed schema.json from doctype JSON only when schema is still empty and doctype has fields.
            if doctype_seed and not (schema.get("fields") or []) and doctype_seed.get("fields"):
                schema["fields"] = doctype_seed["fields"]
                schema["child_tables"] = doctype_seed.get("child_tables", schema.get("child_tables", []))
                schema["naming_rule"] = doctype_seed.get("naming_rule", schema.get("naming_rule", {}))
                schema["source"] = "doctype_translation_seed"
                dump_json(item.schema_json, schema)
            dump_json(out_json, runtime_json)
            out_py.write_text(runtime_py, encoding="utf-8", newline="\n")
            out_js.write_text(runtime_js, encoding="utf-8", newline="\n")
        summary["generated"] += 1

    print(json.dumps(summary, indent=2))
    print("mode:", "write" if args.write else "dry-run")
    print("next: translate/populate schema.fields before running .\\\\3plug.cmd install-app platform_core --site <site>")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
