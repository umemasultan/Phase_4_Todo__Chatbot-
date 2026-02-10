# 🚀 Quick Start - Run on Localhost

## Step-by-Step Instructions

### 1️⃣ Start Docker Desktop

**IMPORTANT:** Before running any scripts, make sure Docker Desktop is running!

- Open Docker Desktop from Windows Start Menu
- Wait for the whale icon in system tray to be steady (not animated)
- Verify: Open Command Prompt and type `docker --version`

---

### 2️⃣ Run Setup Script

Open Command Prompt and run:

```cmd
cd E:\Phase_four
setup-localhost.bat
```

**What this does:**
- ✅ Starts PostgreSQL database in Docker
- ✅ Installs backend dependencies
- ✅ Installs frontend dependencies
- ✅ Creates configuration files
- ✅ Runs database migrations

**⚠️ IMPORTANT:** When prompted, you MUST add your Claude API key!

1. The script will pause and ask you to edit `backend\.env`
2. Open the file: `notepad backend\.env`
3. Replace `REPLACE_WITH_YOUR_CLAUDE_API_KEY` with your actual key
4. Save and close
5. Press Enter to continue

---

### 3️⃣ Start Backend Server

Open a **NEW** Command Prompt window and run:

```cmd
cd E:\Phase_four
start-backend.bat
```

**Expected output:**
```
Starting backend on http://localhost:3000
Server started on port 3000
Database connection successful
```

**Keep this window open!** Don't close it.

---

### 4️⃣ Start Frontend Server

Open **ANOTHER NEW** Command Prompt window and run:

```cmd
cd E:\Phase_four
start-frontend.bat
```

**Expected output:**
```
Starting frontend on http://localhost:5173
VITE v6.0.5  ready in 500 ms
➜  Local:   http://localhost:5173/
```

**Keep this window open too!**

---

### 5️⃣ Access Application

Open your browser and go to:

```
http://localhost:5173
```

**You should see:**
- 🎨 **Dark theme with color #15173D**
- 🌙 Dark navy background
- 💜 Indigo accents and borders
- ✨ Professional dark aesthetic

---

## 🎯 Test the Dark Theme

1. **Login Page:**
   - Dark navy form container
   - White text on dark background
   - Indigo "Sign Up" link

2. **Register Account:**
   - Click "Sign Up"
   - Email: `test@example.com`
   - Password: `password123`
   - See dark theme throughout

3. **Dashboard:**
   - Dark gradient background
   - Dark AppBar with #15173D
   - Chat interface on left (dark)
   - Todo dashboard on right (dark)

4. **Chat with AI:**
   - Type: "add buy groceries tomorrow"
   - User message: Bright indigo bubble
   - AI response: Dark navy bubble

5. **Todo Cards:**
   - Dark cards with indigo borders
   - Hover to see glow effect
   - Edit/delete buttons

---

## 🛑 Stop Everything

When you're done testing:

1. **Stop Backend:** Press `Ctrl+C` in backend window
2. **Stop Frontend:** Press `Ctrl+C` in frontend window
3. **Stop Database:** Run `stop-localhost.bat`

Or simply run:
```cmd
cd E:\Phase_four
stop-localhost.bat
```

---

## 🔧 Troubleshooting

### "Docker is not running"
**Solution:** Start Docker Desktop and wait for it to fully start

### "Failed to start PostgreSQL"
**Solution:** Port 5432 might be in use
```cmd
docker stop todo-postgres
docker rm todo-postgres
setup-localhost.bat
```

### "CLAUDE_API_KEY is required"
**Solution:** Edit `backend\.env` and add your API key
```cmd
notepad backend\.env
```

### "Cannot find module"
**Solution:** Dependencies not installed
```cmd
cd backend
npm install
cd ..\frontend
npm install
```

### Browser shows old theme
**Solution:** Hard refresh
- Chrome/Edge: `Ctrl + Shift + R`
- Firefox: `Ctrl + F5`
- Or use Incognito/Private window

---

## 📁 Scripts Reference

| Script | Purpose |
|--------|---------|
| `setup-localhost.bat` | One-time setup (database, dependencies) |
| `start-backend.bat` | Start backend server |
| `start-frontend.bat` | Start frontend server |
| `stop-localhost.bat` | Stop all services |

---

## ✅ Success Checklist

After following these steps, you should have:

- [x] Docker Desktop running
- [x] PostgreSQL container running
- [x] Backend server running on port 3000
- [x] Frontend server running on port 5173
- [x] Application accessible at http://localhost:5173
- [x] **Dark theme visible with color #15173D**
- [x] Can register and login
- [x] Can create todos via chat
- [x] Chat interface shows dark theme
- [x] Todo cards show dark theme

---

## 🎨 Dark Theme Features

What you'll see:
- **Background:** Dark gradient from `#0a0b1e` to `#15173D`
- **AppBar:** Dark `#15173D` with shadow
- **Papers:** Semi-transparent dark surfaces
- **User Messages:** Bright indigo `#6366f1` with glow
- **Assistant Messages:** Dark navy `rgba(21, 23, 61, 0.8)`
- **Todo Cards:** Dark with indigo borders and hover effects
- **Text:** White primary, light indigo-gray secondary
- **Links:** Indigo `#818cf8`

---

## 🚀 You're Ready!

**Just 4 commands to see the dark theme:**

```cmd
1. setup-localhost.bat
2. start-backend.bat (in new window)
3. start-frontend.bat (in new window)
4. Open http://localhost:5173
```

**Enjoy your dark-themed Todo Chatbot!** 🌙✨
