# Frontend Rebuild and Deployment Guide
# Dark Theme #15173D Implementation

## Prerequisites Check

Before starting, ensure:
- [ ] Docker Desktop is running
- [ ] Minikube cluster is running
- [ ] kubectl is configured

---

## Step 1: Start Docker Desktop

**Windows:**
1. Open Docker Desktop from Start Menu
2. Wait for Docker to fully start (whale icon in system tray should be steady)
3. Verify Docker is running:
   ```cmd
   docker --version
   docker ps
   ```

---

## Step 2: Configure Docker for Minikube

**Windows (Command Prompt):**
```cmd
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i
```

**Windows (PowerShell):**
```powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
```

**Verify:**
```cmd
docker info | findstr minikube
```
You should see "Name: minikube"

---

## Step 3: Rebuild Frontend Image

Navigate to project directory and build:

```cmd
cd E:\Phase_four\frontend
docker build -t todo-chatbot/frontend:latest .
```

**Expected output:**
- Multiple build steps (1/2, 2/2)
- "Successfully built <image-id>"
- "Successfully tagged todo-chatbot/frontend:latest"

**Build time:** ~2-5 minutes depending on your system

---

## Step 4: Verify Image Built

```cmd
docker images | findstr todo-chatbot
```

**Expected output:**
```
todo-chatbot/frontend   latest   <image-id>   <time>   ~50MB
todo-chatbot/backend    latest   <image-id>   <time>   ~200MB
```

---

## Step 5: Restart Frontend Deployment

```cmd
kubectl rollout restart deployment/frontend -n todo-chatbot
```

**Expected output:**
```
deployment.apps/frontend restarted
```

---

## Step 6: Wait for Rollout to Complete

```cmd
kubectl rollout status deployment/frontend -n todo-chatbot
```

**Expected output:**
```
Waiting for deployment "frontend" rollout to finish: 1 old replicas are pending termination...
Waiting for deployment "frontend" rollout to finish: 1 old replicas are pending termination...
deployment "frontend" successfully rolled out
```

This may take 30-60 seconds.

---

## Step 7: Verify Pods are Running

```cmd
kubectl get pods -n todo-chatbot -l app=frontend
```

**Expected output:**
```
NAME                        READY   STATUS    RESTARTS   AGE
frontend-xxxxx-xxxxx        1/1     Running   0          1m
frontend-xxxxx-xxxxx        1/1     Running   0          1m
```

Both pods should show "Running" status.

---

## Step 8: Check Pod Logs (Optional)

```cmd
kubectl logs -l app=frontend -n todo-chatbot --tail=20
```

Look for Nginx startup messages - no errors should appear.

---

## Step 9: Access Application

Open your browser and navigate to:
```
http://todo-chatbot.local
```

