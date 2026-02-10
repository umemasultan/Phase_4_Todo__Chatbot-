# End-to-End Testing Guide

This guide provides a comprehensive checklist for testing the Todo Chatbot application after deployment to Minikube.

## Pre-Deployment Testing

### 1. Prerequisites Verification

- [ ] Docker installed and running
  ```bash
  docker --version
  docker ps
  ```

- [ ] Minikube installed
  ```bash
  minikube version
  ```

- [ ] kubectl installed
  ```bash
  kubectl version --client
  ```

- [ ] Helm installed
  ```bash
  helm version
  ```

- [ ] Claude API key obtained
  - Sign up at https://console.anthropic.com/
  - Create API key from dashboard

---

## Deployment Testing

### 2. Minikube Setup

- [ ] Start Minikube cluster
  ```bash
  ./scripts/setup-minikube.sh
  ```

- [ ] Verify cluster is running
  ```bash
  minikube status
  kubectl cluster-info
  kubectl get nodes
  ```

- [ ] Verify addons are enabled
  ```bash
  minikube addons list | grep -E "ingress|metrics-server"
  ```

- [ ] Configure Docker environment
  ```bash
  eval $(minikube docker-env)
  docker info | grep minikube
  ```

- [ ] Add hosts entry
  ```bash
  echo "$(minikube ip) todo-chatbot.local" | sudo tee -a /etc/hosts
  ping todo-chatbot.local
  ```

### 3. Image Building

- [ ] Build backend image
  ```bash
  cd backend
  docker build -t todo-chatbot/backend:latest .
  ```

- [ ] Build frontend image
  ```bash
  cd frontend
  docker build -t todo-chatbot/frontend:latest .
  ```

- [ ] Verify images exist
  ```bash
  docker images | grep todo-chatbot
  ```

### 4. Application Deployment

- [ ] Deploy with Helm
  ```bash
  ./scripts/deploy-minikube.sh
  ```

- [ ] Verify namespace created
  ```bash
  kubectl get namespace todo-chatbot
  ```

- [ ] Verify secrets created
  ```bash
  kubectl get secret app-secrets -n todo-chatbot
  ```

- [ ] Verify ConfigMap created
  ```bash
  kubectl get configmap app-config -n todo-chatbot
  ```

---

## Infrastructure Testing

### 5. Pod Status

- [ ] All pods are running
  ```bash
  kubectl get pods -n todo-chatbot
  ```
  Expected: All pods in `Running` state with `1/1` or `2/2` ready

- [ ] Backend pods (2 replicas)
  ```bash
  kubectl get pods -l app=backend -n todo-chatbot
  ```

- [ ] Frontend pods (2 replicas)
  ```bash
  kubectl get pods -l app=frontend -n todo-chatbot
  ```

- [ ] PostgreSQL pod (1 replica)
  ```bash
  kubectl get pods -l app=postgres -n todo-chatbot
  ```

### 6. Service Status

- [ ] All services exist
  ```bash
  kubectl get svc -n todo-chatbot
  ```

- [ ] Backend service (ClusterIP:3000)
  ```bash
  kubectl describe svc backend-service -n todo-chatbot
  ```

- [ ] Frontend service (ClusterIP:80)
  ```bash
  kubectl describe svc frontend-service -n todo-chatbot
  ```

- [ ] PostgreSQL service (Headless)
  ```bash
  kubectl describe svc postgres-service -n todo-chatbot
  ```

### 7. Ingress Status

- [ ] Ingress exists and has address
  ```bash
  kubectl get ingress -n todo-chatbot
  ```

- [ ] Ingress rules configured correctly
  ```bash
  kubectl describe ingress todo-chatbot-ingress -n todo-chatbot
  ```

### 8. Storage Status

- [ ] PVC bound to PV
  ```bash
  kubectl get pvc -n todo-chatbot
  ```
  Expected: `postgres-pvc` with status `Bound`

