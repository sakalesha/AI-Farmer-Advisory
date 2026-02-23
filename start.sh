#!/bin/bash

# Start Python ML service in the background
echo "🌱 Starting Python ML service..."
python3 api/predict.py &

# Start Node.js API server in the foreground
echo "🚀 Starting Node.js Unified Server..."
node api/index.js
