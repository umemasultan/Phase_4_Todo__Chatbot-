# Todo Chatbot - Deployment Guide

This guide walks you through deploying the Todo Chatbot application to a local Minikube cluster.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)

---

## Prerequisites

### Required Software

1. **Docker Desktop** (or Docker Engine)
   - Download: https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

2. **Minikube**
   - Download: https://minikube.sigs.k8s.io/docs/start/
   - Verify: `minikube version`

3. **kubectl**
   - Download: https://kubernetes.io/docs/tasks/tools/
   - Verify: `kubectl version --client`

4. **Helm**
   - Download: https://helm.sh/docs/intro/install/
   - Verify: `helm version`

5. **Claude API Key**
   - Sign up at: https://console.anthropic.com/
   - Create an API key from the dashboard

### System Requirements

- **CPU**: 4 cores minimum
- **RAM**: 8GB minimum
- **Disk**: 20GB free space
- **OS**: Windows 10/11, macOS, or Linux

---

## Quick Start

For experienced users, here's the fastest path to deployment:

```bash
# 1. Setup Minikube
./scripts/setup-minikube.sh  # Linux/Mac
# OR
scripts\setup-minikube.bat   # Windows

# 2. Configure Docker to use Minikube's daemon
eval $(minikube docker-env)  # Linux/Mac
# OR
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i  # Windows

# 3. Build images
./scripts/build-images.sh    # Linux/Mac
# OR
scripts\build-images.bat     # Windows

# 4. Deploy application
./scripts/deploy-minikube.sh # Linux/Mac
# OR
scripts\deploy-minikube.bat  # Windows

# 5. Access application
# Open http://todo-chatbot.local in your browser
```

---

## Detailed Setup

### Step 1: Initialize Minikube Cluster

#### Linux/macOS

```bash
cd /path/to/Phase_four
chmod +x scripts/*.sh
./scripts/setup-minikube.sh
```

#### Windows

```cmd
cd E:\Phase_four
scripts\setup-minikube.bat
```

**What this does:**
- Starts Minikube with 4 CPUs and 8GB RAM
- Enables Ingress controller for routing
- Enables Metrics Server for autoscaling
- Displays Minikube IP address

**Expected output:**
```
Minikube setup completed successfully!
Minikube IP: 192.168.49.2
```

---

### Step 2: Configure Hosts File

Add the Minikube IP to your hosts file to access the application via domain name.

#### Linux/macOS

```bash
# Get Minikube IP
MINIKUBE_IP=$(minikube ip)

# Add to hosts file (requires sudo)
echo "$MINIKUBE_IP todo-chatbot.local" | sudo tee -a /etc/hosts
```

#### Windows (Administrator)

1. Open Notepad as Administrator
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add line: `<MINIKUBE_IP> todo-chatbot.local`
4. Save and close

**Verify:**
```bash
ping todo-chatbot.local
```

---

### Step 3: Configure Docker Environment

Point your Docker CLI to Minikube's Docker daemon so images are built directly in the cluster.

#### Linux/macOS

```bash
eval $(minikube docker-env)
```

Add to your shell profile for persistence:
```bash
# For bash
echo 'eval $(minikube docker-env)' >> ~/.bashrc

# For zsh
echo 'eval $(minikube docker-env)' >> ~/.zshrc
```

#### Windows (PowerShell)

```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

#### Windows (CMD)

```cmd
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i
```

**Verify:**
```bash
docker info | grep minikube
# Should show: Name: minikube
```

---

### Step 4: Build Docker Images

Build the frontend and backend Docker images.

#### Linux/macOS

```bash
./scripts/build-images.sh
```

#### Windows

```cmd
scripts\build-images.bat
```

**What this does:**
- Builds backend image with Node.js and TypeScript
- Builds frontend image with React and Nginx
- Tags images as `latest` and version-specific

**Expected output:**
```
Docker images built successfully!
Images created:
  - todo-chatbot/backend:latest
  - todo-chatbot/frontend:latest
