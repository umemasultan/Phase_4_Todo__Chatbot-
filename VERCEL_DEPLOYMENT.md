# Vercel Deployment Guide

## ⚠️ Important Notes

**Vercel sirf FRONTEND deploy kar sakta hai. Backend alag deploy karna hoga.**

## Step 1: Backend Deploy Karo (Pehle)

### Option A: Railway.app (Recommended)

1. **Railway Account Banao**: https://railway.app
2. **New Project** → **Deploy from GitHub**
3. **Repository Select**: `umemasultan/Phase_4_Todo__Chatbot-`
4. **Root Directory**: `backend`
5. **Environment Variables Add Karo**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@host:5432/database
   CLAUDE_API_KEY=sk-ant-api03-your-key
   JWT_SECRET=your-secure-secret-key
   FRONTEND_URL=https://your-app.vercel.app
   ```
6. **Deploy** button click karo
7. **Domain Copy Karo**: `https://your-backend.railway.app`

### Option B: Render.com

1. **Render Account**: https://render.com
2. **New Web Service**
3. **Connect GitHub**: `umemasultan/Phase_4_Todo__Chatbot-`
4. **Settings**:
   - Name: `todo-chatbot-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
5. **Environment Variables** (same as above)
6. **Create Web Service**
7. **URL Copy Karo**: `https://your-backend.onrender.com`

## Step 2: Frontend Deploy Karo (Vercel)

### Vercel Deployment

1. **Vercel Account**: https://vercel.com
2. **Add New Project**
3. **Import Git Repository**: `umemasultan/Phase_4_Todo__Chatbot-`
4. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
   (Backend URL jo aapne Step 1 mein copy kiya tha)

6. **Deploy** button click karo

7. **Wait** for deployment (2-3 minutes)

8. **Your App URL**: `https://your-app.vercel.app`

## Step 3: Database Setup (Production)

### Railway PostgreSQL

1. Railway dashboard mein **New** → **Database** → **PostgreSQL**
2. **Connect** button click karo
3. **Connection String** copy karo
4. Backend ke environment variables mein `DATABASE_URL` update karo
5. **Run Migrations**:
   ```bash
   # Railway CLI install karo
   npm i -g @railway/cli

   # Login
   railway login

   # Project select karo
   railway link

   # Migrations run karo
   railway run npx prisma migrate deploy
   ```

## Step 4: Testing

1. **Frontend URL** open karo: `https://your-app.vercel.app`
2. **Register** new account
3. **Login** karo
4. **Chat** test karo
5. **Todos** create karo

## Common Issues & Solutions

### Issue 1: CORS Error
**Solution**: Backend ke environment variables mein `FRONTEND_URL` add karo:
```
FRONTEND_URL=https://your-app.vercel.app
```

### Issue 2: API Not Connecting
**Solution**: Frontend environment variable check karo:
```
VITE_API_URL=https://your-backend.railway.app
```

### Issue 3: Database Connection Failed
**Solution**:
- Railway/Render mein PostgreSQL database create karo
- `DATABASE_URL` environment variable update karo
- Migrations run karo: `npx prisma migrate deploy`

### Issue 4: Build Failed
**Solution**:
- TypeScript errors check karo
- `npm run build` locally test karo
- Dependencies install hain check karo

## Environment Variables Summary

### Backend (Railway/Render)
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
CLAUDE_API_KEY=sk-ant-api03-your-actual-key
JWT_SECRET=your-secure-random-string
FRONTEND_URL=https://your-app.vercel.app
LOG_LEVEL=info
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.railway.app
```

## Deployment Checklist

- [ ] Backend deployed (Railway/Render)
- [ ] PostgreSQL database created
- [ ] Database migrations run
- [ ] Backend environment variables set
- [ ] Backend URL copied
- [ ] Frontend deployed (Vercel)
- [ ] Frontend environment variable set (VITE_API_URL)
- [ ] CORS configured (FRONTEND_URL in backend)
- [ ] Claude API key added
- [ ] Application tested (register, login, chat, todos)

## Cost Estimate

- **Vercel**: Free (Hobby plan)
- **Railway**: $5/month (includes PostgreSQL)
- **Render**: Free tier available (with limitations)
- **Total**: $0-5/month

## Support

Agar koi issue aaye:
1. Browser console check karo (F12)
2. Backend logs check karo (Railway/Render dashboard)
3. Environment variables verify karo
4. CORS configuration check karo

---

**Author**: Umema Sultan
**Built with**: React, Node.js, Claude AI, PostgreSQL