### 9. HPA Status

- [ ] HPA exists for backend
  ```bash
  kubectl get hpa -n todo-chatbot
  ```

- [ ] HPA metrics available
  ```bash
  kubectl describe hpa backend-hpa -n todo-chatbot
  ```

---

## Application Testing

### 10. Health Checks

- [ ] Backend liveness probe
  ```bash
  kubectl exec -n todo-chatbot $(kubectl get pod -l app=backend -n todo-chatbot -o jsonpath='{.items[0].metadata.name}') -- wget -qO- http://localhost:3000/api/health/liveness
  ```
  Expected: `{"status":"ok",...}`

- [ ] Backend readiness probe
  ```bash
  kubectl exec -n todo-chatbot $(kubectl get pod -l app=backend -n todo-chatbot -o jsonpath='{.items[0].metadata.name}') -- wget -qO- http://localhost:3000/api/health/readiness
  ```
  Expected: `{"status":"ready","checks":{"database":true,...}}`

- [ ] Frontend health check
  ```bash
  kubectl exec -n todo-chatbot $(kubectl get pod -l app=frontend -n todo-chatbot -o jsonpath='{.items[0].metadata.name}') -- wget -qO- http://localhost/health
  ```
  Expected: `OK`

### 11. Database Connectivity

- [ ] PostgreSQL is accepting connections
  ```bash
  kubectl exec -n todo-chatbot postgres-0 -- pg_isready -U postgres
  ```
  Expected: `accepting connections`

- [ ] Database exists
  ```bash
  kubectl exec -n todo-chatbot postgres-0 -- psql -U postgres -c "\l" | grep todo_chatbot
  ```

- [ ] Tables created (after migration)
  ```bash
  kubectl exec -n todo-chatbot postgres-0 -- psql -U postgres -d todo_chatbot -c "\dt"
  ```
  Expected: `users`, `todos`, `chat_messages` tables

### 12. Database Migrations

- [ ] Run migrations
  ```bash
  BACKEND_POD=$(kubectl get pods -n todo-chatbot -l app=backend -o jsonpath='{.items[0].metadata.name}')
  kubectl exec -n todo-chatbot $BACKEND_POD -- npx prisma migrate deploy
  ```

- [ ] Verify migration success
  ```bash
  kubectl logs -n todo-chatbot $BACKEND_POD | grep -i migration
  ```

---

## Frontend Testing

### 13. Access Application

- [ ] Open browser to http://todo-chatbot.local
- [ ] Page loads without errors
- [ ] No console errors in browser DevTools
- [ ] UI renders correctly

### 14. User Registration

- [ ] Click "Sign Up" link
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `testpassword123`
- [ ] Confirm password: `testpassword123`
- [ ] Click "Sign Up" button
- [ ] Redirected to dashboard
- [ ] No errors displayed

### 15. User Login

- [ ] Logout from current session
- [ ] Click "Sign In" link
- [ ] Enter email: `test@example.com`
- [ ] Enter password: `testpassword123`
- [ ] Click "Sign In" button
- [ ] Redirected to dashboard
- [ ] User email displayed in header

### 16. Todo Dashboard

- [ ] Dashboard displays empty state (no todos)
- [ ] Chat interface visible on left
- [ ] Todo list visible on right
- [ ] No errors in console

---

## Chat Interface Testing

### 17. Create Todo via Chat

- [ ] Type: "add buy groceries tomorrow"
- [ ] Press Enter or click Send
- [ ] AI responds with confirmation
- [ ] New todo appears in dashboard
- [ ] Todo has correct title: "buy groceries"
- [ ] Todo has due date (tomorrow)
- [ ] Todo status is PENDING

### 18. Create Todo with Priority

- [ ] Type: "add call mom with high priority"
- [ ] AI responds with confirmation
- [ ] Todo appears with HIGH priority (red chip)

### 19. Query Todos

