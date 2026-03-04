# 🌱 AI Farmer Advisory — Progress Summary

> This file tracks what was done at each step of the project.

---

## ✅ Step 1 — Dataset Downloaded
**Date:** 2026-02-20
**Phase:** Week 1 · Phase 1.1 · Dataset Preparation

### What We Did:
- Downloaded the **Kaggle Crop Recommendation Dataset** (`Crop_recommendation.csv`)
- Placed it in the project folder: `AI Farmer Advisory/Crop_recommendation.csv`

### Dataset Info:
- **Rows:** 2,200 (100 samples × 22 crop types)
- **Columns:** N, P, K, temperature, humidity, ph, rainfall, label
- **Target Column:** `label` (crop name — 22 unique classes)
- **Status:** No missing values, clean and ready for EDA

### Next Step:
→ Phase 1.1 continued: Open Jupyter Notebook and perform EDA (Exploratory Data Analysis)

---

## ✅ Step 2 — Jupyter Notebook Created
**Date:** 2026-02-20
**Phase:** Week 1 · All Phases (1.1 → 1.4)

### What We Did:
- Created `notebooks/model_training.ipynb` with full Week 1 pipeline
- Notebook covers:
  - **Phase 1.1** — Load CSV, check nulls, class distribution, correlation heatmap, boxplots
  - **Phase 1.2** — StandardScaler, LabelEncoder, 80/20 stratified train-test split
  - **Phase 1.3** — Train Random Forest & Decision Tree, accuracy, classification report, confusion matrix
  - **Phase 1.4** — Rule-based irrigation logic (`rainfall < 60 → High`, etc.)
  - **Save** — `crop_model.pkl`, `label_encoder.pkl`, `scaler.pkl` saved to `models/`

### Next Step:
→ Open `notebooks/model_training.ipynb` in Jupyter and run all cells top to bottom

---

## ✅ Step 3 — Week 1 Complete: Model Trained & Evaluated
**Date:** 2026-02-21
**Phase:** Week 1 · All Phases

### What We Did:
- Executed `notebooks/model_training.ipynb` successfully.
- **Trained Models:** Random Forest (Best) and Decision Tree.
- **Evaluation:** Generated Confusion Matrix and documented high accuracy in `models/model_report.txt`.
- **Artifacts Saved:** 
  - `models/crop_model.pkl` (Predictive model)
  - `models/scaler.pkl` (Feature scaler)
  - `models/label_encoder.pkl` (Category translator)
- **Learnings:** Documented 7 key ML concepts (Box Plots, Scaling, Random Forest, etc.) in the `Learnings` file.

### Next Step:
→ Week 2: Build Flask/FastAPI Backend (`app.py`) to serve model predictions.

---

## ✅ Step 4 — Backend & Frontend Scaffolding
**Date:** 2026-02-21
**Phase:** Week 2 (Backend) & Week 3 (Frontend Started)

### What We Did:
- **Environment Setup:** Created `requirements.txt` and verified project folder structure.
- **Backend Bridge:** Developed `app.py` using Flask.
  - Efficiently loads the saved `.pkl` models at startup.
  - Implemented `/predict` POST endpoint for real-time inference.
- **Frontend UI:** Created `templates/index.html` using **Tailwind CSS**.
  - Built a responsive "Glassmorphism" styled form.
  - Integrated `fetch` API to handle predictions without page refresh.
  - Added dynamic irrigation badges (High/Medium/Low colors).

### Next Step:
→ Run the application locally or in a virtual environment (`python app.py`) and test with sample inputs!

---

## 🔄 Step 5 — Pivoting to MERN Stack
**Date:** 2026-02-21
**Phase:** Architecture Refactoring

### What Changed:
- **Requirement:** User specified the use of **MERN Stack** (MongoDB, Express, React, Node).
- **Architecture Update:** 
  - The Python/Flask app will now act as a **Prediction Microservice**.
  - A new **Node.js/Express server** will handle API requests and MongoDB storage.
  - A new **React frontend** will replace the static HTML file.
