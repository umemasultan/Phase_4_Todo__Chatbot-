@echo off
echo Cleaning up all Node.js processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 5 /nobreak >nul

echo Starting backend server...
cd /d E:\Phase_four\backend
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo Starting frontend server...
cd /d E:\Phase_four\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Check the server windows for any errors.
pause
