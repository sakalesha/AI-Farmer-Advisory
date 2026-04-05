# AI Farmer Advisory - Backend & ML Architecture Documentation

This document provides a comprehensive walkthrough of the Backend (Node.js) and Machine Learning (Python) architectures for the AI Farmer Advisory project. It covers all active files, their purposes, and how data moves between the microservices.

---

## 1. Backend Architecture (Node.js / Express / MongoDB)

The backend acts as the central hub, orchestrating client requests, third-party API communications (weather, market), database operations, and calls to the internal ML service.

### 1.1 Entry Point & Configuration
- **`src/app.js`**: The main entry point of the unified Express server.
  - Sets up CORS, JSON parsers, and cookie parsers.
  - Manages the MongoDB connection pool (`mongoose.connect`).
  - Implements basic `/api/health` and `/api/diag` diagnostic routes.
  - Mounts all feature-specific sub-routers (Auth, Recommendations, Weather, History, Market).
  - Serves static assets from the frontend React build.

### 1.2 Controllers (`src/controllers/`)
These contain the core business logic for each route:
- **`authController.js`**: Handles authentication logic. Validates users, hashes credentials, compares passwords using `bcrypt`, and mints JWTs using `jsonwebtoken` stored securely in cookies to manage sessions. Provides endpoints: `register`, `login`, `logout`, and `getMe`.
- **`recommendController.js`**: The most critical orchestrator. 
  - Receives NPK and environmental data from the user.
  - Talks to the Python ML microservice to get crop, yield, and price trend predictions.
  - Derives custom fertilizer requirements by cross-referencing input data with internal static constants.
  - Formats expected revenue (Yield × Price).
  - Saves the resulting `Recommendation` entity to MongoDB.
- **`marketController.js`**: Fetches and aggregates market prices. Connects to `https://api.data.gov.in` to retrieve real-time modal Mandi prices, identifies the top region and the best Mandi, and standardizes conversions to INR/USD via live FrankFurt exchange rates.
- **`weatherController.js`**: Connects to the OpenWeatherMap API using a secure internal API key. Standardizes temperature, humidity, and rainfall arrays, or creates a fallback simulation if the OpenWeather keys are missing.
- **`postController.js`**: Implements the logic for a community environment. Users can `createPost`, `getAllPosts`, and `toggleLike` to engage with other farmers' records or queries.
- **`historyController.js`**: Simple controller that retrieves the top 30 most recent recommendations associated with the current user.

### 1.3 Database Models (`src/models/`)
Mongoose schemas define the NoSQL structure:
- **`User.js`**: Defines standard user credentials. Contains `pre-save` hooks for `bcrypt` password hashing and a method to compare stored passwords asynchronously for authentication.
- **`Recommendation.js`**: Acts as a snapshot of an advisory session. Stores inputs (Nitrogen, Phosphorus, Potassium, weather) and the AI's resulting prediction (proposed crop, calculated yield, potential revenue bounds, fertilizer gap). Linked via `ObjectId` to the `User`.
- **`Post.js`**: Defines community posts. References a `User`, contains text content, an optional reference to a `Recommendation` (so farmers can share their results), and an array of ObjectIds maintaining user `likes`.

### 1.4 Middleware (`src/middleware/`)
- **`authMiddleware.js`**: Validates JWT payloads. Decodes tokens from cookies or Bearer headers. Identifies the user, prevents unauthenticated access, and injects the `req.user` context for dependent controllers.

### 1.5 Routes (`src/routes/`)
- Lightweight express routers defining URLs (`/`, `/:id`) mapping directly to standard Controller actions. (`authRoutes.js`, `historyRoutes.js`, `marketRoutes.js`, `postRoutes.js`, `recommendRoutes.js`, `weatherRoutes.js`).

### 1.6 Data Constants (`src/data/`)
- **`cropRequirements.js`**: Static optimal bounds for Nitrogen, Phosphorus, and Potassium requirements for every crop. Used dynamically to calculate deficiencies in `recommendController.js`.
- **`marketPrices.js`**: General base market values for commodities in case API tracking completely fails.

---

## 2. Machine Learning Architecture (Python / Flask / Scikit-Learn)

The ML service is a lightweight Python Flask microservice (default port 5001) that isolates models from Node.js, ensuring optimized inference and easier data science iteration.

### 2.1 The Inference API (`ml/ml_api.py`)
- The main Flask application that loads cached pre-trained models into process memory during initialization to reduce cold-start latency.
- Loads multiple Models using `joblib` & `tensorflow`: 
  - Crop Classifier `crop_model.pkl`
  - Yield Random Forest Regressor `yield_model.pkl`
  - Deep Learning LSTM `lstm_price_model.h5`
- **`/api/predict`**: Predicts crop type based on NPK and environmental metrics mapping outputs using `label_encoder.pkl`. Predicts generalized irrigation plans.
- **`/api/predict_yield`**: Estimates yield values using an ensemble of trees. Computes lower and upper percentile bounds (p10 and p90) iteratively to provide prediction intervals (ranges).
- **`/api/predict_price_trend`**: Leverages the LSTM architecture with sequences. Ingests a crop string alongside 4 months of historical pricing. Pulls current live pricing via API helpers, and scales sequential structures utilizing a `price_scaler.pkl` to compute Up/Down/Stable market trends.

### 2.2 Automation & Utility Scripts (`ml/src/utils/`)
- **`data_generator.py`**: A complex synthetic data pipeline mimicking real-farm physics. Uses heuristics to introduce realistic noise, NPK penalties, and environmental stress calculations per-crop to assemble comprehensive training sets like `synthetic_yield_data.csv`.
- **`price_scraper.py`**: Interacts tightly with the Data.gov.in Agmarknet API. Transforms commodity requests on the fly (e.g. mapping internal 'chickpea' to exact 'Bengal Gram(Gram)(Whole)'), averages values, finds best Mandis, and converts to predictable Ton metrics. Offers graceful fluctuation fallbacks.

### 2.3 Training & Validation Pipelines (`ml/scripts/`)
- **`train_yield_model.py`**: Typical end-to-end training. Reads offline CSV structures, sets up training/testing splits, employs `RandomForestRegressor`, tests R² metric scores, and commits the output directly to the production `models` directory.
- **`validate_yield_model.py`**: Calculates rigorous MAE/RMSE comparisons over isolated reference variables rather than generalized synthetic ones. Dynamically exports a comprehensive Markdown report validating model stress and distribution issues.
- Other helper scripts (`calibrate_price_scaler.py`, `test_grounded_price.py`, `generate_grounded_data.py`, `source_real_data.py`) manage deep-learning model prep, baseline alignment, and dataset scraping execution pipelines.

## Summary of Data Flow
1. User provides local soil metrics via Frontend.
2. Node.js `recommendController` passes the payload to Python over `HTTP Post`.
3. Python runs random forests & classifications against loaded `pkl` files, and LSTM predictions over scraped `data.gov` points.
4. Python returns precise data arrays to Node.js.
5. Node.js evaluates constraints (uses `cropRequirements` for fertilizer analysis) and commits the unified context to MongoDB.
6. The compiled payload propagates strictly back down to the UI client.