- **Documentation Updated:** `AI_Farmer_Advisory_MVP.md` and `ROADMAP_CHECKLIST.md` now reflect MERN phases.

### Next Step:
→ Draft the MERN Implementation Plan and initialize the React/Node projects.

---

## ✅ Step 6 — MERN Stack Integration Complete
**Date:** 2026-02-21
**Phase:** Week 2 & 3 Combined (MERN Architecture)

### What We Did:
- **Restructuring:** Successfully reorganized the project into `client/`, `server/`, and `ml_service/`.
- **Node.js/Express Backend:**
  - Initialized the server with `cors`, `dotenv`, `mongoose`, and `axios`.
  - Created a **MongoDB** schema to store recommendation history.
  - Implemented the bridge logic: Node.js now calls the Python Flask microservice (port 5001) for ML predictions.
- **Vite/React Frontend:**
  - Scaffolded a new React application with **Tailwind CSS**.
  - Built a comprehensive `App.jsx` featuring:
    - Interactive Soil/Weather input form.
    - Real-time prediction display.
    - Automated **History Log** that updates every time a new recommendation is made.
- **ML Service:** Updated the Flask `app.py` to operate purely as an internal JSON microservice.

### Next Step:
→ **Live Verification:** Run all three services (`ml_service`, `server`, `client`) and perform a test prediction to verify the full end-to-end data flow.

---

---

## ✅ Step 7 — End-to-End MERN Verification Complete
**Date:** 2026-02-22
**Phase:** Week 3 · Final Integration

### What We Did:
- **Service Optimization:** Fixed startup scripts in `server/package.json` and corrected model paths in `ml_service/app.py`.
- **Live Testing:** Verified the full data pipeline using a dedicated Node.js verification script:
  - **Node.js (5000)** successfully connected to **MongoDB**.
  - **ML Service (5001)** successfully loaded models and returned predictions.
  - **End-to-End:** Successfully submitted a sample soil analysis, received a "Rice" recommendation, and verified the record was saved to the database.
- **Diagnostics:** Created `verify_integration.js` as a permanent diagnostic tool for the project.

## ✅ Step 8 — Premium UI & Environmental Gauges
**Date:** 2026-02-22
**Phase:** Week 3 · UI/UX Refinement

### What We Did:
- **Premium Design Overhaul:** Transformed the basic React interface into a high-end dashboard using **Tailwind CSS v4** and **Framer Motion**.
- **Visual Vitality Gauges:** Implemented real-time, animated progress bars for all 7 parameters:
  - **Nutrient Levels:** N (Nitrogen), P (Phosphorus), K (Potassium).
  - **Environmental Factors:** pH Level, Temperature, Humidity, and Rainfall.
- **Advanced Glassmorphism:** Applied translucent card effects with pure CSS radial gradients and dotted patterns (no external images required for performance).
- **Stability Fix:** Resolved a critical Tailwind v4 compiler crash by refactoring arbitrary shadow values into safe theme variables.

## ✅ Step 9 — Secure User Authentication (JWT)
**Date:** 2026-02-22
**Phase:** Week 3 · Security & Personalization

### What We Did:
- **Backend Infrastructure:** Created a `User` model with password hashing (`bcryptjs`) and a `Recommendation` model with user associations.
- **JWT Authorization:** Implemented login/register controllers and an `authMiddleware` to protect API endpoints.
- **Frontend Integration:** 
  - Developed a global `AuthContext` for session management.
  - Built a premium **Login/Signup** interface with Glassmorphism and Framer Motion.
  - Secured the Dashboard and Audit Log so that history is private to each user.
- **End-to-End Verification:** Confirmed that registration, login, and secured data fetching work synchronously across the MERN stack.

## ✅ Step 10 — Real-time Weather Integration
**Date:** 2026-02-22
**Phase:** Week 3 · Data Automation

### What We Did:
- **Backend Weather Proxy:** Implemented a secure `/api/weather` route that proxies requests to OpenWeatherMap, protecting API keys while providing simulated fallbacks.
- **Geolocation Sync:** integrated the browser's Geolocation API on the frontend to fetch precise weather data based on the farmer's current location.
- **Smart Form Auto-fill:** Added a "Sync Live Weather" button that instantly populates:
  - **Temperature (°C)**
  - **Humidity (%)**
  - **Rainfall (mm)**
