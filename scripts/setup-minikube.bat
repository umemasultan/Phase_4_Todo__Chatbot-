@echo off
REM Setup Minikube cluster for Todo Chatbot (Windows)
REM This script initializes a Minikube cluster with required addons

echo ==========================================
echo Todo Chatbot - Minikube Setup (Windows)
echo ==========================================

REM Check if minikube is installed
where minikube >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: minikube is not installed
    echo Please install minikube: https://minikube.sigs.k8s.io/docs/start/
    exit /b 1
)

REM Check if kubectl is installed
where kubectl >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: kubectl is not installed
    echo Please install kubectl: https://kubernetes.io/docs/tasks/tools/
    exit /b 1
)

REM Check if helm is installed
where helm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: helm is not installed
    echo Please install helm: https://helm.sh/docs/intro/install/
    exit /b 1
)

echo.
echo Step 1: Starting Minikube cluster...
echo --------------------------------------

minikube start --cpus=4 --memory=8192 --disk-size=20g --driver=docker --kubernetes-version=v1.28.0

echo.
echo Step 2: Enabling required addons...
echo --------------------------------------

minikube addons enable ingress
minikube addons enable metrics-server
minikube addons enable storage-provisioner

echo.
echo Step 3: Configuring Docker environment...
echo --------------------------------------

echo Run the following command to configure your shell:
echo   @FOR /f "tokens=*" %%i IN ('minikube docker-env --shell cmd') DO @%%i
echo.
echo This allows you to build images directly in Minikube's Docker daemon

echo.
echo Step 4: Adding host entry...
echo --------------------------------------

for /f "tokens=*" %%i in ('minikube ip') do set MINIKUBE_IP=%%i
echo Minikube IP: %MINIKUBE_IP%
echo.
echo Add the following entry to C:\Windows\System32\drivers\etc\hosts:
echo   %MINIKUBE_IP% todo-chatbot.local
echo.
echo You need Administrator privileges to edit the hosts file.

echo.
echo Step 5: Verifying cluster status...
echo --------------------------------------

kubectl cluster-info
kubectl get nodes

echo.
echo ==========================================
echo Minikube setup completed successfully!
echo ==========================================
echo.
echo Next steps:
echo   1. Configure Docker environment (see command above)
echo   2. Build Docker images: scripts\build-images.bat
echo   3. Deploy application: scripts\deploy-minikube.bat
echo.
echo Useful commands:
echo   - minikube dashboard    # Open Kubernetes dashboard
echo   - minikube stop         # Stop the cluster
echo   - minikube delete       # Delete the cluster
echo   - kubectl get pods -A   # View all pods
echo.

pause