```

**Verify:**
```bash
docker images | grep todo-chatbot
```

---

### Step 5: Deploy Application

Deploy the application using Helm.

#### Linux/macOS

```bash
./scripts/deploy-minikube.sh
```

#### Windows

```cmd
scripts\deploy-minikube.bat
```

**What this does:**
1. Creates `todo-chatbot` namespace
2. Prompts for secrets (Claude API key, JWT secret, DB password)
3. Deploys PostgreSQL StatefulSet with persistent storage
4. Deploys backend and frontend deployments
5. Creates services and ingress
6. Runs database migrations
7. Verifies deployment

**You will be prompted for:**
- **Claude API Key**: Your Anthropic API key (required)
- **JWT Secret**: Press Enter to auto-generate
- **Database Password**: Press Enter to auto-generate

**Expected output:**
```
Deployment completed successfully!
Application is accessible at:
  http://todo-chatbot.local
```

---

### Step 6: Verify Deployment

Check that all pods are running:

```bash
kubectl get pods -n todo-chatbot
```

**Expected output:**
```
NAME                        READY   STATUS    RESTARTS   AGE
backend-xxxxx-xxxxx         1/1     Running   0          2m
backend-xxxxx-xxxxx         1/1     Running   0          2m
frontend-xxxxx-xxxxx        1/1     Running   0          2m
frontend-xxxxx-xxxxx        1/1     Running   0          2m
postgres-0                  1/1     Running   0          2m
```

Check services:

```bash
kubectl get svc -n todo-chatbot
```

Check ingress:

```bash
kubectl get ingress -n todo-chatbot
```

---

### Step 7: Access Application

Open your browser and navigate to:

```
http://todo-chatbot.local
```

**First-time setup:**
1. Click "Sign Up" to create an account
2. Enter email and password (min 8 characters)
3. You'll be automatically logged in
4. Start chatting with the AI assistant!

**Example interactions:**
- "add buy groceries tomorrow"
- "show me my pending tasks"
- "mark the first todo as done"
- "what's due today?"

---

## Configuration

### Environment-Specific Deployments

#### Development (Default)

Uses `values-dev.yaml` with lower resource limits:

```bash
./scripts/deploy-minikube.sh
```

#### Production

Uses `values.yaml` with production settings:

```bash
./scripts/deploy-minikube.sh --prod
```

#### Custom Values

Use a custom values file:

```bash
helm install todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  -f ./helm/todo-chatbot/values-custom.yaml
```

---

### Updating Configuration

#### Update ConfigMap

Edit `helm/todo-chatbot/values.yaml` or `values-dev.yaml`:

```yaml
config:
  nodeEnv: production
  logLevel: debug  # Change log level
  features:
    chatHistory: true
    aiSuggestions: false  # Disable feature
```

Apply changes:

```bash
helm upgrade todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  -f ./helm/todo-chatbot/values-dev.yaml
```

#### Update Secrets

Delete and recreate secrets:

```bash
kubectl delete secret app-secrets -n todo-chatbot
./scripts/deploy-minikube.sh
```

---

### Scaling

#### Manual Scaling

Scale backend replicas:

```bash
kubectl scale deployment backend -n todo-chatbot --replicas=3
```

Scale frontend replicas:

```bash
kubectl scale deployment frontend -n todo-chatbot --replicas=3
```

#### Autoscaling (HPA)

Horizontal Pod Autoscaler is enabled by default for the backend.

View HPA status:

```bash
kubectl get hpa -n todo-chatbot
```

Modify HPA settings in `values.yaml`:

```yaml
backend:
  autoscaling:
    enabled: true
    minReplicas: 2
    maxReplicas: 10
    targetCPUUtilizationPercentage: 70
