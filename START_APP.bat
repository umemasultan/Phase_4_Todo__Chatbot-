@echo off
REM ============================================
REM Todo Chatbot - Complete Restart Script
REM ============================================

echo.
echo ============================================
echo Todo Chatbot - Automated Restart
echo ============================================
echo.

REM Step 1: Check if Claude API key is set
echo [1/4] Checking configuration...
findstr /C:"REPLACE_WITH_YOUR_CLAUDE_API_KEY" backend\.env >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo ERROR: Claude API Key Not Configured!
    echo ============================================
    echo.
    echo Please edit backend\.env and add your Claude API key:
    echo   1. Open: backend\.env
    echo   2. Find: CLAUDE_API_KEY=REPLACE_WITH_YOUR_CLAUDE_API_KEY
    echo   3. Replace with: CLAUDE_API_KEY=sk-ant-api03-your-actual-key
    echo   4. Save the file
    echo   5. Run this script again
    echo.
    echo Get your API key from: https://console.anthropic.com/
    echo.
    pause
    exit /b 1
)

echo Configuration OK!
echo.

REM Step 2: Kill any existing backend process on port 3000
echo [2/4] Stopping any existing backend server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo Backend stopped.
echo.

REM Step 3: Start backend in new window
echo [3/4] Starting backend server...
start "Todo Chatbot Backend" cmd /k "cd /d E:\Phase_four\backend && npm run dev"
timeout /t 5 /nobreak >nul
echo Backend starting...
echo.

REM Step 4: Start frontend in new window
echo [4/4] Starting frontend server...
start "Todo Chatbot Frontend" cmd /k "cd /d E:\Phase_four\frontend && npm run dev"
timeout /t 3 /nobreak >nul
echo Frontend starting...
echo.

echo ============================================
echo Application Starting!
echo ============================================
echo.
echo Two windows have opened:
echo   1. Backend Server (port 3000)
echo   2. Frontend Server (port 5173)
echo.
echo Wait 10 seconds for servers to fully start, then:
echo   Open your browser to: http://localhost:5173
echo.
echo You should see the dark theme with color #15173D!
echo.
echo To stop: Close both server windows or press Ctrl+C in each
echo.

timeout /t 10 /nobreak
start http://localhost:5173

echo Browser opened automatically!
echo.
pause
