# 🚀 Deployment Guide: Vercel Unified Stack

This guide explains how to deploy the entire AI Farmer Advisory platform (Frontend, Node.js Backend, and Python ML) as a single Vercel project.

## 📦 One-Click Deployment on Vercel

1.  **Push your code to GitHub.**
2.  **Import the project to Vercel.**
3.  **Vercel Settings:**
    - **Framework Preset:** Vite (Vercel will detect the root `vercel.json`).
    - **Root Directory:** `./` (Leave as default).
4.  **Environment Variables:**
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A long, random security string.
    - `WEATHER_API_KEY`: Your OpenWeatherMap API Key (optional).
5.  **Deploy!**

## 🏗️ Architecture on Vercel
- **Frontend:** Served from `client/dist`.
- **Node.js API:** Served as a serverless function from `api/index.js`.
- **Python ML:** Served as a serverless function from `api/predict.py`.

---

## ✅ Post-Deployment Checklist
1. Open your Vercel URL.
2. Sign up for a new account.
3. Verify that "Sync Live Weather" works (Geolocation needs to be enabled).
4. Run a prediction and check your "Audit Log" history.

---
© 2026 SmartBiz.Insight • AI Farmer Advisory Platform Unified