- **UI Enhancements:** Added an animated sync status button and synchronized the vitality gauges to reflect the new data immediately.

### Next Step:
→ **Scaling & Monitoring:** Monitor the Render deployment and prepare for advanced features like "Farmer Community" or "Market Analysis"!

---

## ✅ Step 11 — Migration to Render & Dockerization
**Date:** 2026-02-23
**Phase:** Deployment & Infrastructure

### What We Did:
- **Platform Migration:** Moved the deployment from Vercel (limited by slug size) to **Render.com** using a unified environment.
- **Containerization:** Created a multi-service `Dockerfile` that installs both Node.js and Python environments.
- **Service Orchestration:** Developed `start.sh` to launch the Node backend and Python ML service simultaneously within a single container.
- **Unified Logic:** Merged ML and Backend logic into a high-performance unified structure for reliable production uptime.

---

## ✅ Step 12 — Post-Deployment Cleanup & Optimization
**Date:** 2026-02-23
**Phase:** Maintenance & Cleanup

### What We Did:
- **Legacy Removal:** Deleted obsolete directories (`ml_service/`, old `server/`) and development scripts (`verify_integration.js`).
- **Platform Cleanup:** Removed Vercel-specific files (`vercel.json`, `.vercelignore`) that were no longer relevant.
- **Configuration Hub:** Moved the `.env` file to the root directory for centralized management.
- **Data Organization:** Relocated `Crop_recommendation.csv` to the `notebooks/` directory to keep the workspace professional and clean.

---

## ✅ Step 13 — Professional Architecture (Client-Server-ML)
**Date:** 2026-02-23
**Phase:** Architectural Refinement

### What We Did:
- **Folder Restructuring:** Transitioned from a generic `api/` folder to a logical **Client-Server-ML** pattern.
  - `client/` — React Frontend.
  - `server/` — Node.js Backend with MongoDB models (`User.js`, `Recommendation.js`).
  - `ml/` — Python Prediction Service and AI Models (`.pkl` files).
- **Internal Path Sync:** Updated `Dockerfile`, `start.sh`, and `index.js` to reflect the new directory structure.
- **Code Portability:** Refactored `ml/app.py` to resolve model paths relative to its new dedicated folder.
- **GitHub Synchronization:** Committed and pushed the final optimized project structure to the remote repository.

## ✅ Step 14 — Fertilizer Optimization Advisory
**Date:** 2026-02-24
**Phase:** Phase 2 · Phase 2.1 · Fertilizer Dosage Optimizer

### What We Did:
- **Reference Data:** Created `server/data/cropRequirements.js` defining optimal NPK levels for 22 crops.
- **Backend Optimization:** Updated the `/api/recommend` route to calculate nutrient deficits (Nitrogen, Phosphorus, Potassium) on-the-fly.
- **Database Update:** Modified the `Recommendation` model to permanently store actionable fertilizer advice.
- **UI Enhancement:** Added a dedicated **Fertilizer Advisory** section to the React dashboard with visual status cards and improvement summaries.
- **Audit Log Sync:** Updated history items to highlight when actionable advice is available.

## ✅ Step 15 — Clean MVC Server Architecture
**Date:** 2026-02-24
**Phase:** Architectural Refinement · Backend

### What We Did:
- **Concerns Separation:** Transitioned `server/index.js` from a monolith to a clean MVC-style architecture.
- **Controllers:** Extracted business logic into `server/controllers/` (Auth, Recommendation, Weather, History).
- **Routers:** Dedicated `server/routes/` for clean URL definitions and middleware mapping.
- **Maintainability:** Streamlined the main entry point to just ~100 lines of configuration and mounting.

---

## ✅ Step 16 — Modular React Client Architecture
**Date:** 2026-02-24
**Phase:** Architectural Refinement · Frontend

