@echo off
echo Starting CampusSkill Hub...
echo.

cd /d "%~dp0"

echo [1/2] Starting Backend (port 5000)...
start "CampusSkill-Backend" cmd /c "cd /d "%~dp0backend" && npm run dev"

echo [2/2] Starting Frontend (port 3000)...
start "CampusSkill-Frontend" cmd /c "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting up!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Close the windows or press Ctrl+C in each to stop.
pause
