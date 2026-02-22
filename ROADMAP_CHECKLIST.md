# 🌱 AI Farmer Advisory — MVP Roadmap & Checklist

## 🗂 Project Overview
A web app where a farmer inputs **N, P, K, pH, Temperature, Humidity, Rainfall** and receives:
- ✅ Best crop recommendation
- ✅ Irrigation need level (Low / Medium / High)

---

## 📅 Week 1 — Data & ML Model

### Phase 1.1 · Dataset Preparation
- [x] Download **Kaggle Crop Recommendation Dataset** (`.csv`)
- [x] Place dataset in project directory (`Crop_recommendation.csv`)
- [x] Open Jupyter Notebook / VS Code for EDA (`notebooks/model_training.ipynb` created)
- [x] Check for null/missing values
- [x] Check class distribution (are all crops balanced?)
- [x] Review feature ranges (N, P, K, pH, Temp, Humidity, Rainfall)
- [x] Save cleaned dataset as `crop_data_clean.csv`

### Phase 1.2 · Feature Engineering
- [x] Verify all 7 input features are numeric
- [x] Normalize / scale features if needed (StandardScaler)
- [x] Encode label column (crop name → integer) using `LabelEncoder`
- [x] Split data → **80% train / 20% test** (stratified split)

### Phase 1.3 · Crop Recommendation Model
- [x] Train **Random Forest Classifier**
- [x] Train **Decision Tree Classifier** (for comparison)
- [x] Evaluate both models:
  - [x] Accuracy score
  - [x] Classification report (precision, recall, F1)
  - [x] Confusion matrix (visualize with seaborn heatmap)
- [x] Pick the better model
- [x] Save model using `joblib` → `models/crop_model.pkl`
- [x] Save `LabelEncoder` → `models/label_encoder.pkl`

### Phase 1.4 · Irrigation Suggestion Logic
- [x] Implement **Rule-Based Logic** first (fast, no dataset needed):
  ```python
  if rainfall < 60:   return "High"
  elif humidity > 70: return "Low"
  else:               return "Medium"
  ```
- [x] (Optional) Train simple regression model for water need if you have data
- [x] Test irrigation function with sample inputs

---

## 📅 Week 2 — MERN Backend & ML Service

### Phase 2.1 · Node.js & Express Setup
- [x] Initialize Node.js server (`npm init`, `express`)
- [x] Set up **MongoDB** (Atlas/Local) & Mongoose schemas
- [x] Create API routes for `/api/recommendations`
- [x] Implement Node → Python communication (calling Flask prediction endpoint)

### Phase 2.2 · ML Microservice (Flask)
- [x] Create `app.py` (Existing model logic)
- [x] Load `.pkl` models at startup
- [x] Secure Flask for internal calls only (Updated port to 5001)

### Phase 2.3 · Business Logic & Auth (Optional for MVP)
- [x] Middleware for input validation (Implemented in Node)
- [x] Save farmer history to MongoDB
- [x] GET `/api/history` to retrieve past records

---

## 📅 Week 3 — React Frontend & Integration

### Phase 3.1 · React App Setup
- [x] Create React app (using Vite)
- [x] Install Tailwind CSS + DaisyUI/HeadlessUI
- [x] Set up folder structure: `/components`, `/hooks`, `/pages`

### Phase 3.2 · UI Components
- [x] Build **Farmer Input Form** (React Hook Form + Yup)
- [x] Create **Recommendation Dashboard**
- [x] Build **History Table** (Fetch data from MongoDB via Node)
- [x] Implement **Real-time Vitality Gauges** (N, P, K, pH, Temp, Hum, Rain)

### Phase 3.3 · Deployment & Final Evaluation
- [x] Connect React (Vite) to Node (Express)
- [x] Test the full MERN flow (Verified via CLI test script)
- [ ] Deploy Node/Mongo (Render/Railway) + React (Vercel)
- [x] **Premium UI/UX Overhaul** (Glassmorphism + Framer Motion)
- [x] **User Authentication** (JWT + Secure Sessions)
- [x] **Real-time Weather Integration** (Geolocation + OpenWeatherMap)

---

## ✅ Final MVP Deliverables Checklist

| Deliverable | Status |
|---|---|
| Working React Web App | ✅ |
| Node.js API (Server) | ✅ |
| MongoDB Database | ✅ |
| Python ML Prediction Service | ✅ |
| Sample farmer demo (5 test cases) | ✅ |

---

## 🚫 Scope Freeze — Do NOT Add in MVP

These are explicitly **out of scope** for now:
- IoT sensors
- Satellite imagery
- LSTM rainfall prediction
- Real-time weather APIs
- Mobile app / voice support

---

## 🚀 Phase 2 Backlog (Post-MVP)

| Feature | Priority |
|---|---|
| User Authentication (Passport.js/JWT) | High |
| Weather API integration (OpenWeatherMap) | High |
| Yield prediction model | Medium |
| Fertilizer dosage optimization | Medium |

---

## 🗃 Suggested File Structure (MERN)

```
AI-Farmer-Advisory/
├── client/ (React App)
│   ├── src/
│   └── tailwind.config.js
├── server/ (Node/Express API)
│   ├── models/ (Mongoose)
│   ├── routes/
│   └── index.js
├── ml_service/ (Python/Flask)
│   ├── models/ (.pkl files)
│   ├── app.py
│   └── requirements.txt
├── data/
└── README.md
```
