@echo off
REM ============================================
REM Todo Chatbot - Start Frontend Server
REM ============================================

echo.
echo ============================================
echo Starting Frontend Server (Dark Theme)
echo ============================================
echo.

cd /d E:\Phase_four\frontend

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

echo Starting frontend on http://localhost:5173
echo.
echo The application will open in your browser automatically.
echo You should see the DARK THEME with color #15173D!
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
