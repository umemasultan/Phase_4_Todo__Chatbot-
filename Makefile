# Makefile for Todo Chatbot
# Provides convenient commands for common operations

.PHONY: help setup build deploy clean logs status test

# Default target
help:
	@echo "Todo Chatbot - Available Commands"
	@echo "=================================="
	@echo ""
	@echo "Setup & Build:"
	@echo "  make setup          - Setup Minikube cluster"
	@echo "  make build          - Build Docker images"
	@echo "  make deploy         - Deploy to Minikube"
	@echo ""
	@echo "Management:"
	@echo "  make status         - Check deployment status"
	@echo "  make logs           - View application logs"
	@echo "  make logs-backend   - View backend logs"
	@echo "  make logs-frontend  - View frontend logs"
	@echo "  make logs-db        - View database logs"
	@echo ""
	@echo "Maintenance:"
	@echo "  make restart        - Restart deployments"
	@echo "  make scale          - Scale backend to 3 replicas"
	@echo "  make migrate        - Run database migrations"
	@echo "  make clean          - Uninstall application"
	@echo "  make clean-all      - Delete Minikube cluster"
	@echo ""
	@echo "Development:"
	@echo "  make dev-backend    - Run backend locally"
	@echo "  make dev-frontend   - Run frontend locally"
	@echo "  make test           - Run tests"
	@echo ""

# Setup Minikube cluster
setup:
	@echo "Setting up Minikube cluster..."
	./scripts/setup-minikube.sh

# Build Docker images
build:
	@echo "Building Docker images..."
	eval $$(minikube docker-env) && ./scripts/build-images.sh

# Deploy application
deploy:
	@echo "Deploying application..."
	./scripts/deploy-minikube.sh

# Check deployment status
status:
	@echo "Deployment Status:"
	@echo "=================="
	kubectl get all -n todo-chatbot
	@echo ""
	@echo "Ingress:"
	kubectl get ingress -n todo-chatbot
	@echo ""
	@echo "HPA:"
	kubectl get hpa -n todo-chatbot

# View all logs
logs:
	kubectl logs -f --all-containers=true -n todo-chatbot --max-log-requests=10

# View backend logs
logs-backend:
	kubectl logs -f -l app=backend -n todo-chatbot

# View frontend logs
logs-frontend:
	kubectl logs -f -l app=frontend -n todo-chatbot

# View database logs
logs-db:
	kubectl logs -f postgres-0 -n todo-chatbot

# Restart deployments
restart:
	kubectl rollout restart deployment/backend -n todo-chatbot
	kubectl rollout restart deployment/frontend -n todo-chatbot

# Scale backend
scale:
	kubectl scale deployment backend -n todo-chatbot --replicas=3

# Run database migrations
migrate:
	@echo "Running database migrations..."
	@POD=$$(kubectl get pods -n todo-chatbot -l app=backend -o jsonpath='{.items[0].metadata.name}') && \
	kubectl exec -n todo-chatbot $$POD -- npx prisma migrate deploy

# Uninstall application
clean:
	@echo "Uninstalling application..."
	helm uninstall todo-chatbot -n todo-chatbot || true
	kubectl delete namespace todo-chatbot || true

# Delete Minikube cluster
clean-all: clean
	@echo "Deleting Minikube cluster..."
	minikube delete

# Run backend locally
dev-backend:
	cd backend && npm install && npm run dev

# Run frontend locally
dev-frontend:
	cd frontend && npm install && npm run dev

# Run tests
test:
	@echo "Running backend tests..."
	cd backend && npm test
	@echo "Running frontend tests..."
	cd frontend && npm test

# Port forward for local access
port-forward-backend:
	kubectl port-forward -n todo-chatbot svc/backend-service 3000:3000

port-forward-frontend:
	kubectl port-forward -n todo-chatbot svc/frontend-service 8080:80

# Open Minikube dashboard
dashboard:
	minikube dashboard

# Get Minikube IP
ip:
	@echo "Minikube IP: $$(minikube ip)"
	@echo "Add to /etc/hosts: $$(minikube ip) todo-chatbot.local"
