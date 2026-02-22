from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# --- Load Models & Transformers ---
# On Vercel, paths are relative to the function
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ Models loaded in Vercel function")
except Exception as e:
    print(f"❌ Error loading model: {e}")

def get_irrigation_level(rainfall, humidity):
    if rainfall < 60: return 'High'
    elif humidity > 70: return 'Low'
    else: return 'Medium'

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        input_data = [
            data['N'], data['P'], data['K'], 
            data['temperature'], data['humidity'], 
            data['ph'], data['rainfall']
        ]
        
        input_array = np.array([input_data])
        scaled_input = scaler.transform(input_array)
        
        prediction_encoded = model.predict(scaled_input)
        crop_name = label_encoder.inverse_transform(prediction_encoded)[0]
        
        irrigation = get_irrigation_level(data['rainfall'], data['humidity'])
        
        return jsonify({
            'status': 'success',
            'crop': crop_name,
            'irrigation': irrigation
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# For Vercel, the app instance is what matters
if __name__ == '__main__':
    app.run()