**What you should see:**
- Dark navy background (#15173D)
- Login page with dark theme
- Indigo accents and borders
- Professional shadows

---

## Step 10: Test Dark Theme

1. **Login Page:**
   - Dark navy form container
   - White text on dark background
   - Indigo "Sign Up" link

2. **Register and Login:**
   - Create account or login with existing credentials

3. **Dashboard:**
   - Dark gradient background
   - Dark AppBar with #15173D
   - Two-column layout (Chat | Todos)
   - Semi-transparent dark papers

4. **Chat Interface:**
   - Dark chat container
   - Type: "add buy groceries tomorrow"
   - User message: Bright indigo bubble
   - AI response: Dark navy bubble

5. **Todo Cards:**
   - Dark cards with indigo borders
   - Hover effects with glow
   - Color-coded priority chips

---

## Troubleshooting

### Issue: Docker not running
**Solution:**
```cmd
# Start Docker Desktop manually
# Wait for it to fully start
docker --version
```

### Issue: Minikube not running
**Solution:**
```cmd
minikube status
# If not running:
minikube start
```

### Issue: Image not building
**Solution:**
```cmd
# Check Docker environment
docker info

# Ensure you're in the right directory
cd E:\Phase_four\frontend
dir Dockerfile

# Try building with verbose output
docker build -t todo-chatbot/frontend:latest . --progress=plain
```

### Issue: Pods not restarting
**Solution:**
```cmd
# Force delete old pods
kubectl delete pods -l app=frontend -n todo-chatbot

# Check deployment status
kubectl describe deployment frontend -n todo-chatbot

# Check events
kubectl get events -n todo-chatbot --sort-by='.lastTimestamp'
```

### Issue: Application not accessible
**Solution:**
```cmd
# Check ingress
kubectl get ingress -n todo-chatbot

# Check hosts file
type C:\Windows\System32\drivers\etc\hosts | findstr todo-chatbot

# Port forward as alternative
kubectl port-forward -n todo-chatbot svc/frontend-service 8080:80
# Then access: http://localhost:8080
```

### Issue: Old theme still showing
**Solution:**
```cmd
# Hard refresh browser
# Chrome/Edge: Ctrl + Shift + R
# Firefox: Ctrl + F5

# Clear browser cache
# Or use incognito/private window

# Verify image was rebuilt
docker images todo-chatbot/frontend:latest

# Check pod is using new image
kubectl describe pod -l app=frontend -n todo-chatbot | findstr Image:
```

---

## Complete Command Sequence

**Copy and paste these commands one by one:**

```cmd
REM 1. Start Docker Desktop (manual step)

REM 2. Configure Docker for Minikube
@FOR /f "tokens=*" %i IN ('minikube docker-env --shell cmd') DO @%i

REM 3. Build frontend image
cd E:\Phase_four\frontend
docker build -t todo-chatbot/frontend:latest .

REM 4. Verify image
docker images | findstr todo-chatbot

REM 5. Restart deployment
kubectl rollout restart deployment/frontend -n todo-chatbot

REM 6. Wait for rollout
kubectl rollout status deployment/frontend -n todo-chatbot

REM 7. Check pods
kubectl get pods -n todo-chatbot

REM 8. Access application
start http://todo-chatbot.local
```

---

## Verification Checklist

After deployment, verify:

- [ ] Docker Desktop is running
- [ ] Frontend image rebuilt successfully
- [ ] Frontend pods are in "Running" state (2/2)
- [ ] Application accessible at http://todo-chatbot.local
- [ ] Login page shows dark theme (#15173D)
- [ ] Dashboard shows dark gradient background
- [ ] Chat interface has dark containers
- [ ] Todo cards have dark styling with indigo borders
- [ ] User messages appear in bright indigo
- [ ] Assistant messages appear in dark navy
- [ ] All text is readable (white on dark)
- [ ] Links are indigo colored
- [ ] Hover effects work on todo cards

---

## Success Indicators

✅ **Build Success:**
```
Successfully built <image-id>
Successfully tagged todo-chatbot/frontend:latest
```

✅ **Deployment Success:**
```
deployment "frontend" successfully rolled out
```

✅ **Pods Running:**
```
frontend-xxxxx-xxxxx   1/1   Running   0   1m
frontend-xxxxx-xxxxx   1/1   Running   0   1m
```

✅ **Visual Confirmation:**
- Dark theme visible throughout application
- Color #15173D present in UI elements
- Professional, modern aesthetic

---

## Next Steps After Successful Deployment

1. **Test All Features:**
   - User registration
   - Login/logout
   - Create todos via chat
   - Edit todos manually
   - Delete todos
   - Chat history

2. **Performance Check:**
   - Page load times
   - Chat response times
   - Todo operations

3. **Browser Compatibility:**
   - Test in Chrome/Edge
   - Test in Firefox
   - Test in Safari (if available)

4. **Mobile Responsive:**
   - Resize browser window
   - Check mobile view

---

## Support

If you encounter issues:

1. **Check logs:**
   ```cmd
   kubectl logs -l app=frontend -n todo-chatbot
   ```

2. **Check pod status:**
   ```cmd
   kubectl describe pod -l app=frontend -n todo-chatbot
   ```

3. **Check deployment:**
   ```cmd
   kubectl describe deployment frontend -n todo-chatbot
   ```

4. **Review documentation:**
   - `docs/deployment-guide.md`
   - `docs/dark-theme-implementation.md`
   - `docs/testing-guide.md`

---

**The dark theme is ready to deploy! Follow the steps above to see your new UI.** 🎨
