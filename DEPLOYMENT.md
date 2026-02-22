# 🚀 Deployment Guide: AI Farmer Advisory

This guide outlines the steps to deploy the AI Farmer Advisory platform using a **Hybrid Strategy** (Vercel for Frontend, Render/Railway for Backend).

## 🌍 Overview
- **Frontend:** [Vercel](https://vercel.com) (Optimized for React/Vite)
- **Backend Server:** [Render](https://render.com) or [Railway](https://railway.app) (Optimized for Node.js)
- **ML Service:** [Render](https://render.com) or [Railway](https://railway.app) (Optimized for Python/Flask)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Managed Cloud Database)

---

## 1. 🐍 ML Service (Python/Flask)
Deploy this first as the Node.js server depends on it.

1.  Create a new Web Service on Render/Railway.
2.  **Root Directory:** `ml_service`
3.  **Build Command:** `pip install -r requirements.txt`
4.  **Start Command:** `gunicorn app:app`
5.  **Environment Variables:**
    - `PORT`: `5001` (or leave default if the platform handles it)
6.  **Note:** After deployment, copy the **Service URL** (e.g., `https://ml-service.onrender.com`).

---

## 2. 🟢 Backend Server (Node.js/Express)

1.  Create a new Web Service on Render/Railway.
2.  **Root Directory:** `server`
3.  **Build Command:** `npm install`
4.  **Start Command:** `npm start`
5.  **Environment Variables:**
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A long, random security string.
    - `ML_SERVICE_URL`: The URL from **Step 1** (e.g., `https://ml-service.onrender.com`).
    - `FRONTEND_URL`: Your Vercel URL (Update this *after* Step 3).
6.  **Note:** After deployment, copy the **API URL** (e.g., `https://api-server.onrender.com`).

---

## 3. 🔵 Frontend (React/Vite)

1.  Connect your GitHub repo to Vercel.
2.  **Root Directory:** `client`
3.  **Framework Preset:** Vite
4.  **Environment Variables:**
    - `VITE_API_URL`: The URL from **Step 2** + `/api` (e.g., `https://api-server.onrender.com/api`).
5.  **Deploy!**
6.  *Final Step:* Copy your Vercel URL and add it to the `FRONTEND_URL` variable in your **Backend Server** settings (Step 2) to fix CORS.

---

## ✅ Post-Deployment Checklist
- [ ] Sign up as a new user on the production URL.
- [ ] Connect your OpenWeatherMap key in the backend `.env` for live weather.
- [ ] Run a prediction and verify it saves to your production history.

---
© 2026 SmartBiz.Insight • AI Farmer Advisory Platform
