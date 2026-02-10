# Vercel Deployment - Step by Step Guide

## Fresh Start - Yeh Steps Follow Karo

### Step 1: Vercel Dashboard
1. https://vercel.com/dashboard par jao
2. Agar login nahi ho toh GitHub se login karo
3. "Add New..." button click karo
4. "Project" select karo

### Step 2: Import Repository
1. "Import Git Repository" section mein
2. Search box mein type karo: `Phase_4_Todo__Chatbot-`
3. Jab repository dikhe, "Import" button click karo

### Step 3: Configure Project (IMPORTANT)
```
Project Name: todo-chatbot-frontend
Framework Preset: Vite
Root Directory: frontend (IMPORTANT - yeh select karna zaroori hai)
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Step 4: Environment Variables (Skip for now)
"Deploy" button directly click karo
(Environment variables baad mein add kar sakte hain)

### Step 5: Wait for Deployment
- 2-3 minutes wait karo
- Build logs dekhte raho
- Green checkmark dikhe toh successful

### Step 6: Access Your App
- Vercel aapko URL dega: `https://todo-chatbot-frontend-xxx.vercel.app`
- Click karo aur app open hoga

## Agar Phir Bhi Error Aaye

### Option A: Direct Link Use Karo
https://vercel.com/new/clone?repository-url=https://github.com/umemasultan/Phase_4_Todo__Chatbot-&root-directory=frontend

### Option B: Vercel CLI Use Karo
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd E:\Phase_four\frontend
vercel
```

## Common Issues

### Issue 1: Repository Not Found
**Solution**: GitHub repository public hai check karo

### Issue 2: Build Failed
**Solution**: Root directory "frontend" select kiya hai check karo

### Issue 3: 404 Error
**Solution**:
- Browser cache clear karo (Ctrl + Shift + Delete)
- Incognito mode mein try karo
- Different browser use karo

## Quick Deploy Command (Fastest Way)

```bash
cd E:\Phase_four\frontend
npx vercel --prod
```

Yeh command automatically sab kuch setup kar dega.

---

**Note**: Backend abhi local chalao (localhost:3000)
Frontend Vercel par chalega aur local backend se connect hoga.
