#!/usr/bin/env python3
"""
Build a PLT-only translation inventory for submodule docs.

Outputs a JSON report showing, per doc:
- doc path/classification
- whether runtime doc files exist
- whether matching doctype JSON exists
- doctype field count
- schema field count
- priority hints for platform screens
"""

from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"
OUT_PATH = REPO_ROOT / "doc" / "mapping" / "plt_translation_inventory.json"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def count_doctype_fields(doctype_json: Path | None) -> int:
    if not doctype_json or not doctype_json.exists():
        return 0
    try:
        data = load_json(doctype_json)
    except Exception:
        return 0
    fields = data.get("fields", [])
    if not isinstance(fields, list):
        return 0
    return len(fields)


def priority_for_module(module_id: str) -> str:
    # Prioritize modules likely to back the screens already implemented in src.
    high = {
        "identity_access_management",
        "role_permission_engine",
        "billing_subscription_licensing",
        "localization_i18n_l10n",
        "monitoring_observability",
        "notification_communication_center",
        "publisher_partner_operations",
        "analytics_reporting_intelligence",
    }
    if module_id in high:
        return "high"
    return "normal"


def main() -> int:
    items: list[dict[str, Any]] = []
    module_summary: dict[str, dict[str, Any]] = defaultdict(lambda: {
        "docs": 0,
        "schema_empty_fields": 0,
        "doctype_json_found": 0,
        "doctype_fields_nonempty": 0,
        "runtime_generated": 0,
    })

    for doc_json in sorted(PLT_APP_ROOT.rglob("docs/*/doc.json")):
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

        module_id = parts[module_idx]
        submodule_id = parts[submodule_idx]
        doc_key = parts[docs_idx]

        doctype_json = PLT_APP_ROOT / module_id / "doctype" / doc_key / f"{doc_key}.json"
        runtime_json = folder / f"{doc_key}.json"
        runtime_py = folder / f"{doc_key}.py"
        runtime_js = folder / f"{doc_key}.js"

        try:
            dmeta = load_json(doc_json)
        except Exception:
            dmeta = {}
        try:
            smeta = load_json(schema_json)
        except Exception:
            smeta = {}

        schema_fields = smeta.get("fields", [])
        schema_field_count = len(schema_fields) if isinstance(schema_fields, list) else 0
        doctype_field_count = count_doctype_fields(doctype_json if doctype_json.exists() else None)

        row = {
            "doc_key": doc_key,
            "path": str(folder.relative_to(REPO_ROOT)).replace("\\", "/"),
            "module_id": module_id,
            "submodule_id": submodule_id,
            "doc_title": dmeta.get("doc_title"),
            "doc_kind": dmeta.get("doc_kind"),
            "doc_role": (dmeta.get("classification") or {}).get("doc_role"),
            "priority": priority_for_module(module_id),
            "schema_field_count": schema_field_count,
            "schema_empty_fields": schema_field_count == 0,
            "doctype_json_exists": doctype_json.exists(),
            "doctype_field_count": doctype_field_count,
            "runtime_files": {
                "json": runtime_json.exists(),
                "py": runtime_py.exists(),
                "js": runtime_js.exists(),
            },
        }
        items.append(row)

        ms = module_summary[module_id]
        ms["docs"] += 1
        ms["schema_empty_fields"] += 1 if row["schema_empty_fields"] else 0
        ms["doctype_json_found"] += 1 if row["doctype_json_exists"] else 0
        ms["doctype_fields_nonempty"] += 1 if doctype_field_count > 0 else 0
        ms["runtime_generated"] += 1 if all(row["runtime_files"].values()) else 0

    items.sort(key=lambda x: (0 if x["priority"] == "high" else 1, x["module_id"], x["submodule_id"], x["doc_key"]))

    counters = Counter()
    for item in items:
        counters["docs"] += 1
        counters["schema_empty_fields"] += 1 if item["schema_empty_fields"] else 0
        counters["doctype_json_exists"] += 1 if item["doctype_json_exists"] else 0
        counters["doctype_fields_nonempty"] += 1 if item["doctype_field_count"] > 0 else 0
        counters["runtime_json"] += 1 if item["runtime_files"]["json"] else 0
        counters["runtime_py"] += 1 if item["runtime_files"]["py"] else 0
        counters["runtime_js"] += 1 if item["runtime_files"]["js"] else 0

    output = {
        "bundle": "plt",
        "app": "platform_core",
        "summary": dict(counters),
        "module_summary": dict(sorted(module_summary.items(), key=lambda kv: kv[0])),
        "items": items,
    }

    with OUT_PATH.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(json.dumps(output["summary"], indent=2))
    print(f"wrote: {OUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

