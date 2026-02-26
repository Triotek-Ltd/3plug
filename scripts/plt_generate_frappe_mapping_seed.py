#!/usr/bin/env python3
"""
Generate a PLT-only doc->Frappe doctype candidate mapping seed.

Output:
  doc/mapping/plt_doctype_to_doc_mapping_seed.json

This does not modify PLT docs yet; it prepares the mapping input for schema translation.
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[1]
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"
FRAPPE_INVENTORY = REPO_ROOT / "doc" / "files" / "frappe apps" / "frappe_doctypes_inventory.json"
OUT_PATH = REPO_ROOT / "doc" / "mapping" / "plt_doctype_to_doc_mapping_seed.json"

STOP = {
    "plt",
    "bt",
    "d1",
    "d2",
    "request",
    "detail",
    "status",
    "work",
    "log",
    "approval",
    "closure",
    "record",
    "update",
    "process",
    "initiate",
    "close",
    "core",
}


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8-sig") as f:
        return json.load(f)


def tokenize(*parts: str) -> set[str]:
    text = " ".join([p for p in parts if p])
    tokens = set(re.findall(r"[a-z0-9]+", text.lower()))
    return {t for t in tokens if len(t) > 1 and t not in STOP and not t.isdigit()}


def flatten_frappe_doctypes() -> list[dict[str, Any]]:
    data = load_json(FRAPPE_INVENTORY)
    rows: list[dict[str, Any]] = []
    for repo in data.get("repos", []):
        repo_name = repo.get("repo_name")
        for dt in repo.get("doctypes", []):
            json_file = dt.get("json_file")
            if not json_file:
                continue
            tokens = tokenize(
                dt.get("doctype_name", ""),
                dt.get("module_name", ""),
                dt.get("package_name", ""),
                repo_name or "",
            )
            rows.append(
                {
                    "repo_name": repo_name,
                    "doctype_name": dt.get("doctype_name"),
                    "module_name": dt.get("module_name"),
                    "package_name": dt.get("package_name"),
                    "is_table": dt.get("is_table"),
                    "json_file": json_file,
                    "_tokens": tokens,
                }
            )
    return rows


def plt_doc_rows() -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for doc_json in sorted(PLT_APP_ROOT.rglob("docs/*/doc.json")):
        folder = doc_json.parent
        try:
            d = load_json(doc_json)
        except Exception:
            continue
        cls = d.get("classification", {}) or {}
        doc_key = d.get("doc_key") or folder.name
        rows.append(
            {
                "doc_key": doc_key,
                "doc_title": d.get("doc_title", ""),
                "doc_code": d.get("doc_code"),
                "doc_kind": d.get("doc_kind"),
                "doc_role": cls.get("doc_role"),
                "bundle_id": cls.get("bundle_id"),
                "app_id": cls.get("app_id"),
                "module_id": cls.get("module_id"),
                "submodule_id": cls.get("submodule_id"),
                "path": str(folder),
                "_tokens": tokenize(
                    d.get("doc_title", ""),
                    doc_key,
                    cls.get("module_id", ""),
                    cls.get("submodule_id", ""),
                ),
            }
        )
    return rows


def score(doc_tokens: set[str], dt_tokens: set[str]) -> tuple[float, list[str]]:
    overlap = sorted(doc_tokens & dt_tokens)
    if not overlap:
        return 0.0, []
    # reward overlap with a small bias for exact domain tokens
    score_val = float(len(overlap))
    for key in ("api", "user", "role", "permission", "billing", "license", "subscription",
                "notification", "alert", "monitor", "analytics", "support", "ticket",
                "deploy", "integration", "publisher", "workflow", "auth", "security"):
        if key in overlap:
            score_val += 0.5
    return round(score_val, 2), overlap


def main() -> int:
    frappe_rows = flatten_frappe_doctypes()
    docs = [r for r in plt_doc_rows() if r.get("bundle_id") == "plt"]
    items: list[dict[str, Any]] = []
    mapped = 0

    for row in docs:
        candidates: list[dict[str, Any]] = []
        for dt in frappe_rows:
            fit, overlap = score(row["_tokens"], dt["_tokens"])
            if fit <= 0:
                continue
            candidates.append(
                {
                    "fit_score": fit,
                    "repo_name": dt["repo_name"],
                    "doctype_name": dt["doctype_name"],
                    "module_name": dt["module_name"],
                    "package_name": dt["package_name"],
                    "is_table": dt["is_table"],
                    "json_file": dt["json_file"],
                    "token_overlap": overlap,
                }
            )
        candidates.sort(key=lambda c: (-c["fit_score"], c["repo_name"] or "", c["doctype_name"] or ""))
        top = candidates[:5]
        mapping_status = "mapped_candidate" if top else "build_from_scratch"
        if top:
            mapped += 1
        items.append(
            {
                "mapping_status": mapping_status,
                "confidence": "high" if top and top[0]["fit_score"] >= 5 else "medium" if top else None,
                "3plug_doc": {
                    "doc_key": row["doc_key"],
                    "doc_code": row["doc_code"],
                    "doc_title": row["doc_title"],
                    "doc_kind": row["doc_kind"],
                    "doc_role": row["doc_role"],
                    "bundle_id": row["bundle_id"],
                    "app_id": row["app_id"],
                    "module_id": row["module_id"],
                    "submodule_id": row["submodule_id"],
                    "doc_path": row["path"],
                },
                "frappe_doctype_match": top[0] if top else None,
                "alternate_candidates": top[1:] if len(top) > 1 else [],
            }
        )

    output = {
        "generated_for": "plt",
        "source_files": {
            "plt_docs": "bundles/plt/platform_core/**/submodule/**/docs/*/doc.json",
            "frappe_doctypes_inventory": "doc/files/frappe apps/frappe_doctypes_inventory.json",
        },
        "mapping_method": "plt_seed_token_overlap",
        "note": "PLT-only seed mapping for schema translation. Review top matches before bulk seeding where fit is weak.",
        "counts": {
            "plt_doc_count": len(docs),
            "mapped_candidate_count": mapped,
            "build_from_scratch_count": len(docs) - mapped,
        },
        "mappings": items,
    }

    with OUT_PATH.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(json.dumps(output["counts"], indent=2))
    print(f"wrote: {OUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