### What We Did:
- **Atomic UI Design:** Extracted reusable atoms (`NutrientBar`, `cn` utility) for consistency across the app.
- **Modular Components:** Broke down the massive `App.jsx` into feature-specific components (`SoilForm`, `RecommendationResult`, `HistoryLog`).
- **Page Orchestration:** Created a dedicated `Dashboard.jsx` page to manage state and coordination.
- **Scalable Entry Point:** Refactored `App.jsx` into a lightweight ~20 line router for Auth and Main views.

## ✅ Step 17 — Predictive Yield Engine
**Date:** 2026-02-24
**Phase:** Phase 2 · Phase 2.2 · Yield Prediction Engine

### What We Did:
- **Benchmark Data:** Created `server/data/yieldData.js` with average Tons per Hectare (T/Ha) for 22 crops.
- **Heuristic Engine:** Implemented a nutrient-weighted yield estimator in `recommendController.js`.
- **Dynamic Logic:** The system now adjusts potential yield based on how well the soil's NPK levels match the crop's requirements.
- **UI Integration:** Updated the `RecommendationResult` component to display the "Est. Yield" next to the Irrigation Index.
- **Persistence:** Stored the predicted yield in each recommendation record for historical tracking.

## ✅ Step 18 — Market Analysis & Profitability
**Date:** 2026-02-24
**Phase:** Phase 2 · Phase 2.3 · Market Analysis & Profitability

### What We Did:
- **Price Reference:** Created `server/data/marketPrices.js` with average global prices per ton for 22 crops.
- **Financial Logic:** Updated `recommendController.js` to calculate estimated revenue and simulate market trends.
- **Profit Dashboard:** Enhanced the result UI with "Market Value" and "Profit Potential" cards, featuring interactive trend indicators.
- **Volatility Simulation:** Implemented a randomized trend engine to provide dynamic market insights (Up/Down/Stable).

## ✅ Step 19 — Feature Refinement, Layout & Deployment Success
**Date:** 2026-02-24
**Phase:** Phase 2 · Refinement & Debugging

### What We Did:
- **Persistence Fix**: Updated the Mongoose `Recommendation` model to ensure `yield` and `market` data are permanently stored in MongoDB.
- **Interactive History**: Refactored the `HistoryLog` to be interactive—users can now click any past record to view its full market analysis and fertilizer advisory.
- **Decimal Precision**: Fixed a critical input bug where pH decimals (e.g., 6.2) were stripped to integers. Migrated decimal inputs to a robust regex-validated text system.
- **Layout Overhaul**: Resolved component overlapping by refactoring `RecommendationResult` to a centered, vertical stack layout. This ensures a clean, professional look on all screen resolutions.
- **Production Deployment**: Successfully bypassed Render/Express 5 routing errors by implementing a RegExp-based catch-all (`/.* /`).

### Next Step:
→ **Phase 2.4 Global Accessibility:** Begin implementation of i18next for multi-language support (Hindi, Kannada, etc.) and voice interaction.


## ✅ Step 20 — Advanced Analytics & Visualization
**Date:** 2026-02-25
**Phase:** Phase 3 · Advanced Analytics & Visualization

### What We Did:
- **Visual Intelligence:** Integrated `recharts` to provide data-driven insights.
- **Yield Trend Charts:** Built a dynamic area chart that tracks historical crop yield performance over time.
- **Profit Heatmaps:** Developed a correlations scatter plot showing the relationship between Yield, Revenue, and Profitability.
- **Sector Comparison Engine:** Implemented a side-by-side field comparison tool. Farmers can now select any two history records to compare soil conditions, predicted yields, and financial outcomes.
- **UI Interaction:** Added a "Comparison Hub" to the sidebar and a toggle between "Advisory" and "Analytics" views for a cleaner, professional dashboard experience.

### Next Step:
→ **Phase 4 · Machine Learning Evolution:** Transition from heuristic yield estimation to a dedicated Regression model for higher precision.

## 🗺️ Long-Term Vision & Ecosystem Expansion
Beyond the current Phase 2 advisory features, the project is structured to scale into a holistic farming ecosystem:

### 📊 Phase 3 — Analytics & Insight
- Historical Yield Analysis for data-driven benchmarking.
- Market Volatility simulations for risk management.

