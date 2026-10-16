@echo off
cd /d "%~dp0"
echo Starting Divine Academy local website...
start "Divine Academy" http://localhost:8000
py -m http.server 8000
if errorlevel 1 (
  echo.
  echo Could not start using the Python launcher. Try installing Python or use GitHub Pages.
  pause
)
