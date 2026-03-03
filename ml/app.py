from flask import Flask, request, jsonify
import joblib
import numpy as np
import os

app = Flask(__name__)

# --- Load Models & Transformers ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'models', 'crop_model.pkl')
SCALER_PATH = os.path.join(BASE_DIR, 'models', 'scaler.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'label_encoder.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ Original models loaded in Vercel function")
    
    YIELD_MODEL_PATH = os.path.join(BASE_DIR, 'models', 'yield_model.pkl')
    YIELD_ENCODER_PATH = os.path.join(BASE_DIR, 'models', 'yield_label_encoder.pkl')
    
    yield_model = joblib.load(YIELD_MODEL_PATH)
    yield_label_encoder = joblib.load(YIELD_ENCODER_PATH)
    print("✅ Yield models loaded successfully")
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

@app.route('/api/predict_yield', methods=['POST'])
def predict_yield():
    try:
        data = request.json
        crop_name = data['crop'].capitalize() # Ensure format matches training data
        
        # Encode crop name
        crop_encoded = yield_label_encoder.transform([crop_name])[0]
        
        # Prepare input array (order must match training layout: crop_encoded, N, P, K, temp, humidity, ph, rainfall)
        input_data = [
            crop_encoded,
            data['N'], data['P'], data['K'], 
            data['temperature'], data['humidity'], 
            data['ph'], data['rainfall']
        ]
        
        input_array = np.array([input_data])
        
        # Predict yield
        predicted_yield = yield_model.predict(input_array)[0]
        
        return jsonify({
            'status': 'success',
            'yield': round(predicted_yield, 2)
        })

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 400

# For Render, run as a standalone server
if __name__ == '__main__':
    port = int(os.environ.get("ML_SERVICE_PORT", 5001))
    print(f"🚀 Python ML service starting on port {port}...")
    app.run(host='0.0.0.0', port=port)
