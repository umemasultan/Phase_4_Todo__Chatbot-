#!/bin/bash
# Deploy Todo Chatbot to Minikube using Helm
# This script handles secrets creation and Helm deployment

set -e

echo "=========================================="
echo "Todo Chatbot - Deploy to Minikube"
echo "=========================================="

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    exit 1
fi

# Configuration
NAMESPACE="todo-chatbot"
RELEASE_NAME="todo-chatbot"
CHART_PATH="./helm/todo-chatbot"
VALUES_FILE="values-dev.yaml"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --prod)
            VALUES_FILE="values.yaml"
            shift
            ;;
        --values)
            VALUES_FILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--prod] [--values <file>]"
            exit 1
            ;;
    esac
done

echo ""
echo "Deployment configuration:"
echo "  Namespace: $NAMESPACE"
echo "  Release: $RELEASE_NAME"
echo "  Values file: $VALUES_FILE"
echo ""

# Step 1: Create namespace if it doesn't exist
echo "Step 1: Creating namespace..."
echo "--------------------------------------"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Step 2: Create secrets
echo ""
echo "Step 2: Setting up secrets..."
echo "--------------------------------------"

# Check if secrets already exist
if kubectl get secret app-secrets -n $NAMESPACE &> /dev/null; then
    echo "Secrets already exist. Skipping creation."
    read -p "Do you want to update secrets? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        kubectl delete secret app-secrets -n $NAMESPACE
    else
        echo "Using existing secrets."
    fi
fi

# Create secrets if they don't exist
if ! kubectl get secret app-secrets -n $NAMESPACE &> /dev/null; then
    echo ""
    echo "Please provide the following secrets:"
    echo ""

    # Claude API Key
    read -p "Enter Claude API Key (sk-ant-...): " CLAUDE_API_KEY
    if [[ -z "$CLAUDE_API_KEY" ]]; then
        echo "Error: Claude API Key is required"
        exit 1
    fi

    # JWT Secret (generate if not provided)
    read -p "Enter JWT Secret (press Enter to generate): " JWT_SECRET
    if [[ -z "$JWT_SECRET" ]]; then
        JWT_SECRET=$(openssl rand -base64 32)
        echo "Generated JWT Secret: $JWT_SECRET"
    fi

    # Database Password
    read -p "Enter Database Password (press Enter to generate): " DB_PASSWORD
    if [[ -z "$DB_PASSWORD" ]]; then
        DB_PASSWORD=$(openssl rand -base64 16)
        echo "Generated DB Password: $DB_PASSWORD"
    fi

    # Create the secret
    kubectl create secret generic app-secrets \
        --from-literal=CLAUDE_API_KEY="$CLAUDE_API_KEY" \
        --from-literal=JWT_SECRET="$JWT_SECRET" \
        --from-literal=DB_USER="postgres" \
        --from-literal=DB_PASSWORD="$DB_PASSWORD" \
        --from-literal=DATABASE_URL="postgresql://postgres:$DB_PASSWORD@postgres-service:5432/todo_chatbot?schema=public" \
        -n $NAMESPACE

    echo "Secrets created successfully"
fi

# Step 3: Deploy with Helm
echo ""
echo "Step 3: Deploying with Helm..."
echo "--------------------------------------"

# Check if release exists
if helm list -n $NAMESPACE | grep -q $RELEASE_NAME; then
    echo "Release already exists. Upgrading..."
    helm upgrade $RELEASE_NAME $CHART_PATH \
        -n $NAMESPACE \
        -f $CHART_PATH/$VALUES_FILE \
        --wait \
        --timeout 5m
else
    echo "Installing new release..."
    helm install $RELEASE_NAME $CHART_PATH \
        -n $NAMESPACE \
        -f $CHART_PATH/$VALUES_FILE \
        --wait \
        --timeout 5m
fi

# Step 4: Wait for PostgreSQL to be ready
echo ""
echo "Step 4: Waiting for PostgreSQL to be ready..."
echo "--------------------------------------"
kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=300s

# Step 5: Run database migrations
echo ""
echo "Step 5: Running database migrations..."
echo "--------------------------------------"

# Wait for backend pods to be ready
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s

# Get first backend pod
BACKEND_POD=$(kubectl get pods -n $NAMESPACE -l app=backend -o jsonpath='{.items[0].metadata.name}')

echo "Running migrations on pod: $BACKEND_POD"
kubectl exec -n $NAMESPACE $BACKEND_POD -- npx prisma migrate deploy

echo ""
echo "Step 6: Verifying deployment..."
echo "--------------------------------------"

# Show deployment status
kubectl get all -n $NAMESPACE

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Application is accessible at:"
echo "  http://todo-chatbot.local"
echo ""
echo "Useful commands:"
echo "  - kubectl get pods -n $NAMESPACE           # View pods"
echo "  - kubectl logs -f -l app=backend -n $NAMESPACE  # View backend logs"
echo "  - kubectl logs -f -l app=frontend -n $NAMESPACE # View frontend logs"
echo "  - helm list -n $NAMESPACE                  # View Helm releases"
echo "  - helm uninstall $RELEASE_NAME -n $NAMESPACE    # Uninstall"
echo ""
echo "To access the application:"
echo "  1. Ensure 'todo-chatbot.local' is in your /etc/hosts"
echo "  2. Open http://todo-chatbot.local in your browser"
echo "  3. Register a new account and start chatting!"
echo ""
