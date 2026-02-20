# 3plug CLI

3plug CLI is a command-line interface tool designed to streamline development tasks for projects using the 3plug framework, which integrates seamlessly with Django and Next.js.

## Installation

### Prerequisites

Before installing 3plug CLI, ensure you have the following installed on your system:

- **Python**: 3plug CLI requires Python 3.x. If you don't have Python installed, download and install it from [python.org](https://www.python.org/downloads/).
- **Pip**: Pip is the package installer for Python. It should be installed automatically when you install Python.
- **Node.js**: 3plug CLI requires Node.js version 20. If you don't have Node.js installed, download and install it from [nodejs.org](https://nodejs.org/).

### Setup Environment

#### Clone the Repository

Clone your 3plug project repository from GitHub:

```bash
git remote add origin git@github.com:Triotek-Ltd/3plug.git
git branch -M main
git push -u origin main
```

#### Create a Virtual Environment

It's a good practice to use a virtual environment to isolate your project dependencies from other Python projects.

**Using venv:**

- **Windows:**

  ```bash
  python -m venv env
  ```

- **Unix or MacOS:**

  ```bash
  python3 -m venv env
  ```

Activate the virtual environment:

- **Windows:**

  ```bash
  env\Scripts\activate
  ```

- **Unix or MacOS:**

  ```bash
  source env/bin/activate
  ```

### Install 3plug CLI

Install 3plug CLI in editable mode using pip. This allows you to make changes to the code and have them immediately available without reinstallation:

```bash
pip install -e .
```

### Setup Your Project

After installing 3plug CLI, setup your project dependencies and configurations.

#### Install Site & Dependencies

```bash
3plug newsite
```

#### Apply Migrations

Apply database migrations if needed:

```bash
3plug migrate
```

### Start Development Server

To start the development server:

```bash
3plug start dev
```

The server will start and typically be accessible at `http://localhost:3000`.

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

This project is licensed under the MIT License. See the LICENSE file for details.
