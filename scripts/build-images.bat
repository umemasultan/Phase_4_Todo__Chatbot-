@echo off
REM Build Docker images for Todo Chatbot (Windows)

echo ==========================================
echo Todo Chatbot - Build Docker Images
echo ==========================================

REM Check if Docker is available
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: docker is not installed
    exit /b 1
)

REM Get version tag (default to latest)
set VERSION=%1
if "%VERSION%"=="" set VERSION=latest

echo.
echo Building images with tag: %VERSION%
echo.

REM Build backend image
echo Step 1: Building backend image...
echo --------------------------------------
cd backend
docker build -t todo-chatbot/backend:%VERSION% -t todo-chatbot/backend:latest .
cd ..

echo.
echo Step 2: Building frontend image...
echo --------------------------------------
cd frontend
docker build -t todo-chatbot/frontend:%VERSION% -t todo-chatbot/frontend:latest .
cd ..

echo.
echo Step 3: Verifying images...
echo --------------------------------------
docker images | findstr todo-chatbot

echo.
echo ==========================================
echo Docker images built successfully!
echo ==========================================
echo.
echo Images created:
echo   - todo-chatbot/backend:%VERSION%
echo   - todo-chatbot/frontend:%VERSION%
echo.
echo Next step:
echo   Deploy to Minikube: scripts\deploy-minikube.bat
echo.

pause
