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

### Command: 3plug startapp

Create and start a new application.

```bash
3plug newapp [appname]
```

Example:

```bash
3plug installapp myapp
```

### Command: 3plug deleteapp

Delete an application.

```bash
3plug unistallapp [appname]
```

Example:

```bash
3plug uninstallapp myapp
```

### Command: 3plug addmodule

Create and start a new module.

```bash
3plug newmodule [appname] [modulename]
```

Example:

```bash
3plug addmodule myapp mymodule
```

### Command: 3plug deletemodule

Delete a module.

```bash
3plug dropmodule [appname] [modulename]
```

Example:

```bash
3plug dropmodule myapp mymodule
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