- [ ] Type: "show me my pending tasks"
- [ ] AI lists current pending todos
- [ ] Response matches dashboard

### 20. Update Todo Status

- [ ] Type: "mark buy groceries as done"
- [ ] AI confirms completion
- [ ] Todo moves to Completed section
- [ ] Todo has checkmark icon
- [ ] Title has strikethrough

### 21. Delete Todo

- [ ] Type: "delete call mom"
- [ ] AI confirms deletion
- [ ] Todo removed from dashboard

### 22. General Chat

- [ ] Type: "hello"
- [ ] AI responds conversationally
- [ ] No todo actions performed

---

## Manual Todo Operations

### 23. Create Todo Manually

- [ ] Use API or create via chat
- [ ] Verify todo appears in dashboard

### 24. Edit Todo

- [ ] Click edit icon on a todo
- [ ] Edit dialog opens
- [ ] Change title
- [ ] Change priority
- [ ] Set due date
- [ ] Click Save
- [ ] Changes reflected in dashboard

### 25. Toggle Todo Status

- [ ] Click checkbox on pending todo
- [ ] Todo moves to completed section
- [ ] Click checkbox on completed todo
- [ ] Todo moves back to pending section

### 26. Delete Todo Manually

- [ ] Click delete icon on a todo
- [ ] Confirm deletion
- [ ] Todo removed from dashboard

---

## API Testing

### 27. Authentication Endpoints

- [ ] Register endpoint
  ```bash
  curl -X POST http://todo-chatbot.local/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"api-test@example.com","password":"password123"}'
  ```
  Expected: 201 status, token returned

- [ ] Login endpoint
  ```bash
  curl -X POST http://todo-chatbot.local/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"api-test@example.com","password":"password123"}'
  ```
  Expected: 200 status, token returned

- [ ] Get current user
  ```bash
  TOKEN="<your-token>"
  curl http://todo-chatbot.local/api/auth/me \
    -H "Authorization: Bearer $TOKEN"
  ```
  Expected: 200 status, user data returned

### 28. Todo Endpoints

- [ ] List todos
  ```bash
  curl http://todo-chatbot.local/api/todos \
    -H "Authorization: Bearer $TOKEN"
  ```

- [ ] Create todo
  ```bash
  curl -X POST http://todo-chatbot.local/api/todos \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"API test todo","priority":"HIGH"}'
  ```

- [ ] Update todo
  ```bash
  TODO_ID="<todo-id>"
  curl -X PATCH http://todo-chatbot.local/api/todos/$TODO_ID \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status":"COMPLETED"}'
  ```

- [ ] Delete todo
  ```bash
  curl -X DELETE http://todo-chatbot.local/api/todos/$TODO_ID \
    -H "Authorization: Bearer $TOKEN"
  ```

### 29. Chat Endpoints

- [ ] Send chat message
  ```bash
  curl -X POST http://todo-chatbot.local/api/chat/message \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"message":"add test todo via API"}'
  ```

- [ ] Get chat history
  ```bash
  curl http://todo-chatbot.local/api/chat/history \
    -H "Authorization: Bearer $TOKEN"
  ```

---

## Performance Testing

### 30. Load Testing

- [ ] Create multiple todos (10+)
- [ ] Dashboard loads quickly
- [ ] Chat responds in <2 seconds
- [ ] No performance degradation

### 31. Autoscaling

- [ ] Generate load on backend
  ```bash
  kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://backend-service.todo-chatbot:3000/api/health/liveness; done"
  ```

- [ ] Watch HPA scale up
  ```bash
  kubectl get hpa -n todo-chatbot -w
  ```

- [ ] Verify new pods created
  ```bash
  kubectl get pods -l app=backend -n todo-chatbot
  ```

- [ ] Stop load generator (Ctrl+C)

- [ ] Watch HPA scale down (after 5 minutes)

---

## Resilience Testing

### 32. Pod Restart