```

---

## Troubleshooting

### Pods Not Starting

**Check pod status:**
```bash
kubectl get pods -n todo-chatbot
kubectl describe pod <pod-name> -n todo-chatbot
```

**Common issues:**
- Image pull errors: Ensure Docker is using Minikube's daemon
- Resource constraints: Increase Minikube resources
- Secrets missing: Verify secrets exist

---

### Database Connection Errors

**Check PostgreSQL pod:**
```bash
kubectl logs -f postgres-0 -n todo-chatbot
```

**Check backend logs:**
```bash
kubectl logs -f -l app=backend -n todo-chatbot
```

**Verify DATABASE_URL secret:**
```bash
kubectl get secret app-secrets -n todo-chatbot -o jsonpath='{.data.DATABASE_URL}' | base64 -d
```

---

### Ingress Not Working

**Check ingress status:**
```bash
kubectl get ingress -n todo-chatbot
kubectl describe ingress todo-chatbot-ingress -n todo-chatbot
```

**Verify Ingress controller:**
```bash
kubectl get pods -n ingress-nginx
```

**Check hosts file:**
```bash
cat /etc/hosts | grep todo-chatbot  # Linux/Mac
type C:\Windows\System32\drivers\etc\hosts | findstr todo-chatbot  # Windows
```

---

### Claude API Errors

**Check backend logs:**
```bash
kubectl logs -f -l app=backend -n todo-chatbot | grep -i claude
```

**Verify API key:**
```bash
kubectl get secret app-secrets -n todo-chatbot -o jsonpath='{.data.CLAUDE_API_KEY}' | base64 -d
```

**Test API key manually:**
```bash
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $CLAUDE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"claude-3-5-sonnet-20241022","max_tokens":10,"messages":[{"role":"user","content":"Hi"}]}'
```

---

### Application Not Accessible

**Check all components:**
```bash
kubectl get all -n todo-chatbot
```

**Test backend directly:**
```bash
kubectl port-forward -n todo-chatbot svc/backend-service 3000:3000
curl http://localhost:3000/api/health/liveness
```

**Test frontend directly:**
```bash
kubectl port-forward -n todo-chatbot svc/frontend-service 8080:80
# Open http://localhost:8080 in browser
```

---

## Maintenance

### View Logs

**Backend logs:**
```bash
kubectl logs -f -l app=backend -n todo-chatbot
```

**Frontend logs:**
```bash
kubectl logs -f -l app=frontend -n todo-chatbot
```

**PostgreSQL logs:**
```bash
kubectl logs -f postgres-0 -n todo-chatbot
```

**All logs:**
```bash
kubectl logs -f --all-containers=true -n todo-chatbot
```

---

### Database Backup

**Create backup:**
```bash
kubectl exec -n todo-chatbot postgres-0 -- pg_dump -U postgres todo_chatbot > backup.sql
```

**Restore backup:**
```bash
cat backup.sql | kubectl exec -i -n todo-chatbot postgres-0 -- psql -U postgres todo_chatbot
```

---

### Update Application

**Rebuild images:**
```bash
./scripts/build-images.sh v1.1.0
```

**Upgrade Helm release:**
```bash
helm upgrade todo-chatbot ./helm/todo-chatbot \
  -n todo-chatbot \
  -f ./helm/todo-chatbot/values-dev.yaml \
  --set backend.image.tag=v1.1.0 \
  --set frontend.image.tag=v1.1.0
```

---

### Rollback Deployment

**View release history:**
```bash
helm history todo-chatbot -n todo-chatbot
```

**Rollback to previous version:**
```bash
helm rollback todo-chatbot -n todo-chatbot
```

**Rollback to specific revision:**
```bash
helm rollback todo-chatbot 2 -n todo-chatbot
```

---

### Uninstall Application

**Delete Helm release:**
```bash
helm uninstall todo-chatbot -n todo-chatbot
```

**Delete namespace (including PVCs):**
```bash
kubectl delete namespace todo-chatbot
```

**Stop Minikube:**
```bash
minikube stop
```

**Delete Minikube cluster:**
```bash
minikube delete
```

---

## Next Steps

- **Production Deployment**: Adapt for cloud providers (EKS, GKE, AKS)
- **Monitoring**: Add Prometheus and Grafana
- **Logging**: Integrate with ELK or Loki stack
- **CI/CD**: Setup GitHub Actions or GitLab CI
- **Security**: Add network policies, pod security policies
- **Backup**: Automate database backups with CronJobs

---

## Support

For issues or questions:
- Check logs: `kubectl logs -f -l app=backend -n todo-chatbot`
- Review documentation: `docs/architecture.md`
- Open an issue on GitHub
