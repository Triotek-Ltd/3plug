# 3plug CLI Internal Guide (Dev / Publisher / Platform Ops)

## Purpose

This guide is for internal use only. It documents the full CLI workflow used to scaffold and manage the 3plug platform structure during development.

Public-facing `README.md` is intentionally limited to the public command surface.

## Roles

- Public users
  - Allowed command verbs: `new`, `get`, `drop` (bundle/app level only)
- Developers
  - Full scaffold commands (`module`, `submodule`, `doc`)
- Publishers
  - App scaffold/repo workflows, bundle placement, release prep
- Platform operators
  - install/uninstall/setup/migrate/build/deploy/update/upgrade flows

## Command Surface (Internal)

### Bundle level

- `new-bundle <bundle_name>`
- `drop-bundle <bundle_name>`
- `list-bundles`
- `set-bundles <bundle_names...>`

Compatibility aliases (temporary):
- `new-plug`
- `drop-plug`
- `list-plugs`
- `set-plugs`

## App level

- `new-app <app_name> --bundle <bundle_name>`
- `get-app <repo_url> <app_name> --bundle <bundle_name>`
- `drop-app <app_name> --bundle <bundle_name>`
- `install-app ...`
- `uninstall-app ...`

Notes:
- `get-app` requires `repo_url`.
- `new-app` auto-creates/registers missing bundle if needed.
- `new-app` initializes a git repo inside the app folder.
- Bundle folder itself is not a git repo by default.

## Structure scaffold (Dev / Publisher reserved)

- `new-module <app_name> <module_name>`
- `drop-module <app_name> <module_name>`
- `new-submodule <app_name> <module_name> <submodule_name>`
- `drop-submodule <app_name> <module_name> <submodule_name>`
- `new-doc <doc_name> --app <app_name> --module <module_name> [--submodule <submodule_name>]`
- `drop-doc --app <app_name> --module <module_name> [--submodule <submodule_name>] <doc_name>`

Doc compatibility aliases (temporary):
- `new-doctype`
- `drop-doctype`

## Hierarchy (Locked v1)

`bundle -> app -> module -> submodule -> doc`

Expected path shape:

```text
bundles/<bundle_id>/
  bundle.json
  apps.txt
  documentation/
  <app_id>/
    app.json
    modules.txt
    config/
      3plug.app.json
      3plug.app.schema.json
    backend/
    frontend/
    bundling/
      release.template.yml
    <module_id>/
      module.json
      module.schema.json
      submodules.txt
      docs.txt
      submodule/
        <submodule_id>/
          submodule.json
          submodule.schema.json
          docs.txt
          docs/
            <doc_id>/
              doc.json
              schema.json
              actions.json
```

## Naming Rules

Reserved generic names are blocked:
- `bundle`
- `app`
- `module`
- `submodule`
- `doc`

Use specific names like:
- `ops`, `mgt`, `adm`
- `sales_ops`, `cash_management`
- `intake`, `reconciliation`
- `journal_entry_record`

## Licensing (Current Policy)

- Main platform/framework repo: `CUSTOM-PROPRIETARY` (root `LICENSE`)
- Bundle metadata (`bundle.json`): `CUSTOM-PROPRIETARY`
- App metadata (`app.json`, `config/3plug.app.json`): `CUSTOM-PROPRIETARY`
- App scaffold `LICENSE.txt`: custom proprietary placeholder (replace before release)

## Safe Invocation (No Manual Env Activate)

Use local launchers from project root:

- Windows PowerShell / CMD: `.\3plug.cmd ...`
- Git Bash / Linux / macOS: `./3plug ...`

The launchers auto-run via the project virtual environment.

## Recommended Test Flow (Before Mass Generation)

1. `new-bundle <test_bundle>`
2. `new-app <test_app> --bundle <test_bundle>`
3. `new-module <test_app> <module>`
4. `new-submodule <test_app> <module> <submodule>`
5. `new-doc "<doc title>" --app <test_app> --module <module> --submodule <submodule>`
6. Inspect generated JSON/meta/actions files
7. Drop in reverse order
8. `drop-bundle <test_bundle>`

## Regeneration Workflow (Fresh)

Use this when regenerating from mapping/inventory outputs:

1. Set/register target bundles
2. Create/get apps into bundles
3. Generate modules
4. Generate submodules
5. Generate docs
6. Validate registries (`apps.txt`, `modules.txt`, `submodules.txt`, `docs.txt`)
7. Commit each app repo separately (not in main repo)

## Boundaries

- Runtime business actions happen in desks/portal UI, not in scaffold commands.
- Frappe borrowing applies at the `doc` level (meta/logic inputs), not bundle/app/module creation.
- `install/uninstall` are platform setup operations, not public everyday actions.
