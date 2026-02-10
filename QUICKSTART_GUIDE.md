# 🚀 Todo Chatbot - Quick Start Guide

## ✅ Everything is Ready!

Your Todo Chatbot with dark theme #15173D is fully configured and ready to run.

---

## 🎯 ONE COMMAND TO RUN EVERYTHING

**Double-click this file:**
```
E:\Phase_four\RUN.bat
```

**That's it!** The script will:
1. ✅ Check if your Claude API key is configured
2. ✅ If not configured, open the file for you to add it
3. ✅ Stop any old servers
4. ✅ Start backend with CORS fix
5. ✅ Start frontend with dark theme
6. ✅ Verify both are running
7. ✅ Open browser automatically

---

## 🔑 First Time Setup (30 seconds)

**If you haven't added your Claude API key yet:**

The script will automatically open `backend\.env` for you.

**Just change this line:**
```
CLAUDE_API_KEY=REPLACE_WITH_YOUR_CLAUDE_API_KEY
```

**To:**
```
CLAUDE_API_KEY=sk-ant-api03-your-actual-key-here
```

**Save (Ctrl+S), close Notepad, and run RUN.bat again.**

> Get your API key from: https://console.anthropic.com/

---

## 🎨 What You'll See

**After running RUN.bat:**

1. **Two minimized windows** (backend and frontend servers)
2. **Browser opens automatically** to http://localhost:5173
3. **Dark theme visible** with color #15173D:
   - Dark navy background
   - Indigo accents
   - Professional dark aesthetic
   - No CORS errors!

---

## 🧪 Test Your Application

**1. Register an Account:**
- Click "Sign Up"
- Email: `test@example.com`
- Password: `password123`
- Click "Sign Up"

**2. Chat with AI:**
- Type: "add buy groceries tomorrow"
- See dark indigo user bubble
- See dark navy AI response

**3. Manage Todos:**
- View todos in dark cards
- Hover for indigo glow
- Edit, complete, delete todos

---

## 🛑 How to Stop

**Option 1: Close Windows**
- Find minimized windows in taskbar
- Close "Backend - Todo Chatbot"
- Close "Frontend - Todo Chatbot"

**Option 2: Command**
```cmd
taskkill /F /FI "WINDOWTITLE eq Backend*"
taskkill /F /FI "WINDOWTITLE eq Frontend*"
```

---

## 🔧 Troubleshooting

### Issue: "Port already in use"
**Solution:** The script automatically kills old processes. If it still fails, restart your computer.

### Issue: "Cannot find module"
**Solution:**
```cmd
cd E:\Phase_four\backend
npm install

cd E:\Phase_four\frontend
npm install
```

### Issue: CORS errors in browser
**Solution:** The CORS fix is already applied. Just make sure you ran RUN.bat (not manual npm commands).

### Issue: "CLAUDE_API_KEY is required"
**Solution:** Run RUN.bat again - it will open the config file for you.

---

## ✅ Success Checklist

After running RUN.bat, verify:

- [ ] Two minimized windows in taskbar
- [ ] Browser opened to http://localhost:5173
- [ ] Dark theme visible (#15173D)
- [ ] Can register/login
- [ ] No CORS errors in console (F12)
- [ ] Can chat with AI
- [ ] Can create/edit/delete todos

---

## 🎯 Next Steps

**Once it's working:**
- Customize the theme in `frontend\src\App.tsx`
- Modify AI prompts in `backend\src\services\claude-service.ts`
- Add new features
- Deploy to Kubernetes (optional)

---

## 📞 Need Help?

**Check server logs:**
- Click the minimized windows in taskbar
- Look for error messages

**Common fixes:**
- Restart: Close windows and run RUN.bat again
- Clean install: Delete node_modules, run npm install
- Check API key: Open backend\.env and verify

---

**Ready? Double-click RUN.bat and enjoy your dark-themed Todo Chatbot!** 🚀
