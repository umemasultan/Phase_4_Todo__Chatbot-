@echo off
REM ============================================
REM Todo Chatbot - Localhost Setup Script
REM ============================================

echo.
echo ============================================
echo Todo Chatbot - Localhost Setup
echo ============================================
echo.

REM Check if Docker is running
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    pause
    exit /b 1
)

echo [1/5] Docker is running... OK
echo.

REM Stop and remove existing PostgreSQL container if it exists
echo [2/5] Setting up PostgreSQL database...
docker stop todo-postgres >nul 2>&1
docker rm todo-postgres >nul 2>&1

REM Start PostgreSQL container
docker run -d ^
  --name todo-postgres ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres123 ^
  -e POSTGRES_DB=todo_chatbot ^
  -p 5432:5432 ^
  postgres:16-alpine

if %errorlevel% neq 0 (
    echo ERROR: Failed to start PostgreSQL!
    pause
    exit /b 1
)

echo PostgreSQL started successfully!
echo.

REM Wait for PostgreSQL to be ready
echo [3/5] Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul
echo PostgreSQL is ready!
echo.

REM Setup Backend
echo [4/5] Setting up backend...
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies!
        cd ..
        pause
        exit /b 1
    )
)

REM Create .env file
echo Creating backend .env file...
(
echo DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/todo_chatbot?schema=public
echo JWT_SECRET=local-dev-secret-change-in-production
echo CLAUDE_API_KEY=REPLACE_WITH_YOUR_CLAUDE_API_KEY
echo NODE_ENV=development
echo PORT=3000
echo LOG_LEVEL=info
echo FEATURE_CHAT_HISTORY=true
echo FEATURE_AI_SUGGESTIONS=true
) > .env

echo.
echo ============================================
echo IMPORTANT: Configure your Claude API Key
echo ============================================
echo.
echo Please edit backend\.env and replace:
echo   CLAUDE_API_KEY=REPLACE_WITH_YOUR_CLAUDE_API_KEY
echo.
echo With your actual Claude API key from:
echo   https://console.anthropic.com/
echo.
set /p CONTINUE="Press Enter after you've added your API key..."

REM Run database migrations
echo.
echo Running database migrations...
call npx prisma generate
call npx prisma migrate deploy

if %errorlevel% neq 0 (
    echo WARNING: Migration failed. Database might not be ready yet.
    echo You may need to run migrations manually later.
)

cd ..
echo Backend setup complete!
echo.

REM Setup Frontend
echo [5/5] Setting up frontend...
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies!
        cd ..
        pause
        exit /b 1
    )
)

REM Create .env file
echo Creating frontend .env file...
echo VITE_API_URL=http://localhost:3000 > .env

cd ..
echo Frontend setup complete!
echo.

echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Open TWO command prompt windows
echo.
echo 2. In the FIRST window, run:
echo    cd E:\Phase_four\backend
echo    npm run dev
echo.
echo 3. In the SECOND window, run:
echo    cd E:\Phase_four\frontend
echo    npm run dev
echo.
echo 4. Open your browser to:
echo    http://localhost:5173
echo.
echo 5. You should see the dark theme with color #15173D!
echo.
echo ============================================
echo.

pause
