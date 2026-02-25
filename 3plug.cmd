@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "CMD_NAME=%~1"

if /I "%CMD_NAME%"=="setup" goto :bootstrap
if /I "%CMD_NAME%"=="init" goto :bootstrap
if /I "%CMD_NAME%"=="setup-dev-env" goto :bootstrap

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

:bootstrap
if not exist "%ROOT_DIR%env\Scripts\python.exe" (
  echo Bootstrapping local virtual environment at env...
  pushd "%ROOT_DIR%"
  python -m venv env
  if errorlevel 1 (
    py -3 -m venv env
  )
  set "BOOT_ERR=%errorlevel%"
  popd
  if not "%BOOT_ERR%"=="0" exit /b %BOOT_ERR%
)

if not exist "%ROOT_DIR%env\Scripts\3plug.exe" (
  echo Installing 3plug into local virtual environment...
  pushd "%ROOT_DIR%"
  "%ROOT_DIR%env\Scripts\python.exe" -m pip install -e .
  set "BOOT_ERR=%errorlevel%"
  popd
  if not "%BOOT_ERR%"=="0" exit /b %BOOT_ERR%
)

"%ROOT_DIR%env\Scripts\3plug.exe" %*
exit /b %errorlevel%
