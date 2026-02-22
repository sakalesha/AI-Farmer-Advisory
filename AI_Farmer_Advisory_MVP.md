# 🌱 AI Farmer Advisory -- MVP Plan

## 🎯 MVP Goal

Build a web app where a farmer enters:

-   Soil N, P, K\
-   pH value\
-   Temperature\
-   Humidity\
-   Rainfall

And the system outputs:

-   ✅ Best crop to grow\
-   ✅ Basic irrigation recommendation (Low / Medium / High water need)

Simple. Clear. Powerful.

------------------------------------------------------------------------

# 🏗 MVP Architecture

### Flow:

Farmer Input → Backend API → ML Model → Prediction → Result Display

------------------------------------------------------------------------

# 🧠 MVP Models

## 1️⃣ Crop Recommendation (Main Feature)

**Type:** Classification

**Suggested Algorithms:** - Random Forest (easy & accurate)\
- Decision Tree (simple & explainable)

**Input Features:** - N, P, K\
- pH\
- Rainfall\
- Temperature\
- Humidity

**Output:** - Crop name (Rice, Wheat, Cotton, Maize, etc.)

**Dataset:** - Kaggle Crop Recommendation Dataset

------------------------------------------------------------------------

## 2️⃣ Basic Irrigation Suggestion

**Approach 1: Rule-Based Logic** - If rainfall \< threshold → High
irrigation\
- If humidity high → Low irrigation\
- Else → Medium irrigation

**Approach 2: ML Regression** - Train simple regression model to
estimate water requirement.

------------------------------------------------------------------------

# 💻 Tech Stack for MVP

- **ML Processing:** Python + Flask (as a microservice)
- **Frontend:** React.js (MERN)
- **Backend API:** Node.js + Express.js (MERN)
- **Database:** MongoDB (MERN - for storing farming logs/history)
- **Styling:** Tailwind CSS

------------------------------------------------------------------------

# 📦 MVP Deliverables

You should be able to show:

1.  Working web app\
2.  Trained ML model\
3.  Accuracy score\
4.  Confusion matrix\
5.  Sample farmer use case demo

------------------------------------------------------------------------

# ⏳ Timeline

**Week 1:** - Dataset cleaning\
- Model training\
- Model evaluation

**Week 2:** - Build backend API\
- Connect model

**Week 3:** - Build frontend\
- Deploy

------------------------------------------------------------------------

# ❌ What NOT to Add in MVP

Avoid these for now:

-   IoT sensors\
-   Satellite imagery\
-   LSTM rainfall prediction\
-   Real-time weather APIs\
-   Mobile app\
-   Voice support

These can be added in Phase 2.

------------------------------------------------------------------------

# 🚀 Phase 2 Enhancements

-   Weather API integration\
-   Yield prediction\
-   Fertilizer optimization\
-   Regional crop database\
-   Offline-first mobile version

------------------------------------------------------------------------

# 🎓 Why This MVP is Smart

-   Easy to explain in viva\
-   Demonstrates Machine Learning clearly\
-   Real-world impact\
-   Extendable architecture\
-   Technically manageable for undergraduate level
