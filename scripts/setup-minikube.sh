#!/bin/bash
# Setup Minikube cluster for Todo Chatbot
# This script initializes a Minikube cluster with required addons

set -e

echo "=========================================="
echo "Todo Chatbot - Minikube Setup"
echo "=========================================="

# Check if minikube is installed
if ! command -v minikube &> /dev/null; then
    echo "Error: minikube is not installed"
    echo "Please install minikube: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    echo "Please install kubectl: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed"
    echo "Please install helm: https://helm.sh/docs/intro/install/"
    exit 1
fi

echo ""
echo "Step 1: Starting Minikube cluster..."
echo "--------------------------------------"

# Start Minikube with appropriate resources
minikube start \
    --cpus=4 \
    --memory=8192 \
    --disk-size=20g \
    --driver=docker \
    --kubernetes-version=v1.28.0

echo ""
echo "Step 2: Enabling required addons..."
echo "--------------------------------------"

# Enable ingress controller
minikube addons enable ingress

# Enable metrics server for HPA
minikube addons enable metrics-server

# Enable storage provisioner (usually enabled by default)
minikube addons enable storage-provisioner

echo ""
echo "Step 3: Configuring Docker environment..."
echo "--------------------------------------"

# Configure shell to use Minikube's Docker daemon
echo "Run the following command to configure your shell:"
echo "  eval \$(minikube docker-env)"
echo ""
echo "This allows you to build images directly in Minikube's Docker daemon"

echo ""
echo "Step 4: Adding host entry..."
echo "--------------------------------------"

MINIKUBE_IP=$(minikube ip)
echo "Minikube IP: $MINIKUBE_IP"
echo ""
echo "Add the following entry to your /etc/hosts file (or C:\\Windows\\System32\\drivers\\etc\\hosts on Windows):"
echo "  $MINIKUBE_IP todo-chatbot.local"
echo ""

# On Linux/Mac, offer to add automatically (requires sudo)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Would you like to add this entry automatically? (requires sudo) [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "$MINIKUBE_IP todo-chatbot.local" | sudo tee -a /etc/hosts
        echo "Host entry added successfully"
    fi
fi

echo ""
echo "Step 5: Verifying cluster status..."
echo "--------------------------------------"

kubectl cluster-info
kubectl get nodes

echo ""
echo "=========================================="
echo "Minikube setup completed successfully!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "  1. Configure Docker environment: eval \$(minikube docker-env)"
echo "  2. Build Docker images: ./scripts/build-images.sh"
echo "  3. Deploy application: ./scripts/deploy-minikube.sh"
echo ""
echo "Useful commands:"
echo "  - minikube dashboard    # Open Kubernetes dashboard"
echo "  - minikube stop         # Stop the cluster"
echo "  - minikube delete       # Delete the cluster"
echo "  - kubectl get pods -A   # View all pods"
echo ""
