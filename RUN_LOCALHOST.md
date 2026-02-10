# Run Todo Chatbot on Localhost (Without Kubernetes)
# Quick Local Development Setup

## Overview

This guide runs the application directly on localhost using:
- PostgreSQL in Docker
- Backend Node.js server
- Frontend React dev server

**Advantages:**
- ✅ Fast startup (no Kubernetes needed)
- ✅ Hot reload for development
- ✅ Easy debugging
- ✅ See dark theme immediately

---

## Prerequisites

- [x] Docker Desktop running
- [ ] Node.js 20+ installed
- [ ] npm installed

---

## Step 1: Start PostgreSQL Database

Open Command Prompt and run:

```cmd
docker run -d ^
  --name todo-postgres ^
  -e POSTGRES_USER=postgres ^
  -e POSTGRES_PASSWORD=postgres123 ^
  -e POSTGRES_DB=todo_chatbot ^
  -p 5432:5432 ^
  postgres:16-alpine
```

**Verify it's running:**
```cmd
docker ps | findstr todo-postgres
```

---

## Step 2: Setup Backend

Open a **new Command Prompt** window:

```cmd
cd E:\Phase_four\backend

REM Install dependencies
npm install

REM Create .env file
echo DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/todo_chatbot?schema=public > .env
echo JWT_SECRET=local-dev-secret-change-in-production >> .env
echo CLAUDE_API_KEY=YOUR_CLAUDE_API_KEY_HERE >> .env
echo NODE_ENV=development >> .env
echo PORT=3000 >> .env
echo LOG_LEVEL=info >> .env
```

**IMPORTANT:** Replace `YOUR_CLAUDE_API_KEY_HERE` with your actual Claude API key!

Edit the `.env` file:
```cmd
notepad .env
```

Then run migrations:
```cmd
npx prisma migrate deploy
```

Start the backend:
```cmd
npm run dev
```

**Expected output:**
```
Server started on port 3000
Database connection successful
```

**Keep this window open!**

---

## Step 3: Setup Frontend

Open a **third Command Prompt** window:

```cmd
cd E:\Phase_four\frontend

REM Install dependencies
npm install

REM Create .env file
echo VITE_API_URL=http://localhost:3000 > .env

REM Start development server
npm run dev
```

**Expected output:**
```
VITE v6.0.5  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 4: Access Application

Open your browser and go to:
```
http://localhost:5173
```

**You should see:**
- ✅ Dark theme with color #15173D
- ✅ Login page with dark navy background
- ✅ Indigo accents and borders
- ✅ Professional dark aesthetic

---

## Step 5: Test the Application

1. **Register a new account:**
   - Click "Sign Up"
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Confirm password: `password123`
   - Click "Sign Up"

2. **Test Chat Interface:**
   - Type: "add buy groceries tomorrow"
   - See the dark theme in action
   - User message: Bright indigo bubble
   - AI response: Dark navy bubble

3. **Test Todo Dashboard:**
   - View todos in dark cards
   - Hover over cards to see glow effect
   - Edit/delete todos

---

## Troubleshooting

### Issue: PostgreSQL port already in use

**Solution:**
```cmd
REM Stop existing container
docker stop todo-postgres
docker rm todo-postgres

REM Start fresh
docker run -d --name todo-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=todo_chatbot -p 5432:5432 postgres:16-alpine
```

### Issue: Backend won't start - "Cannot find module"

**Solution:**
```cmd
cd E:\Phase_four\backend
rmdir /s /q node_modules
npm install
```

### Issue: Frontend won't start

**Solution:**
```cmd
cd E:\Phase_four\frontend
rmdir /s /q node_modules
npm install
npm run dev
```

### Issue: "CLAUDE_API_KEY is required"

**Solution:**
Edit `backend/.env` and add your Claude API key:
```
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

### Issue: Database connection failed

**Solution:**
```cmd
REM Check PostgreSQL is running
docker ps | findstr postgres

REM Check logs
docker logs todo-postgres

REM Verify connection string in backend/.env
type backend\.env
```

### Issue: CORS errors in browser

**Solution:**
The backend already has CORS enabled. If you still see errors:
1. Check that frontend is accessing `http://localhost:3000`
2. Check `frontend/.env` has correct API URL
3. Restart backend server

---

## Quick Commands Reference

**Start everything:**
```cmd
REM Terminal 1: Database
docker start todo-postgres

REM Terminal 2: Backend
cd E:\Phase_four\backend
npm run dev

REM Terminal 3: Frontend
cd E:\Phase_four\frontend
npm run dev
```

**Stop everything:**
```cmd
REM Stop backend: Ctrl+C in backend terminal
REM Stop frontend: Ctrl+C in frontend terminal
REM Stop database:
docker stop todo-postgres
```

**View logs:**
```cmd
REM Database logs
docker logs -f todo-postgres

REM Backend logs: visible in terminal
REM Frontend logs: visible in terminal
```

**Reset database:**
```cmd
docker stop todo-postgres
docker rm todo-postgres
docker run -d --name todo-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres123 -e POSTGRES_DB=todo_chatbot -p 5432:5432 postgres:16-alpine

cd E:\Phase_four\backend
npx prisma migrate deploy
```

---

## Development Workflow

**Making changes to frontend:**
1. Edit files in `frontend/src/`
2. Changes auto-reload in browser (hot reload)
3. No need to restart server

**Making changes to backend:**
1. Edit files in `backend/src/`
2. Server auto-restarts (nodemon)
3. Check terminal for errors

**Changing theme colors:**
1. Edit `frontend/src/App.tsx`
2. Modify the `createTheme()` configuration
3. Save file
4. Browser auto-reloads with new theme

---

## Advantages of Local Development

✅ **Fast iteration** - See changes immediately
✅ **Easy debugging** - Console logs visible
✅ **Hot reload** - No manual restarts
✅ **Simple setup** - No Kubernetes complexity
✅ **Resource efficient** - Uses less RAM/CPU

---

## When to Use Kubernetes

Use the Kubernetes deployment when:
- Testing production-like environment
- Testing scaling (HPA)
- Testing ingress routing
- Testing pod restarts/resilience
- Preparing for cloud deployment

For **development and testing the dark theme**, local setup is recommended!

---

## Success Checklist

After following this guide, verify:

- [ ] PostgreSQL container running
- [ ] Backend server running on port 3000
- [ ] Frontend dev server running on port 5173
- [ ] Application accessible at http://localhost:5173
- [ ] Dark theme visible (#15173D)
- [ ] Can register new account
- [ ] Can login
- [ ] Can create todos via chat
- [ ] Chat interface shows dark theme
- [ ] Todo cards show dark theme
- [ ] All text is readable

---

## Next Steps

Once you've tested locally and everything works:

1. **Deploy to Kubernetes** (optional):
   - Follow `DEPLOY_DARK_THEME.md`
   - Access via http://todo-chatbot.local

2. **Customize theme** (optional):
   - Edit `frontend/src/App.tsx`
   - Adjust colors in `createTheme()`

3. **Add features** (optional):
   - Modify backend routes
   - Add frontend components

---

**You're ready to run on localhost! Follow the steps above.** 🚀
