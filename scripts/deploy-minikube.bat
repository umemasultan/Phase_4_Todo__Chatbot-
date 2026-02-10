@echo off
REM Deploy Todo Chatbot to Minikube using Helm (Windows)

setlocal enabledelayedexpansion

echo ==========================================
echo Todo Chatbot - Deploy to Minikube
echo ==========================================

REM Check if helm is installed
where helm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: helm is not installed
    exit /b 1
)

REM Check if kubectl is installed
where kubectl >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: kubectl is not installed
    exit /b 1
)

REM Configuration
set NAMESPACE=todo-chatbot
set RELEASE_NAME=todo-chatbot
set CHART_PATH=.\helm\todo-chatbot
set VALUES_FILE=values-dev.yaml

echo.
echo Deployment configuration:
echo   Namespace: %NAMESPACE%
echo   Release: %RELEASE_NAME%
echo   Values file: %VALUES_FILE%
echo.

REM Step 1: Create namespace
echo Step 1: Creating namespace...
echo --------------------------------------
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -

REM Step 2: Create secrets
echo.
echo Step 2: Setting up secrets...
echo --------------------------------------

kubectl get secret app-secrets -n %NAMESPACE% >nul 2>nul
if %errorlevel% equ 0 (
    echo Secrets already exist. Using existing secrets.
) else (
    echo.
    echo Please provide the following secrets:
    echo.

    set /p CLAUDE_API_KEY="Enter Claude API Key (sk-ant-...): "
    if "!CLAUDE_API_KEY!"=="" (
        echo Error: Claude API Key is required
        exit /b 1
    )

    set /p JWT_SECRET="Enter JWT Secret (press Enter to use default): "
    if "!JWT_SECRET!"=="" set JWT_SECRET=change-me-in-production-12345678

    set /p DB_PASSWORD="Enter Database Password (press Enter to use default): "
    if "!DB_PASSWORD!"=="" set DB_PASSWORD=postgres123

    kubectl create secret generic app-secrets --from-literal=CLAUDE_API_KEY=!CLAUDE_API_KEY! --from-literal=JWT_SECRET=!JWT_SECRET! --from-literal=DB_USER=postgres --from-literal=DB_PASSWORD=!DB_PASSWORD! --from-literal=DATABASE_URL=postgresql://postgres:!DB_PASSWORD!@postgres-service:5432/todo_chatbot?schema=public -n %NAMESPACE%

    echo Secrets created successfully
)

REM Step 3: Deploy with Helm
echo.
echo Step 3: Deploying with Helm...
echo --------------------------------------

helm list -n %NAMESPACE% | findstr %RELEASE_NAME% >nul 2>nul
if %errorlevel% equ 0 (
    echo Release already exists. Upgrading...
    helm upgrade %RELEASE_NAME% %CHART_PATH% -n %NAMESPACE% -f %CHART_PATH%\%VALUES_FILE% --wait --timeout 5m
) else (
    echo Installing new release...
    helm install %RELEASE_NAME% %CHART_PATH% -n %NAMESPACE% -f %CHART_PATH%\%VALUES_FILE% --wait --timeout 5m
)

REM Step 4: Wait for PostgreSQL
echo.
echo Step 4: Waiting for PostgreSQL to be ready...
echo --------------------------------------
kubectl wait --for=condition=ready pod -l app=postgres -n %NAMESPACE% --timeout=300s

REM Step 5: Run migrations
echo.
echo Step 5: Running database migrations...
echo --------------------------------------

kubectl wait --for=condition=ready pod -l app=backend -n %NAMESPACE% --timeout=300s

for /f "tokens=*" %%i in ('kubectl get pods -n %NAMESPACE% -l app=backend -o jsonpath="{.items[0].metadata.name}"') do set BACKEND_POD=%%i

echo Running migrations on pod: %BACKEND_POD%
kubectl exec -n %NAMESPACE% %BACKEND_POD% -- npx prisma migrate deploy

echo.
echo Step 6: Verifying deployment...
echo --------------------------------------

kubectl get all -n %NAMESPACE%

echo.
echo ==========================================
echo Deployment completed successfully!
echo ==========================================
echo.
echo Application is accessible at:
echo   http://todo-chatbot.local
echo.
echo Useful commands:
echo   - kubectl get pods -n %NAMESPACE%
echo   - kubectl logs -f -l app=backend -n %NAMESPACE%
echo   - helm list -n %NAMESPACE%
echo   - helm uninstall %RELEASE_NAME% -n %NAMESPACE%
echo.

pause
