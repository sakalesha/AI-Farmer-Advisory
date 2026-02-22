from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# --- Load Models & Transformers ---
# Get the directory of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.pkl')

# Load them at start to avoid latency
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ Model and transformers loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# --- Irrigation Logic ---
def get_irrigation_level(rainfall, humidity):
    if rainfall < 60:
        return 'High'
    elif humidity > 70:
        return 'Low'
    else:
        return 'Medium'

# --- Routes ---
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Structure the input for prediction
        input_data = [
            data['N'], data['P'], data['K'], 
            data['temperature'], data['humidity'], 
            data['ph'], data['rainfall']
        ]
        
        # Preprocess
        input_array = np.array([input_data])
        scaled_input = scaler.transform(input_array)
        
        # Predict
        prediction_encoded = model.predict(scaled_input)
        crop_name = label_encoder.inverse_transform(prediction_encoded)[0]
        
        # Irrigation suggestion
        irrigation = get_irrigation_level(data['rainfall'], data['humidity'])
        
        # Return result
        return jsonify({
            'status': 'success',
            'crop': crop_name,
            'irrigation': irrigation
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'service': 'ml-prediction'})

if __name__ == '__main__':
    # Use environment port for cloud deployment, default to 5001 for local
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port)
