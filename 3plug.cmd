@echo off
setlocal

set "ROOT_DIR=%~dp0"

if exist "%ROOT_DIR%env\Scripts\3plug.exe" (
  "%ROOT_DIR%env\Scripts\3plug.exe" %*
  exit /b %errorlevel%
)

if exist "%ROOT_DIR%.venv\Scripts\3plug.exe" (
  "%ROOT_DIR%.venv\Scripts\3plug.exe" %*
  exit /b %errorlevel%
)

echo 3plug virtual environment not found. Run: python -m venv .venv ^&^& .\.venv\Scripts\python.exe -m pip install -e .
exit /b 1
