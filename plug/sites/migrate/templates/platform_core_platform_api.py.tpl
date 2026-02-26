from __future__ import annotations

import importlib.util
import json
from pathlib import Path

from django.apps import apps as django_apps
from django.conf import settings
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods


REPO_ROOT = Path(settings.BASE_DIR).parent
PLT_APP_ROOT = REPO_ROOT / "bundles" / "plt" / "platform_core"
_DOC_CACHE = None


def _api_ok(data):
    return JsonResponse(data, status=200, safe=False)


def _load_json(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None


def _iter_plt_docs():
    global _DOC_CACHE
    if _DOC_CACHE is not None:
        for item in _DOC_CACHE:
            yield item
        return

    docs = []
    if PLT_APP_ROOT.exists():
        for docs_dir in PLT_APP_ROOT.glob("*/submodule/*/docs/*"):
            if not docs_dir.is_dir():
                continue
            docs.append(
                {
                    "doc_key": docs_dir.name,
                    "module_key": docs_dir.parents[3].name,
                    "submodule_key": docs_dir.parents[1].name,
                    "docs_dir": docs_dir,
                    "doc_json": _load_json(docs_dir / "doc.json") or {},
                    "schema_json": _load_json(docs_dir / "schema.json") or {},
                    "runtime_json": _load_json(docs_dir / f"{docs_dir.name}.json") or {},
                }
            )
    _DOC_CACHE = docs
    for item in docs:
        yield item


def _find_doc_item(doc_key: str):
    for item in _iter_plt_docs():
        if item["doc_key"] == doc_key:
            return item
    return None


def _doc_model_class_name(doc_key: str) -> str:
    return "".join(part.title() for part in doc_key.split("_"))


def _get_doc_model(doc_item):
    try:
        return django_apps.get_model("platform_core_app", _doc_model_class_name(doc_item["doc_key"]))
    except Exception:
        return None


def _get_doc_runtime(doc_item):
    runtime_path = doc_item["docs_dir"] / f'{doc_item["doc_key"]}.py'
    if not runtime_path.exists():
        return None
    module_name = f'plt_runtime_{doc_item["doc_key"]}'
    spec = importlib.util.spec_from_file_location(module_name, runtime_path)
    if not spec or not spec.loader:
        return None
    mod = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(mod)
        runtime_cls = getattr(mod, "DocRuntime", None)
        return runtime_cls() if runtime_cls else None
    except Exception:
        return None


def _current_user_payload(request):
    user = getattr(request, "user", None)
    if not user or not getattr(user, "is_authenticated", False):
        return {"id": None, "name": "Guest", "email": ""}
    full_name = ""
    if hasattr(user, "get_full_name"):
        full_name = (user.get_full_name() or "").strip()
    full_name = full_name or getattr(user, "username", "User")
    return {"id": user.pk, "name": full_name, "email": getattr(user, "email", "") or ""}


def _build_session_bootstrap(request):
    user = _current_user_payload(request)
    top_nav = _build_top_nav()
    return {
        "account": {
            "account_type": None,
            "display_name": user["name"] or "Account",
            "email": user["email"],
        },
        "user": user,
        "ui": {"dir": "ltr", "locale": "en"},
        "notifications": [],
        "top_nav": top_nav,
    }


def _build_launcher_catalog():
    modules_map = {}
    submodules = []
    submodule_doc_keys = {}
    for item in _iter_plt_docs():
        mk = item["module_key"]
        sk = item["submodule_key"]
        modules_map.setdefault(mk, {"id": mk, "name": mk.replace("_", " ").title(), "label": mk.replace("_", " ").title()})
        submodule_doc_keys.setdefault((mk, sk), []).append(item["doc_key"])
        submodules.append(
            {
                "id": f"{mk}:{sk}",
                "module_id": mk,
                "submodule_key": sk,
                "name": sk.replace("_", " ").title(),
                "label": sk.replace("_", " ").title(),
                "doc_count": 0,
            }
        )
    seen = set()
    uniq_submodules = []
    for sub in submodules:
        if sub["id"] in seen:
            continue
        seen.add(sub["id"])
        doc_keys = submodule_doc_keys.get((sub["module_id"], sub["submodule_key"]), [])
        sub["doc_keys"] = doc_keys
        sub["doc_count"] = len(doc_keys)
        sub["record_count"] = _count_records_for_doc_keys(doc_keys)
        uniq_submodules.append(sub)
    for mod in modules_map.values():
        module_subs = [s for s in uniq_submodules if s["module_id"] == mod["id"]]
        mod["submodule_count"] = len(module_subs)
        mod["doc_count"] = sum(s.get("doc_count", 0) for s in module_subs)
        mod["record_count"] = sum(s.get("record_count", 0) for s in module_subs)
    launcher_sections = [
        {
            "id": "plt-platform-core",
            "title": "Platform Core",
            "appId": "platform_core",
            "modules": [
                {
                    **mod,
                    "submodules": [
                        s for s in uniq_submodules if s.get("module_id") == mod.get("id")
                    ],
                }
                for mod in list(modules_map.values())
            ],
        }
    ]
    return {
        "bundle": {"id": "plt", "name": "Platform", "label": "Platform"},
        "apps": [{"id": "platform_core", "name": "Platform Core", "label": "Platform Core", "bundle_id": "plt"}],
        "modules": list(modules_map.values()),
        "submodules": uniq_submodules,
        "launcher_sections": launcher_sections,
    }


def _build_apps_payload():
    catalog = _build_launcher_catalog()
    return {"apps": catalog.get("apps", [])}


def _build_modules_payload():
    catalog = _build_launcher_catalog()
    return {"modules": catalog.get("modules", [])}


def _build_submodules_payload():
    catalog = _build_launcher_catalog()
    return {"submodules": catalog.get("submodules", [])}


def _build_workspaces():
    recent_workspaces = _build_recent_workspaces()
    return {"workspaces": recent_workspaces}


def _build_top_nav():
    # Backend-owned shell nav model for PLT workspace screens. This is the
    # canonical source for route hubs in the frontend (no frontend fabrication).
    return [
        {"id": "home", "label": "Home", "href": "/home"},
        {"id": "launcher", "label": "Launcher", "href": "/launcher"},
        {"id": "workbench", "label": "Workbench", "href": "/workbench/doc-builder"},
        {"id": "account", "label": "Account", "href": "/account/setup"},
        {"id": "admin", "label": "Admin", "href": "/admin"},
        {"id": "publisher", "label": "Publisher", "href": "/publisher"},
    ]


def _count_records_for_doc_keys(doc_keys):
    total = 0
    for doc_key in doc_keys:
        item = _find_doc_item(doc_key)
        if not item:
            continue
        model = _get_doc_model(item)
        if not model:
            continue
        try:
            total += model.objects.count()
        except Exception:
            continue
    return total


def _build_recent_workspaces(limit=8):
    recent = []
    for item in _iter_plt_docs():
        model = _get_doc_model(item)
        if not model:
            continue
        try:
            row = model.objects.order_by("-modified").first()
        except Exception:
            row = None
        if not row:
            continue
        recent.append(
            {
                "id": f"{item['doc_key']}:{row.pk}",
                "name": item["doc_key"].replace("_", " ").title(),
                "label": item["doc_key"].replace("_", " ").title(),
                "href": f"/launcher",
                "_modified": getattr(row, "modified", None),
                "doc_key": item["doc_key"],
            }
        )
    recent.sort(key=lambda r: (r.get("_modified") is not None, r.get("_modified")), reverse=True)
    trimmed = []
    for row in recent[:limit]:
        copy = dict(row)
        copy.pop("_modified", None)
        trimmed.append(copy)
    return trimmed


def _build_sandbox_catalog():
    shell_endpoints = [
        {"id": "session_bootstrap", "method": "GET", "path": "platform/session/bootstrap", "type": "shell"},
        {"id": "launcher_catalog", "method": "GET", "path": "platform/launcher/catalog", "type": "shell"},
        {"id": "apps", "method": "GET", "path": "platform/apps", "type": "shell"},
        {"id": "modules", "method": "GET", "path": "platform/modules", "type": "shell"},
        {"id": "submodules", "method": "GET", "path": "platform/submodules", "type": "shell"},
        {"id": "workspaces", "method": "GET", "path": "platform/workspaces", "type": "shell"},
    ]
    docs = []
    for item in _iter_plt_docs():
        runtime = _get_doc_runtime(item)
        actions = []
        if runtime:
            try:
                actions = list(runtime.allowed_actions())
            except Exception:
                actions = []
            docs.append(
                {
                    "app": "platform_core",
                    "doc_key": item["doc_key"],
                    "module": item["module_key"],
                    "module_key": item["module_key"],
                    "submodule": item["submodule_key"],
                    "submodule_key": item["submodule_key"],
                    "actions": actions,
                    "endpoints": {
                    "meta": f"docs/meta/{item['doc_key']}",
                    "list": f"docs/{item['doc_key']}",
                    "detail": f"docs/{item['doc_key']}/<id>",
                    "action": f"docs/{item['doc_key']}/<id>/actions/<action_id>",
                },
            }
        )
    return {"shell_endpoints": shell_endpoints, "docs": docs}


def _serialize_row(instance):
    data = model_to_dict(instance)
    data["id"] = str(getattr(instance, "id", ""))
    return data


@require_GET
def plt_session_bootstrap(request):
    return _api_ok({"data": _build_session_bootstrap(request)})


@require_GET
def plt_launcher_catalog(request):
    return _api_ok({"data": _build_launcher_catalog()})


@require_GET
def plt_workspaces(request):
    return _api_ok({"data": _build_workspaces()})


@require_GET
def plt_sandbox_catalog(request):
    return _api_ok({"data": _build_sandbox_catalog()})


@require_GET
def plt_apps(request):
    return _api_ok({"data": _build_apps_payload()})


@require_GET
def plt_modules(request):
    return _api_ok({"data": _build_modules_payload()})


@require_GET
def plt_submodules(request):
    return _api_ok({"data": _build_submodules_payload()})


@require_GET
def plt_doc_meta(request, doc_key):
    item = _find_doc_item(doc_key)
    if not item:
        return JsonResponse({"error": "Doc not found"}, status=404)
    runtime = _get_doc_runtime(item)
    actions = []
    if runtime:
        try:
            actions = list(runtime.allowed_actions())
        except Exception:
            actions = []
    if not actions:
        runtime_actions = (item["runtime_json"].get("runtime") or {}).get("actions") or []
        actions = [a.get("id") for a in runtime_actions if isinstance(a, dict) and a.get("id")]
    return _api_ok(
        {
            "data": {
                "doc_key": doc_key,
                "module_key": item["module_key"],
                "submodule_key": item["submodule_key"],
                "doc_meta": item["doc_json"],
                "schema": item["schema_json"],
                "allowed_actions": actions,
            }
        }
    )


@require_GET
def plt_doc_list(request, doc_key):
    item = _find_doc_item(doc_key)
    if not item:
        return JsonResponse({"error": "Doc not found"}, status=404)
    model = _get_doc_model(item)
    if not model:
        return _api_ok({"data": [], "total": 0, "doc_key": doc_key})
    try:
        page = max(int(request.GET.get("page", "1")), 1)
        page_length = max(int(request.GET.get("page_length", "25")), 0)
    except ValueError:
        page = 1
        page_length = 25
    qs = model.objects.all().order_by("id")
    total = qs.count()
    if page_length:
        start = (page - 1) * page_length
        end = start + page_length
        qs = qs[start:end]
    rows = [_serialize_row(obj) for obj in qs]
    return _api_ok({"data": rows, "total": total, "current_page": page, "doc_key": doc_key})


@require_GET
def plt_doc_detail(request, doc_key, doc_id):
    item = _find_doc_item(doc_key)
    if not item:
        return JsonResponse({"error": "Doc not found"}, status=404)
    model = _get_doc_model(item)
    if not model:
        return _api_ok({"data": {"id": doc_id}, "doc_key": doc_key})
    try:
        obj = model.objects.get(pk=doc_id)
    except model.DoesNotExist:
        return JsonResponse({"error": "Record not found"}, status=404)
    return _api_ok({"data": _serialize_row(obj), "doc_key": doc_key})


@require_http_methods(["POST"])
def plt_doc_action(request, doc_key, doc_id, action_id):
    item = _find_doc_item(doc_key)
    if not item:
        return JsonResponse({"error": "Doc not found"}, status=404)
    runtime = _get_doc_runtime(item)
    if not runtime:
        return JsonResponse({"error": "Doc runtime unavailable"}, status=500)
    action_fn = getattr(runtime, f"action_{action_id}", None)
    if not callable(action_fn):
        return JsonResponse({"error": f"Action '{action_id}' not supported"}, status=400)
    payload = {}
    try:
        if getattr(request, "body", None):
            payload = json.loads(request.body.decode("utf-8") or "{}")
    except Exception:
        payload = {}
    try:
        payload = runtime.validate(payload)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=400)
    try:
        result = action_fn(doc_id, payload=payload)
        return JsonResponse({"success": True, "data": result}, status=201)
    except NotImplementedError as exc:
        return JsonResponse(
            {
                "success": True,
                "data": {
                    "doc_key": doc_key,
                    "doc_id": doc_id,
                    "action_id": action_id,
                    "status": "not_implemented",
                    "message": str(exc),
                },
            },
            status=201,
        )
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
