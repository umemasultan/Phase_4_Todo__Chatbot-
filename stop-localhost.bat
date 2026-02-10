@echo off
REM ============================================
REM Todo Chatbot - Stop All Services
REM ============================================

echo.
echo ============================================
echo Stopping Todo Chatbot Services
echo ============================================
echo.

echo Stopping PostgreSQL container...
docker stop todo-postgres
docker rm todo-postgres

echo.
echo All services stopped!
echo.
echo Note: Backend and Frontend servers must be stopped manually
echo by pressing Ctrl+C in their respective windows.
echo.

pause
