# 3plug CLI

3plug CLI is a command-line interface tool designed to streamline development tasks for projects using the 3plug framework, which integrates seamlessly with Django and Next.js.

## Installation

### Prerequisites

Before installing 3plug CLI, ensure you have:
- **Python** 3.x
- **pip**
- **Node.js** 20+ and **npm**

### First-Time Setup (Recommended)

Run this from the project root (`originals/3plug`):

```bash
pip install env
3plug setup
```

What `3plug setup` does:
- Creates virtual environment if missing (`env`).
- Installs Python dependencies (`pip install -e .`).
- Installs Node dependencies (`npm install`).
- Runs Django migrations.
- Runs Django superuser creation.

### Manual Setup (Alternative)

If needed, you can still run setup steps manually:
- `python -m venv env`
- Activate env (`.\env\Scripts\activate` on Windows, `source env/bin/activate` on Unix)
- `pip install -e .`
- `npm install`

### Start Development Server (After Setup)

Use the project launcher directly (no manual env activation required):

- Windows PowerShell / CMD:
```powershell
.\3plug.cmd start dev
```

- Git Bash / Linux / macOS shell:
```bash
./3plug start dev
```

`3plug start dev` uses the project virtual environment automatically and starts Django + Next.js concurrently.

### Running Without Manual Activate

If `3plug` is not on your system `PATH`, use local launchers from project root:

- Git Bash:
```bash
./3plug start dev
```

- CMD:
```bat
3plug.cmd start dev
```

- PowerShell:
```powershell
.\3plug.cmd start dev
```

## Bundle-First Structure (v1 Command System)

3plug now uses a bundle-first scaffold model for platform generation.

Primary hierarchy (what commands should create):
- `bundle`
- `app`
- `module`
- `submodule`
- `doc`

Expected path shape:

```text
bundles/<bundle_id>/
  bundle.json
  apps.txt
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

Notes:
- Legacy doctype bridge files may still be generated during transition for compatibility.
- Runtime business actions should happen in desks/portal UI, not via scaffold commands.
- `install-*` / `uninstall-*` remain app-focused setup operations.
- App repos under `bundles/<bundle>/<app>` are local working clones/scaffolds and should not be committed to this main repo (they are versioned in their own repos).
- `new-bundle` creates a local bundle registry folder only (no `git init`).
- `new-app` creates a standalone app repo scaffold and runs `git init` inside the app folder.

## Usage

3plug CLI commands start with `3plug`. Here are the available commands:

#### Setup and update Site environment

```bash
3plug install
```

### Command: 3plug migrate

Migrate database schema changes.

```bash
3plug migrate
```

### Command: 3plug start

Start the development server.

```bash
3plug start dev
```

### Command: 3plug install

Install dependencies or packages.

```bash
3plug install
```

### Command: 3plug setup

Run first-time setup in one command.

```bash
pip install env
3plug setup
```

Install node dependencies.

```bash
3plug npm install dep1 dep2
```

Install node dependencies for a custom app.

```bash
3plug npm install --app appname dep1 dep2
```

or

```bash
3plug npm i dep1 dep2
3plug npm i --app appname dep1 dep2
```

Install python packages.

```bash
3plug pip install package1 package1
```

Install python packages for a custom app..

```bash
3plug pip install --app appname  package1 package1
```

or

```bash
3plug pip i package1 package1
3plug pip i --app appname  package1 package1
```

### Bundle commands (primary)

```bash
# Use local launchers (auto env)
.\3plug.cmd set-bundles ops mgt adm integrations
.\3plug.cmd list-bundles
.\3plug.cmd new-bundle ops
.\3plug.cmd drop-bundle ops
```

Compatibility aliases (temporary):
- `set-plugs`
- `list-plugs`
- `new-plug`
- `drop-plug`

### App / Module / Submodule / Doc scaffold commands (v1)

```bash
# create app in a bundle (repo-ready scaffold)
.\3plug.cmd new-app my_app --bundle ops

# create module directly inside the app root
.\3plug.cmd new-module my_app sales_ops

# create submodule inside the module
.\3plug.cmd new-submodule my_app sales_ops intake

# create doc inside module/submodule (also writes actions/schema/doc meta)
.\3plug.cmd new-doc --app my_app --module sales_ops --submodule intake "Lead Intake Record"
```

Drop flow:

```bash
.\3plug.cmd drop-doc --app my_app --module sales_ops --submodule intake lead_intake_record
.\3plug.cmd drop-submodule my_app sales_ops intake
.\3plug.cmd drop-module my_app sales_ops
.\3plug.cmd drop-app my_app --bundle ops
.\3plug.cmd drop-bundle ops
```

Doc compatibility aliases (temporary):
- `new-doctype`
- `drop-doctype`

### Command: 3plug get-app

Clone an app into a selected bundle.

```bash
./3plug get-app <repo_url> my_app --bundle integrations
```

### Command Safety

CLI commands are expected to run through the project virtual environment for safety and consistency.

Recommended invocation in this repo:

```bash
./3plug --help
```

On Windows PowerShell/CMD, use:

```powershell
.\3plug.cmd --help
```

The CLI and launcher wrappers auto-run through the project env for safety. Manual env activation should not be required for normal use.

### Command Access Policy (v1)

- Normal platform use should move to desks/portal UI and platform `update` / `upgrade` flows.
- In the main repo, the most common CLI actions should be:
  - `new-bundle` / `get-app` / `new-app` (for published or new app repos)
- Bundle folders are grouping containers; app folders are the versioned release units (their own repos).
- Deeper scaffold commands are reserved for developers/publishers:
  - `new-module`, `new-submodule`, `new-doc`
  - `drop-*` structure commands
- `install-app` / `uninstall-app` remain platform setup operations (app installation only).

## Development

To contribute to 3plug CLI development, follow these steps:

1. Configure repository remote: `git remote add origin git@github.com:Triotek-Ltd/3plug.git`
2. Set the default branch: `git branch -M main`
3. Push the branch: `git push -u origin main`
4. Install development dependencies: `3plug install`
5. Make your changes.
6. Test thoroughly.
7. Submit a pull request.

## License

This project uses Triotek custom proprietary terms for platform/runtime distribution.
Bundle and app scaffolds also default to `CUSTOM-PROPRIETARY` and should carry their own license files/terms in their respective repos.
See `LICENSE` for main repo terms.
