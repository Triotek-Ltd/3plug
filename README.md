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

Activate virtual environment first if `3plug` is not globally available.

```bash
3plug start dev
```

`3plug start dev` uses the project virtual environment Python and starts Django + Next.js concurrently.

Note: CLI commands now auto-run through the project virtual environment for safety.

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

## Plug-first structure

3plug now uses a plug-first app layout. Apps are created inside fixed plug directories at project root.

Current plugs:
- `operations`
- `management`
- `administration`
- `integrations`

Each plug contains:
- `apps.txt` (app registry for that plug)
- `docs/`
- `translations/`
- `README.md`

Global `config/apps.txt` is no longer used.

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

### Command: 3plug set-plugs

Set allowed plug options and scaffold plug folders.

```bash
3plug set-plugs operations management administration integrations
```

### Command: 3plug list-plugs

List available plug options.

```bash
3plug list-plugs
```

### Command: 3plug new-app

Create a new app in a selected plug.

```bash
3plug new-app my_app --plug operations
```

### Command: 3plug get-app

Clone an app into a selected plug.

```bash
3plug get-app https://github.com/example/repo.git my_app --plug integrations
```

### Command: 3plug drop-app

Delete an app and remove it from its plug registry.

```bash
3plug drop-app my_app --plug operations
```

### Command: 3plug new-module

Create a module in an app.

```bash
3plug new-module my_app my_module
```

### Command: 3plug drop-module

Delete a module from an app.

```bash
3plug drop-module my_app my_module
```

### Command: 3plug new-doc

Create a document in an app module.

```bash
3plug new-doc --app my_app --module my_module my_doc
```

### Command: 3plug drop-doc

Delete a document from an app module.

```bash
3plug drop-doc --app my_app --module my_module my_doc
```

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

This project is licensed under the MIT License.
Copyright (c) 2026 Triotek Systems Ltd.
See `LICENSE` for full terms.