### 🔬 Phase 4 — AI & Intelligence Evolution
- Graduating from heuristics to predictive Regression models for yield.
- Integrating Computer Vision (YOLO) for real-time pest/disease identification.

### 🔌 Phase 5 — IoT & Real-World Integration
- Live hardware integration with soil nutrient sensors (IoT).
- Satellite NDVI health indexing for regional farm monitoring.

---

## ✅ Step 21 — Real Yield Regression Model
**Date:** 2026-03-03
**Phase:** Phase 4 · Machine Learning Evolution

### What We Did:
- **Notebook Development:** Created and executed a new Jupyter Notebook (`notebooks/train_yield_model.ipynb`) to train our yield prediction model.
- **Model Training:** Successfully graduated from heuristic yield estimation by training a **Random Forest Regressor** on the synthetic dataset, using 8 features (N, P, K, pH, rainfall, temperature, humidity, and crop type).
- **Evaluation:** Achieved high precision with an R-squared score of 0.9973 and a Root Mean Squared Error (RMSE) of 0.6288 T/Ha.
- **Artifact Generation:** Saved the trained model (`yield_model.pkl`) and label encoder (`yield_label_encoder.pkl`) to the `ml/models/` directory for production deployment.
- **Project Organization:** Removed the deprecated `train_yield_model.py` and consolidated all machine learning experimentation cleanly within the `notebooks` directory.

## ✅ Step 22 — Yield Model Backend Integration
**Date:** 2026-03-03
**Phase:** Phase 4 · Machine Learning Evolution

### What We Did:
- **Python Microservice Update:** Verified that `ml/app.py` exposes a dedicated `/api/predict_yield` POST endpoint. It correctly loads the Random Forest `yield_model.pkl` and its associated `yield_label_encoder.pkl`.
- **Node.js Integration:** Confirmed that `server/controllers/recommendController.js` actively calls the new `/api/predict_yield` endpoint.
- **Dynamic Yield Data:** The MERN backend now fetches live, ML-driven yield predictions based on real-time N, P, K, pH, rainfall, temperature, and humidity inputs, fully replacing the previous static heuristic defaults.
- **End-to-End Verification:** Successfully tested the data flow. The Node API correctly proxies the farmer's soil data to the Python ML server, retrieving an accurate `T/Ha` yield prediction and passing it back to the React frontend.

### Next Step:
→ **Phase 4 Continued:** Explore integrating **LSTM Price Forecasting** for market trends, or **Computer Vision (YOLO)** for Pest/Disease detection as outlined in the roadmap.

---

## ✅ Step 23 — LSTM Price Forecasting Integration
**Date:** 2026-03-03
**Phase:** Phase 4 · Machine Learning Evolution

### What We Did:
- **Notebook Development:** Created and executed `notebooks/train_price_lstm.ipynb` to synthesize 5 years of historical price data for 22 crops and train a Keras LSTM time-series model.
- **Python Scraper:** Built `ml/price_scraper.py` using BeautifulSoup to simulate fetching real-time market prices, with a fallback to static prices.
- **Microservice Update:** Added a new `/api/predict_price_trend` endpoint to `ml/app.py` that combines the live scraped price with historical data sequences to run LSTM inference.
- **Node.js Integration:** Updated `server/controllers/recommendController.js` to call the ML service for price trends instead of relying on random heuristics, storing the actual predicted price and trend.
- **Frontend Update:** Upgraded the React Dashboard's `RecommendationResult` component to display the live price versus the LSTM predicted price, along with the trend analysis.

### Next Step:
→ **Phase 4 Continued:** Explore integrating **Computer Vision (YOLO)** for Pest/Disease detection or move on to **Phase 5 (IoT Integration)**.

---

## ✅ Step 24 — Live Market Dashboard Page
**Date:** 2026-03-03
**Phase:** Phase 4 · User Request Implementation

