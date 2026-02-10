@echo off
REM ============================================
REM Todo Chatbot - Start Backend Server
REM ============================================

echo.
echo ============================================
echo Starting Backend Server
echo ============================================
echo.

cd /d E:\Phase_four\backend

REM Check if .env exists
if not exist ".env" (
    echo ERROR: .env file not found!
    echo Please run setup-localhost.bat first.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run setup-localhost.bat first.
    echo.
    pause
    exit /b 1
)

echo Starting backend on http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
