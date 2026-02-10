# Todo Chatbot - Architecture Documentation

## Overview

The Todo Chatbot is a cloud-native application that enables users to manage their todos through natural language conversation powered by Claude AI. The application follows modern microservices principles, containerization with Docker, and orchestration with Kubernetes.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         External User                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS/HTTP
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Kubernetes Ingress (Nginx)                    │
│                    Host: todo-chatbot.local                      │
└─────────────┬───────────────────────────────────┬───────────────┘
              │                                   │
              │ /api/*                           │ /*
              ▼                                   ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│   Backend Service       │         │   Frontend Service      │
│   (ClusterIP:3000)      │         │   (ClusterIP:80)        │
└──────────┬──────────────┘         └──────────┬──────────────┘
           │                                    │
           │                                    │
           ▼                                    ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│  Backend Deployment     │         │  Frontend Deployment    │
│  (2-5 replicas, HPA)    │         │  (2 replicas)           │
│                         │         │                         │
│  ┌─────────────────┐   │         │  ┌─────────────────┐   │
│  │ Node.js + TS    │   │         │  │ React SPA       │   │
│  │ Express API     │   │         │  │ on Nginx        │   │
│  │ Prisma ORM      │   │         │  │ Material-UI     │   │
│  │ Claude SDK      │   │         │  │                 │   │
│  └─────────────────┘   │         │  └─────────────────┘   │
└──────────┬──────────────┘         └─────────────────────────┘
           │
           │ DATABASE_URL
           ▼
┌─────────────────────────┐         ┌─────────────────────────┐
│  PostgreSQL Service     │         │   Claude API            │
│  (Headless ClusterIP)   │◄────────┤   (External)            │
└──────────┬──────────────┘         │   api.anthropic.com     │
           │                         └─────────────────────────┘
           ▼
┌─────────────────────────┐
│  PostgreSQL StatefulSet │
│  (1 replica)            │
│                         │
│  ┌─────────────────┐   │
│  │ PostgreSQL 16   │   │
│  │ PVC: 10Gi       │   │
│  └─────────────────┘   │
└─────────────────────────┘
```

---

## Component Architecture

### 1. Frontend Layer

**Technology Stack:**
- React 18+ with TypeScript
- Material-UI for components
- Vite for build tooling
- Nginx for serving static files

**Responsibilities:**
- User authentication UI (login/register)
- Chat interface for natural language input
- Todo dashboard with CRUD operations
- JWT token management
- API client for backend communication

**Deployment:**
- Multi-stage Docker build (Node build → Nginx runtime)
- 2 replicas for high availability
- ClusterIP service on port 80
- Health checks on `/health` endpoint

**Key Files:**
- `frontend/src/App.tsx` - Main application component
- `frontend/src/components/ChatInterface.tsx` - Chat UI
- `frontend/src/components/TodoDashboard.tsx` - Todo management
- `frontend/src/services/ApiClient.ts` - HTTP client
- `frontend/nginx.conf` - SPA routing configuration

---

### 2. Backend Layer

**Technology Stack:**
- Node.js 20 LTS with TypeScript
- Express.js for REST API
- Prisma ORM for database access
- Anthropic SDK for Claude API
- Winston for structured logging
- Zod for validation

**Responsibilities:**
- RESTful API endpoints (auth, todos, chat, health)
- JWT authentication and authorization
- Business logic and validation
- Claude API integration for NLP
- Database operations via Prisma
- Health checks and metrics

**Deployment:**
- Multi-stage Docker build (Node build → production runtime)
- 2-5 replicas with Horizontal Pod Autoscaler
- ClusterIP service on port 3000
- Liveness probe: `/api/health/liveness`
- Readiness probe: `/api/health/readiness`

**Key Files:**
- `backend/src/index.ts` - Express application entry
- `backend/src/routes/` - API route handlers
- `backend/src/services/claude-service.ts` - Claude integration
- `backend/src/services/todo-service.ts` - Todo business logic
- `backend/src/middleware/auth.ts` - JWT authentication
- `backend/prisma/schema.prisma` - Database schema

---

### 3. Database Layer

**Technology Stack:**
- PostgreSQL 16 Alpine
- Prisma as ORM
- Persistent Volume for data storage

**Schema:**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Todos table
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('PENDING', 'COMPLETED') DEFAULT 'PENDING',
  due_date TIMESTAMP,
  priority ENUM('LOW', 'MEDIUM', 'HIGH') DEFAULT 'MEDIUM',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role ENUM('USER', 'ASSISTANT') NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Deployment:**
- StatefulSet with 1 replica
- PersistentVolumeClaim (10Gi)
- Headless ClusterIP service
- Health checks via `pg_isready`

---

### 4. Ingress Layer

**Technology Stack:**
- Nginx Ingress Controller

**Routing Rules:**
- `/api/*` → Backend Service (port 3000)
- `/*` → Frontend Service (port 80)

**Configuration:**
- Host: `todo-chatbot.local`
- No TLS (local development)
- Rewrite target enabled

---

## Data Flow

### User Registration Flow

```
1. User submits email + password
   ↓
2. Frontend → POST /api/auth/register
   ↓
3. Backend validates input (Zod)
   ↓
4. Backend hashes password (bcrypt)
   ↓
5. Backend creates user in PostgreSQL (Prisma)
   ↓
6. Backend generates JWT token
   ↓
7. Backend returns token + user data
   ↓
8. Frontend stores token in localStorage
   ↓
9. Frontend redirects to dashboard
```

---

### Chat Message Flow

```
1. User types: "add buy groceries tomorrow"
   ↓
2. Frontend → POST /api/chat/message
   ↓
3. Backend saves user message to chat_messages
   ↓
4. Backend fetches user's recent todos (context)
   ↓
5. Backend builds system prompt with context
   ↓
6. Backend → Claude API (Anthropic)
   ↓
7. Claude analyzes intent and extracts data
   ↓
8. Claude returns structured JSON response
   ↓
9. Backend parses intent (CREATE)
   ↓
10. Backend creates todo in PostgreSQL
    ↓
11. Backend saves assistant reply to chat_messages
    ↓
12. Backend returns reply + updated todos
    ↓
13. Frontend displays reply in chat
    ↓
14. Frontend updates todo dashboard
```

---

### Claude API Integration Pattern

**System Prompt Structure:**
```
You are a helpful todo assistant. The user's current todos are:
- [PENDING] Buy groceries (Priority: MEDIUM, Due: 2026-02-11)
- [COMPLETED] Call mom (Priority: HIGH, Due: None)

Parse the user's message and determine their intent...
```

**Intent Detection:**
- **CREATE**: "add buy milk", "remind me to call John"
- **UPDATE**: "mark groceries as done", "change priority to high"
- **DELETE**: "delete the first todo", "remove groceries"
- **QUERY**: "show completed tasks", "what's due today?"
- **CHAT**: "hello", "how are you?"

**Response Format:**
```json
{
  "intent": "CREATE",
  "action": {
    "type": "create",
    "data": {
      "title": "buy milk",
      "dueDate": "2026-02-11T00:00:00Z",
      "priority": "MEDIUM"
    }
  },
  "reply": "I've added 'buy milk' to your todos, due tomorrow."
}
```

---

## Security Architecture

### Authentication & Authorization

**JWT Token Flow:**
1. User logs in with email/password
2. Backend verifies credentials
3. Backend generates JWT with payload: `{ userId, email }`
4. Frontend stores token in localStorage
5. Frontend includes token in Authorization header
6. Backend middleware verifies token on protected routes

**Password Security:**
- Bcrypt hashing with salt rounds: 10
- Minimum password length: 8 characters
- No password stored in plain text

**Token Security:**
- JWT secret stored in Kubernetes Secret
- Token expiry: 7 days (configurable)
- No token revocation (use short expiry for production)

---

### Network Security

**Kubernetes Network Policies:**
- Frontend can only communicate with Backend
- Backend can communicate with PostgreSQL and Claude API
- PostgreSQL only accepts connections from Backend

**Ingress Security:**
- SSL/TLS disabled for local (enable for production)
- Security headers in Nginx config
- CORS enabled (restrict origins in production)

---

### Secrets Management

**Kubernetes Secrets:**
- `CLAUDE_API_KEY` - Anthropic API key
- `JWT_SECRET` - JWT signing secret
- `DB_PASSWORD` - PostgreSQL password
- `DATABASE_URL` - Full connection string

**Best Practices:**
- Never commit secrets to version control
- Use `secrets.yaml.template` as reference
- Rotate secrets regularly
- Use external secret managers (Vault, AWS Secrets Manager) in production

---

## Scalability Architecture

### Horizontal Pod Autoscaler (HPA)

**Backend Autoscaling:**
- Min replicas: 2
- Max replicas: 5
- Target CPU: 70%
- Target Memory: 80%
- Scale up: Fast (30s stabilization)
- Scale down: Slow (300s stabilization)

**Scaling Triggers:**
```
High CPU → Add replica
High Memory → Add replica
Low utilization for 5min → Remove replica
```

---

### Database Scaling

**Current Setup:**
- Single PostgreSQL instance (StatefulSet)
- Suitable for local development and small-scale production

**Production Recommendations:**
- Use managed database (AWS RDS, Google Cloud SQL)
- Enable read replicas for read-heavy workloads
- Implement connection pooling (PgBouncer)
- Set up automated backups and point-in-time recovery

---

### Caching Strategy

**Current Implementation:**
- No caching (direct database queries)

**Future Enhancements:**
- Redis for session storage
- Cache Claude API responses (with TTL)
- Cache user todos (invalidate on updates)

---

## Observability Architecture

### Logging

**Structured Logging (Winston):**
```json
{
  "timestamp": "2026-02-10T12:00:00.000Z",
  "level": "info",
  "service": "todo-chatbot-backend",
  "message": "HTTP Request",
  "method": "POST",
  "path": "/api/todos",
  "status": 201,
  "duration_ms": 45,
  "userId": "uuid"
}
```

**Log Levels:**
- `error`: Application errors, exceptions
- `warn`: Warnings, deprecated features
- `info`: HTTP requests, business events
- `debug`: Detailed debugging information

**Log Aggregation (Future):**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Loki + Grafana
- CloudWatch Logs (AWS)

---

### Monitoring

**Health Checks:**
- Liveness: Is the app running?
- Readiness: Is the app ready for traffic?

**Metrics (Future):**
- Prometheus for metrics collection
- Grafana for visualization
- Custom metrics: request rate, error rate, latency

**Key Metrics to Track:**
- Request throughput (req/s)
- Response time (p50, p95, p99)
- Error rate (%)
- Database query time
- Claude API latency
- Pod CPU/Memory usage

---

### Tracing (Future)

**Distributed Tracing:**
- OpenTelemetry for instrumentation
- Jaeger or Zipkin for trace visualization
- Trace requests across frontend → backend → database → Claude API

---

## Deployment Architecture

### Local Development (Minikube)

**Resources:**
- Minikube: 4 CPU, 8GB RAM
- Backend: 256Mi-512Mi memory, 200m-500m CPU
- Frontend: 128Mi-256Mi memory, 100m-200m CPU
- PostgreSQL: 512Mi-1Gi memory, 200m-500m CPU

**Workflow:**
1. Start Minikube cluster
2. Build images in Minikube's Docker
3. Deploy with Helm (values-dev.yaml)
4. Access via Ingress (todo-chatbot.local)

---

### Production Deployment (Cloud)

**Cloud Providers:**
- AWS: EKS (Elastic Kubernetes Service)
- Google Cloud: GKE (Google Kubernetes Engine)
- Azure: AKS (Azure Kubernetes Service)

**Production Enhancements:**
- Use managed database (RDS, Cloud SQL)
- Enable TLS/SSL with cert-manager
- Set up CI/CD pipeline (GitHub Actions, GitLab CI)
- Implement monitoring (Prometheus, Grafana)
- Add logging aggregation (ELK, Loki)
- Configure autoscaling (HPA, Cluster Autoscaler)
- Set up backup and disaster recovery
- Implement network policies
- Use external secret management (Vault, AWS Secrets Manager)

---

## Technology Decisions

### Why Kubernetes?

**Pros:**
- Industry-standard orchestration
- Declarative configuration
- Self-healing and auto-scaling
- Cloud-agnostic (portable)
- Rich ecosystem (Helm, Ingress, HPA)

**Cons:**
- Complex for simple applications
- Steep learning curve
- Operational overhead

**Decision:** Kubernetes provides production-ready infrastructure and is valuable for learning cloud-native patterns.

---

### Why PostgreSQL over MongoDB?

**Pros:**
- Relational data model fits todos (users → todos)
- ACID transactions for data integrity
- Strong typing with Prisma
- Better for structured queries

**Cons:**
- Less flexible schema evolution
- Vertical scaling limitations

**Decision:** Todos are inherently relational, and PostgreSQL provides better guarantees.

---

### Why Monolithic Backend?

**Pros:**
- Simpler development and deployment
- Lower operational overhead
- Sufficient for expected scale
- Easier debugging

**Cons:**
- Less granular scaling
- All features coupled

**Decision:** Microservices add complexity without clear benefits at this scale. Can split later if needed.

---

### Why Helm?

**Pros:**
- Templating for different environments
- Version control for deployments
- Easy upgrades and rollbacks
- Package management

**Cons:**
- Learning curve for templating
- Debugging can be complex

**Decision:** Helm is the de facto standard for Kubernetes packaging and provides flexibility.

---

## Future Enhancements

### Short-term (1-3 months)
- Add unit and integration tests
- Implement CI/CD pipeline
- Add Prometheus metrics
- Set up Grafana dashboards
- Implement rate limiting
- Add email verification

### Medium-term (3-6 months)
- Deploy to cloud (AWS/GCP/Azure)
- Add Redis caching
- Implement WebSocket for real-time updates
- Add todo sharing and collaboration
- Implement recurring todos
- Add mobile app (React Native)

### Long-term (6-12 months)
- Split into microservices (if needed)
- Add AI-powered todo suggestions
- Implement voice input
- Add calendar integration
- Multi-language support
- Advanced analytics dashboard

---

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Claude API Documentation](https://docs.anthropic.com/)
- [12-Factor App Principles](https://12factor.net/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