### What We Did:
- **Python ML Bulk Endpoint:** Added `fetch_all_realtime_prices()` mapping logic to query Data.gov API efficiently without hitting rate limits. Created the GET endpoint `/api/prices/all` in `ml/app.py`.
- **Node Backend Routing:** Created `marketController.js` and `marketRoutes.js` explicitly for securely proxying the Python market endpoints to the React UI.
- **Premium React UX:** Scaled up the global dashboard architecture by adding a cohesive "Live Market" tab alongside Advisory and Analytics.
- **Market Component:** Developed `<MarketPrices />` leveraging pure CSS Glassmorphism, aesthetic grid architecture, and skeleton loaders to fetch UI state seamlessly.

### Next Step:
→ **Phase 4 Continued:** Explore integrating **Computer Vision (YOLO)** for Pest/Disease detection as outlined in the roadmap.

---

## ✅ Step 25 — Premium UI/UX Redesign
**Date:** 2026-03-04
**Phase:** Phase 4 · UI/UX Polish & Design Upgrade

### What We Did:
- **Complete Design System Overhaul (`index.css`):** Rebuilt all CSS design tokens from scratch. Introduced a deeper `#020815` navy base, true glassmorphism (backdrop-filter with saturate), gradient-border card trick (`.glass-premium`), and a richer shadow/glow token set including `--accent-indigo` and `--accent-gold`. Added new animation keyframes: `float`, `pulse-ring`, `pulse-glow`, `bg-shift`, and `gradient-shift`. Added utility classes: `.gradient-text`, `.badge-emerald/indigo/gold`, `.stat-card`, `.divider-gradient`, `.section-label`.
- **Navbar (`Navbar.jsx`):** Premium sidebar with gradient icon logo (glow shadow), initials-based avatar with emerald/indigo radial gradient, active nav item left-bar glow indicator with `layoutId` animated dot, and section labels. Frosted-glass sidebar panel with a glow stripe on the left edge.
- **Auth Page (`AuthPage.jsx`):** Left panel features layered decorative orbs (emerald + indigo + amber), stat chips (22+ Crops / 95% Accuracy / Live Markets), animated feature cards with icon gradient backgrounds and hover lift, and a gradient hero headline. Right panel has a pill-style tab switcher, glassmorphism inputs with icon prefixes, a vibrant gradient submit button, and polished error states.
- **Soil Form (`SoilForm.jsx`):** NPK and environmental fields now rendered as individual elevated cards with focus-activated `borderColor` and `boxShadow` glow. Badge labels ("soil test report", "or use auto-fill") using the new badge system.
- **Recommendation Result (`RecommendationResult.jsx`):** Crop name is now a massive gradient text (`#f0f6ff → #34d399 → #6ee7b7`) with CSS drop-shadow glow. Stat cards have per-card colored glow borders and icon backgrounds. Added a subtle grid-pattern texture overlay for depth.
- **History Log (`HistoryLog.jsx`):** Added a `cropEmojis` map so each crop (rice, wheat, maize, etc.) renders with its emoji. NPK values shown as colored pill badges (blue / green / purple). Selection state has left border glow + box shadow. Better empty state with emoji illustration.
- **Market Prices (`MarketPrices.jsx`):** Price cards now glassmorphism with a per-trend colored left border and background glow. `whileHover={{ y: -3 }}` lift animation. Live dot with pulse-ring in the header. Exchange rate chip.
- **Yield Trend Chart (`YieldTrendChart.jsx`):** Custom `<CustomTooltip>` component with a premium pop-upCard. Active and inactive data dots with stroked borders. Richer area gradient fill with near-zero opacity at the bottom.
- **Dashboard (`Dashboard.jsx`):** Added a time-aware greeting: "Good morning / afternoon / evening, {firstName} 🌅☀️🌙". Cleaner page header layout with unified view config object.

### Tech Highlights:
- All cards use `backdrop-filter: blur(20px) saturate(180%)` for true glassmorphism.
- Emerald + Indigo + Gold three-token accent system for visual hierarchy.
- CSS gradient border technique via pseudo-element `mask` trick (`.glass-premium`).
- `pulse-ring` keyframe wraps the live dot with an expanding glow ring.
- Crop emoji mapping covers all 22 crop classes from the ML model.

