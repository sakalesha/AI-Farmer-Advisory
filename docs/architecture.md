# AI Farmer Advisory Architecture

This document outlines the high-level architecture of the AI Farmer Advisory platform.

## Architecture Overview

The platform uses a unified 3-tier architecture within a **Monorepo** structure:
1. **Frontend**: React-based client-side application located in `frontend/`.
2. **Backend**: Node.js/Express server providing REST APIs and **Community Services** in `backend/`.
3. **Machine Learning**: Python-based prediction models and ML services located in `ml/`.

All services are orchestrated via a root `package.json` for concurrent development and consistent environment management.

## Grounded AI Engine

The platform has transitioned from a synthetic-data prototype to a **Grounded Production Engine**:
- **Yield Accuracy**: Retrained on 12,000 real-world records (ICRISAT/Mendeley) to ensure biological realism (e.g., Rice yielding ~4 T/Ha, not 30).
- **Financial Realism**: Grounded in 2024 Indian Mandi (Agmarknet) and MSP benchmarks.

## Predictive Transparency (Uncertainty)

To provide farmers with trustworthy advice, we implement **Model Confidence Ranges**:
- **Ensemble Variance**: Instead of a single-point estimate, we collect predictions from 100 individual trees in the Random Forest ensemble.
- **Intervals**: Return the 10th and 90th percentiles to show the potential "Worst-Case" and "Best-Case" yield outcomes.

## Community Hub (New)

The architecture now includes a **Social Service Layer** within the Backend:
- **Knowledge Sharing**: Farmers can post AI recommendations to a public feed.
- **Multi-lingual Support**: All social interactions are localized using `i18next` for English, Hindi, and Kannada.

This setup ensures a clear separation of concerns among the user interface, business logic/data persistence, and machine learning inferences.
