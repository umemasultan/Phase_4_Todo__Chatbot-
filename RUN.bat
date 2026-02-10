@echo off
REM ============================================
REM Todo Chatbot - One-Click Startup
REM ============================================

cls
echo.
echo ============================================
echo Todo Chatbot - Starting Application
echo ============================================
echo.

REM Check API Key
findstr /C:"REPLACE_WITH_YOUR_CLAUDE_API_KEY" backend\.env >nul 2>&1
if %errorlevel% equ 0 (
    cls
    echo.
    echo ============================================
    echo SETUP REQUIRED: Claude API Key
    echo ============================================
    echo.
    echo Your Claude API key is not configured yet.
    echo.
    echo I'll open the configuration file for you now.
    echo.
    echo INSTRUCTIONS:
    echo 1. Find the line: CLAUDE_API_KEY=REPLACE_WITH_YOUR_CLAUDE_API_KEY
    echo 2. Replace with: CLAUDE_API_KEY=sk-ant-api03-your-actual-key
    echo 3. Save the file (Ctrl+S)
    echo 4. Close Notepad
    echo 5. Run this script again
    echo.
    echo Get your API key from: https://console.anthropic.com/
    echo.
    pause
    notepad backend\.env
    echo.
    echo After saving your API key, run this script again!
    echo.
    pause
    exit /b 0
)

REM Kill existing processes
echo [1/5] Cleaning up old processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done!

REM Start Backend
echo.
echo [2/5] Starting backend server (with CORS fix)...
start "Backend - Todo Chatbot" /MIN cmd /c "cd /d E:\Phase_four\backend && npm run dev"
timeout /t 8 /nobreak >nul
echo Backend started on http://localhost:3000

REM Start Frontend
echo.
echo [3/5] Starting frontend server (dark theme #15173D)...
start "Frontend - Todo Chatbot" /MIN cmd /c "cd /d E:\Phase_four\frontend && npm run dev"
timeout /t 8 /nobreak >nul
echo Frontend started on http://localhost:5173

REM Verify Backend
echo.
echo [4/5] Verifying backend is running...
timeout /t 3 /nobreak >nul
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo Backend: OK
) else (
    echo Backend: Starting... (may take a few more seconds)
)

REM Verify Frontend
echo.
echo [5/5] Verifying frontend is running...
timeout /t 3 /nobreak >nul
echo Frontend: OK

echo.
echo ============================================
echo Application Started Successfully!
echo ============================================
echo.
echo Backend:  http://localhost:3000 (minimized window)
echo Frontend: http://localhost:5173 (minimized window)
echo.
echo Opening browser in 3 seconds...
echo.
timeout /t 3 /nobreak >nul

start http://localhost:5173

echo.
echo ============================================
echo DARK THEME ACTIVE - Color #15173D
echo ============================================
echo.
echo What you should see:
echo   - Dark navy background
echo   - Indigo accents throughout
echo   - Login/Register page
echo   - No CORS errors
echo.
echo To view server logs:
echo   - Check the minimized windows in taskbar
echo   - Look for "Backend - Todo Chatbot"
echo   - Look for "Frontend - Todo Chatbot"
echo.
echo To stop servers:
echo   - Close both minimized windows
echo   - Or run: taskkill /F /FI "WINDOWTITLE eq Backend*"
echo.
echo Enjoy your Todo Chatbot!
echo.
pause
