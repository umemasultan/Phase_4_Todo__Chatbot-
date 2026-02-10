#!/bin/bash
# Build Docker images for Todo Chatbot
# This script builds both frontend and backend images in Minikube's Docker daemon

set -e

echo "=========================================="
echo "Todo Chatbot - Build Docker Images"
echo "=========================================="

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Error: docker is not installed"
    exit 1
fi

# Check if we're using Minikube's Docker daemon
if ! docker info | grep -q "minikube"; then
    echo "Warning: Not using Minikube's Docker daemon"
    echo "Run: eval \$(minikube docker-env)"
    echo ""
    read -p "Continue anyway? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get version tag (default to latest)
VERSION=${1:-latest}

echo ""
echo "Building images with tag: $VERSION"
echo ""

# Build backend image
echo "Step 1: Building backend image..."
echo "--------------------------------------"
cd backend
docker build -t todo-chatbot/backend:$VERSION -t todo-chatbot/backend:latest .
cd ..

echo ""
echo "Step 2: Building frontend image..."
echo "--------------------------------------"
cd frontend
docker build -t todo-chatbot/frontend:$VERSION -t todo-chatbot/frontend:latest .
cd ..

echo ""
echo "Step 3: Verifying images..."
echo "--------------------------------------"
docker images | grep todo-chatbot

echo ""
echo "=========================================="
echo "Docker images built successfully!"
echo "=========================================="
echo ""
echo "Images created:"
echo "  - todo-chatbot/backend:$VERSION"
echo "  - todo-chatbot/frontend:$VERSION"
echo ""
echo "Next step:"
echo "  Deploy to Minikube: ./scripts/deploy-minikube.sh"
echo ""
