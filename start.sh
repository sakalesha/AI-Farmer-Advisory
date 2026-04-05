#!/bin/bash

# Start Python ML service in the background
echo "🌱 Starting Python ML service on port ${ML_SERVICE_PORT:-5001}..."
python3 ml/ml_api.py &

# Wait a few seconds for Python to bind
sleep 3

# Start Node.js API server in the foreground
echo "🚀 Starting Node.js Unified Server on port ${PORT:-5000}..."
node backend/src/app.js
