# GitNova — FREE Deployment Guide (Step by Step)

This guide will deploy your project to the internet for FREE.
No experience needed — just follow each step exactly.

**What you need:**
- A GitHub account (free) — https://github.com/signup
- A Vercel account (free) — https://vercel.com/signup
- A Render account (free) — https://render.com/signup
- Your project code on GitHub

---

## STEP 1: Put Your Code on GitHub

1. Go to https://github.com and click the **+** icon → **New repository**
2. Name it `gitnova`
3. Make it **Public** (free tier requirement)
4. Do NOT check "Add a README" (you already have one)
5. Click **Create repository**
6. Follow the "push an existing repository" instructions:
   ```bash
   cd "C:\new fyp idea\gitmastery-pro"
   git init
   git add .
   git commit -m "GitNova - initial deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/gitnova.git
   git push -u origin main
   ```

---

## STEP 2: Deploy the Backend (Render)

This makes your API server live on the internet.

1. Go to https://render.com and sign up with GitHub
2. Click **New +** → **Web Service**
3. Click **Build and deploy from a Git repository** → **Next**
4. Connect your GitHub account if asked
5. Select your `gitnova` repository → **Next**
6. Fill in these settings:
   - **Name:** `gitnova-api`
   - **Runtime:** `Node`
   - **Build Command:**
     ```
     cd server && npm install && npm run build && npx prisma generate && npx prisma db push
     ```
   - **Start Command:**
     ```
     cd server && node dist/index.js
     ```
7. Click **Advanced** → Add these **Environment Variables** (click "Add Environment Variable" for each):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgresql://neondb_owner:YOUR_NEON_PASSWORD@ep-nameless-water-atcci8rx-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require` |
   | `JWT_SECRET` | *(click Generate — it will create a random secure string)* |
   | `PORT` | `3001` |
   | `CORS_ORIGIN` | *(leave empty for now — you'll fill this in STEP 4)* |

8. Click **Create Web Service**
9. Wait 3-5 minutes for it to build and deploy
10. When it says **"Live"**, copy the URL (something like `https://gitnova-api.onrender.com`)
11. Test it: open that URL + `/api/health` in your browser. You should see `{"status":"ok"}`

---

## STEP 3: Deploy the Frontend (Vercel)

This makes your website live on the internet.

1. Go to https://vercel.com and sign up with GitHub
2. Click **Add New...** → **Project**
3. Import your `gitnova` repository → **Import**
4. Vercel will auto-detect it's a Vite project — keep the defaults
5. **IMPORTANT:** Before clicking Deploy, click **Environment Variables** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://gitnova-api.onrender.com/api` |

   *(Use the URL you copied from Step 2, with `/api` at the end)*

6. Click **Deploy**
7. Wait 1-2 minutes
8. When it says **"Ready"**, click the preview to see your live site!
9. Copy your Vercel URL (something like `https://gitnova-xxxxx.vercel.app`)

---

## STEP 4: Connect Frontend to Backend (CORS)

Now tell the backend to accept requests from your frontend.

1. Go back to https://render.com → your `gitnova-api` service
2. Click **Environment** tab
3. Find `CORS_ORIGIN` and click the **pencil** icon to edit
4. Set it to:
   ```
   https://gitnova-xxxxx.vercel.app
   ```
   *(Use YOUR actual Vercel URL from Step 3)*
5. Click **Save Changes**
6. Wait 1-2 minutes for it to restart

---

## STEP 5: Test Everything

1. Open your Vercel URL in your browser
2. You should see the GitNova landing page
3. Try registering a new account
4. Try logging in
5. Try the demo mode
6. Check the dashboard

**If something doesn't work:**
- Open browser console (F12 → Console tab)
- Look for error messages
- The most common issue is the CORS_ORIGIN not matching your Vercel URL exactly

---

## That's It! Your Project is Live!

Your URLs:
- **Frontend:** `https://gitnova-xxxxx.vercel.app`
- **Backend API:** `https://gitnova-api.onrender.com`
- **API Health Check:** `https://gitnova-api.onrender.com/api/health`

Both are **100% free** and will stay online.

---

## Common Issues

### "CORS error" in browser console
- Your `CORS_ORIGIN` on Render doesn't match your Vercel URL exactly
- Make sure there's no trailing slash: `https://gitnova-xxx.vercel.app` not `https://gitnova-xxx.vercel.app/`

### "Cannot connect to API"
- Check that Render service shows **Live** status
- Check the Environment Variables on Render are correct
- The backend takes ~30 seconds to wake up after inactivity (free tier)

### "Build failed" on Render
- Check the build logs on Render
- Make sure the build command is exactly: `cd server && npm install && npm run build && npx prisma generate && npx prisma db push`

### Registration/Login not working
- Check that `DATABASE_URL` is correct on Render
- Check that `JWT_SECRET` is set on Render