- [ ] Delete a backend pod
  ```bash
  kubectl delete pod -l app=backend -n todo-chatbot --force --grace-period=0 | head -1
  ```

- [ ] Verify new pod created automatically
  ```bash
  kubectl get pods -l app=backend -n todo-chatbot -w
  ```

- [ ] Application still accessible
- [ ] No data loss

### 33. Database Persistence

- [ ] Create a todo
- [ ] Note the todo ID
- [ ] Delete PostgreSQL pod
  ```bash
  kubectl delete pod postgres-0 -n todo-chatbot
  ```

- [ ] Wait for pod to restart
  ```bash
  kubectl get pods -l app=postgres -n todo-chatbot -w
  ```

- [ ] Verify todo still exists
- [ ] Data persisted successfully

---

## Logging & Monitoring

### 34. Log Verification

- [ ] Backend logs are structured JSON
  ```bash
  kubectl logs -l app=backend -n todo-chatbot --tail=20
  ```

- [ ] Frontend logs show Nginx access logs
  ```bash
  kubectl logs -l app=frontend -n todo-chatbot --tail=20
  ```

- [ ] PostgreSQL logs show queries (if enabled)
  ```bash
  kubectl logs postgres-0 -n todo-chatbot --tail=20
  ```

### 35. Metrics

- [ ] Backend metrics endpoint
  ```bash
  kubectl exec -n todo-chatbot $(kubectl get pod -l app=backend -n todo-chatbot -o jsonpath='{.items[0].metadata.name}') -- wget -qO- http://localhost:3000/api/health/metrics
  ```

- [ ] HPA metrics available
  ```bash
  kubectl top pods -n todo-chatbot
  ```

---

## Security Testing

### 36. Authentication

- [ ] Access protected endpoint without token
  ```bash
  curl http://todo-chatbot.local/api/todos
  ```
  Expected: 401 Unauthorized

- [ ] Access with invalid token
  ```bash
  curl http://todo-chatbot.local/api/todos \
    -H "Authorization: Bearer invalid-token"
  ```
  Expected: 403 Forbidden

### 37. Authorization

- [ ] User A cannot access User B's todos
- [ ] User A cannot delete User B's todos
- [ ] Each user sees only their own data

### 38. Input Validation

- [ ] Try to register with invalid email
  ```bash
  curl -X POST http://todo-chatbot.local/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid-email","password":"password123"}'
  ```
  Expected: 400 Bad Request with validation error

- [ ] Try to create todo with empty title
  ```bash
  curl -X POST http://todo-chatbot.local/api/todos \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":""}'
  ```
  Expected: 400 Bad Request

---

## Cleanup Testing

### 39. Uninstall Application

- [ ] Uninstall Helm release
  ```bash
  helm uninstall todo-chatbot -n todo-chatbot
  ```

- [ ] Verify pods deleted
  ```bash
  kubectl get pods -n todo-chatbot
  ```

- [ ] Delete namespace
  ```bash
  kubectl delete namespace todo-chatbot
  ```

- [ ] Verify PVC deleted
  ```bash
  kubectl get pvc -A | grep todo-chatbot
  ```

### 40. Redeploy

- [ ] Deploy again
  ```bash
  ./scripts/deploy-minikube.sh
  ```

- [ ] Verify clean deployment
- [ ] No leftover data from previous deployment

---

## Test Results Summary

### Passed Tests: _____ / 40

### Failed Tests:
- [ ] Test #___ - Description: ___________
- [ ] Test #___ - Description: ___________

### Issues Found:
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Notes:
___________________________________________
___________________________________________
___________________________________________

---

## Sign-off

- [ ] All critical tests passed
- [ ] Application is production-ready (for local dev)
- [ ] Documentation is accurate
- [ ] Known issues documented

**Tested by:** ___________
**Date:** ___________
**Environment:** Minikube ___________
**Kubernetes Version:** ___________
