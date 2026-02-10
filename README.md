# Todo Chatbot - Cloud Native Application with Kubernetes

A production-ready, cloud-native todo management application powered by Claude AI. Manage your todos through natural language conversation, deployed on Kubernetes with Docker and Helm.

## Features

- 🤖 **AI-Powered Chat Interface** - Manage todos using natural language with Claude AI
- ✅ **Full Todo Management** - Create, update, delete, and query todos
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 🚀 **Cloud-Native Architecture** - Containerized with Docker, orchestrated with Kubernetes
- 📦 **Helm Packaging** - Easy deployment and configuration management
- 🔄 **Auto-Scaling** - Horizontal Pod Autoscaler for dynamic scaling
- 💾 **Persistent Storage** - PostgreSQL with persistent volumes
- 📊 **Health Monitoring** - Liveness and readiness probes
- 🎨 **Modern UI** - React with Material-UI components

## Quick Start

### Prerequisites

- Docker Desktop
- Minikube
- kubectl
- Helm
- Claude API Key

### Installation

```bash
# 1. Setup Minikube cluster
./scripts/setup-minikube.sh  # Linux/Mac
scripts\setup-minikube.bat   # Windows

# 2. Configure Docker environment
eval $(minikube docker-env)  # Linux/Mac

# 3. Build Docker images
./scripts/build-images.sh    # Linux/Mac
scripts\build-images.bat     # Windows

# 4. Deploy application
./scripts/deploy-minikube.sh # Linux/Mac
scripts\deploy-minikube.bat  # Windows

# 5. Access application
# Open http://todo-chatbot.local in your browser
```

## Architecture

```
User → Ingress → Frontend (React) → Backend (Node.js) → PostgreSQL
                                  ↓
                            Claude API
```

**Components:**
- **Frontend**: React SPA with Material-UI, served by Nginx
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 16 with persistent storage
- **AI**: Claude 3.5 Sonnet for natural language processing
- **Infrastructure**: Kubernetes + Helm + Docker

## Project Structure

```
Phase_four/
├── frontend/           # React frontend application
├── backend/            # Node.js backend API
├── k8s/                # Kubernetes manifests
├── helm/               # Helm chart
├── scripts/            # Deployment scripts
├── docs/               # Documentation
└── specs/              # Specifications
```

## Documentation

- [Deployment Guide](docs/deployment-guide.md) - Complete deployment instructions
- [API Documentation](docs/api-contracts.md) - REST API reference
- [Architecture](docs/architecture.md) - System architecture and design decisions

## Technology Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI
- Vite
- Axios

**Backend:**
- Node.js 20 LTS
- Express.js
- TypeScript
- Prisma ORM
- Anthropic SDK
- Winston (logging)
- Zod (validation)

**Infrastructure:**
- Docker (containerization)
- Kubernetes (orchestration)
- Helm (packaging)
- Nginx Ingress
- PostgreSQL 16

## Usage Examples

### Chat with AI Assistant

```
User: "add buy groceries tomorrow with high priority"
AI: "I've added 'buy groceries' to your todos with high priority, due tomorrow."

User: "show me my pending tasks"
AI: "You have 3 pending tasks: 1) Buy groceries (High, due tomorrow)..."

User: "mark the first todo as done"
AI: "I've marked 'Buy groceries' as completed."
```

### API Usage

```bash
# Register
curl -X POST http://todo-chatbot.local/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://todo-chatbot.local/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create todo
curl -X POST http://todo-chatbot.local/api/todos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","priority":"HIGH"}'
```

## Configuration

### Environment Variables

**Backend:**
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string
- `CLAUDE_API_KEY` - Anthropic API key
- `JWT_SECRET` - JWT signing secret
- `LOG_LEVEL` - Logging level (debug/info/warn/error)

### Helm Values

Customize deployment with Helm values:

```yaml
# values-dev.yaml
backend:
  replicaCount: 1
  resources:
    requests:
      memory: "128Mi"
      cpu: "100m"
```

Deploy with custom values:
```bash
helm install todo-chatbot ./helm/todo-chatbot -f values-custom.yaml
```

## Development

### Local Development (without Kubernetes)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npx prisma migrate dev
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Building Images

```bash
# Build specific version
./scripts/build-images.sh v1.0.0

# Build latest
./scripts/build-images.sh
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### Local (Minikube)

```bash
./scripts/deploy-minikube.sh
```

### Production (Cloud)

1. Build and push images to container registry
2. Update Helm values for production
3. Deploy to cloud Kubernetes cluster

```bash
# Build and push
docker build -t your-registry/todo-chatbot-backend:v1.0.0 ./backend
docker push your-registry/todo-chatbot-backend:v1.0.0

# Deploy
helm install todo-chatbot ./helm/todo-chatbot \
  -f values-prod.yaml \
  --set backend.image.repository=your-registry/todo-chatbot-backend \
  --set backend.image.tag=v1.0.0
```

## Monitoring

### View Logs

```bash
# Backend logs
kubectl logs -f -l app=backend -n todo-chatbot

# Frontend logs
kubectl logs -f -l app=frontend -n todo-chatbot

# PostgreSQL logs
kubectl logs -f postgres-0 -n todo-chatbot
```

### Check Status

```bash
# Pods
kubectl get pods -n todo-chatbot

# Services
kubectl get svc -n todo-chatbot

# Ingress
kubectl get ingress -n todo-chatbot

# HPA
kubectl get hpa -n todo-chatbot
```

## Troubleshooting

### Pods not starting

```bash
kubectl describe pod <pod-name> -n todo-chatbot
kubectl logs <pod-name> -n todo-chatbot
```

### Database connection issues

```bash
# Check PostgreSQL
kubectl exec -it postgres-0 -n todo-chatbot -- psql -U postgres -d todo_chatbot

# Verify DATABASE_URL
kubectl get secret app-secrets -n todo-chatbot -o jsonpath='{.data.DATABASE_URL}' | base64 -d
```

### Ingress not working

```bash
# Check ingress controller
kubectl get pods -n ingress-nginx

# Verify hosts file
cat /etc/hosts | grep todo-chatbot
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.


## Acknowledgments

- [Anthropic](https://www.anthropic.com/) for Claude AI
- [Kubernetes](https://kubernetes.io/) for orchestration
- [Helm](https://helm.sh/) for packaging
- [Prisma](https://www.prisma.io/) for database ORM
- [Material-UI](https://mui.com/) for React components

## Support

For issues or questions:
- Check [Deployment Guide](docs/deployment-guide.md)
- Review [Architecture Documentation](docs/architecture.md)
- Open an issue on GitHub

---

## Author

**Umema Sultan**

Created with passion and dedication to build an AI-powered task management solution.

**Built with ❤️ using Spec-Driven Development**
