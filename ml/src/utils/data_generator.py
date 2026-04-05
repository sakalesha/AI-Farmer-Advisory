import pandas as pd
import numpy as np
import random
import os

# Set seed for reproducibility
np.random.seed(42)
random.seed(42)

# Data collected from Node.js heuristic logic
crop_requirements = {
    'rice': {'N': 80, 'P': 40, 'K': 40, 'base_yield': 4.0},
    'maize': {'N': 100, 'P': 50, 'K': 50, 'base_yield': 3.5},
    'chickpea': {'N': 40, 'P': 60, 'K': 80, 'base_yield': 1.5},
    'kidneybeans': {'N': 30, 'P': 50, 'K': 30, 'base_yield': 1.2},
    'pigeonpeas': {'N': 25, 'P': 50, 'K': 25, 'base_yield': 1.0},
    'mothbeans': {'N': 20, 'P': 40, 'K': 20, 'base_yield': 0.8},
    'mungbean': {'N': 20, 'P': 40, 'K': 20, 'base_yield': 0.9},
    'blackgram': {'N': 25, 'P': 50, 'K': 25, 'base_yield': 0.9},
    'lentil': {'N': 25, 'P': 50, 'K': 25, 'base_yield': 1.1},
    'pomegranate': {'N': 100, 'P': 50, 'K': 50, 'base_yield': 15.0},
    'banana': {'N': 120, 'P': 80, 'K': 100, 'base_yield': 40.0},
    'mango': {'N': 100, 'P': 50, 'K': 100, 'base_yield': 10.0},
    'grapes': {'N': 100, 'P': 50, 'K': 120, 'base_yield': 25.0},
    'watermelon': {'N': 100, 'P': 50, 'K': 80, 'base_yield': 30.0},
    'muskmelon': {'N': 100, 'P': 50, 'K': 80, 'base_yield': 25.0},
    'apple': {'N': 120, 'P': 60, 'K': 120, 'base_yield': 12.0},
    'orange': {'N': 120, 'P': 60, 'K': 120, 'base_yield': 18.0},
    'papaya': {'N': 140, 'P': 80, 'K': 140, 'base_yield': 45.0},
    'coconut': {'N': 140, 'P': 100, 'K': 160, 'base_yield': 12.0},
    'cotton': {'N': 120, 'P': 60, 'K': 60, 'base_yield': 0.8},
    'jute': {'N': 80, 'P': 40, 'K': 80, 'base_yield': 2.8},
    'coffee': {'N': 140, 'P': 60, 'K': 140, 'base_yield': 1.0}
}

# General optimal ranges for other features (Temp, Humidity, pH, Rainfall)
# Derived from Kaggle Crop Recommendation dataset norms
env_requirements = {
    'rice':        {'temp': 24, 'hum': 82, 'ph': 6.5, 'rain': 236},
    'maize':       {'temp': 23, 'hum': 65, 'ph': 6.5, 'rain': 85},
    'chickpea':    {'temp': 19, 'hum': 17, 'ph': 7.5, 'rain': 80},
    'kidneybeans': {'temp': 20, 'hum': 22, 'ph': 5.8, 'rain': 106},
    'pigeonpeas':  {'temp': 28, 'hum': 48, 'ph': 5.7, 'rain': 150},
    'mothbeans':   {'temp': 28, 'hum': 53, 'ph': 6.8, 'rain': 51},
    'mungbean':    {'temp': 28, 'hum': 85, 'ph': 6.9, 'rain': 49},
    'blackgram':   {'temp': 30, 'hum': 65, 'ph': 7.2, 'rain': 68},
    'lentil':      {'temp': 25, 'hum': 65, 'ph': 6.9, 'rain': 45},
    'pomegranate': {'temp': 22, 'hum': 90, 'ph': 6.4, 'rain': 108},
    'banana':      {'temp': 27, 'hum': 80, 'ph': 6.0, 'rain': 105},
    'mango':       {'temp': 31, 'hum': 50, 'ph': 5.8, 'rain': 95},
    'grapes':      {'temp': 23, 'hum': 82, 'ph': 6.0, 'rain': 70},
    'watermelon':  {'temp': 25, 'hum': 85, 'ph': 6.5, 'rain': 50},
    'muskmelon':   {'temp': 29, 'hum': 92, 'ph': 6.3, 'rain': 24},
    'apple':       {'temp': 22, 'hum': 92, 'ph': 5.9, 'rain': 112},
    'orange':      {'temp': 23, 'hum': 92, 'ph': 7.0, 'rain': 110},
    'papaya':      {'temp': 34, 'hum': 92, 'ph': 6.7, 'rain': 142},
    'coconut':     {'temp': 27, 'hum': 95, 'ph': 6.0, 'rain': 175},
    'cotton':      {'temp': 24, 'hum': 80, 'ph': 6.9, 'rain': 80},
    'jute':        {'temp': 25, 'hum': 80, 'ph': 6.7, 'rain': 175},
    'coffee':      {'temp': 26, 'hum': 58, 'ph': 6.8, 'rain': 158}
}

SAMPLES_PER_CROP = 500
data = []

for crop, npk in crop_requirements.items():
    env = env_requirements[crop]
    base_yield = npk['base_yield']

    for _ in range(SAMPLES_PER_CROP):
        # 1. Generate inputs with realistic variance
        # Nutrition can be deficient (-50%) or surplus (+20%)
        n_factor = random.uniform(0.5, 1.2)
        p_factor = random.uniform(0.5, 1.2)
        k_factor = random.uniform(0.5, 1.2)

        N = max(0, int(npk['N'] * n_factor))
        P = max(0, int(npk['P'] * p_factor))
        K = max(0, int(npk['K'] * k_factor))

        # Env variables can vary by +/- 20%
        temp_factor = random.uniform(0.8, 1.2)
        hum_factor = random.uniform(0.8, 1.2)
        rain_factor = random.uniform(0.8, 1.2)
        ph_factor = random.uniform(0.85, 1.15) # pH is less volatile

        temp = round(env['temp'] * temp_factor, 1)
        hum = round(env['hum'] * hum_factor, 1)
        ph = round(env['ph'] * ph_factor, 2)
        rain = round(env['rain'] * rain_factor, 1)

        # 2. Compute Yield Penalty based on Node.js heuristic + New factors
        
        # NPK Penalty: Diminishing returns over 1.0, linear drop below 1.0
        n_score = min(N / npk['N'], 1.1)
        p_score = min(P / npk['P'], 1.1)
        k_score = min(K / npk['K'], 1.1)
        nutrient_score = (n_score + p_score + k_score) / 3

        # Environment Penalty: How far from optimal?
        temp_err = abs(1.0 - temp_factor) # e.g. 0.1 off
        hum_err = abs(1.0 - hum_factor)
        rain_err = abs(1.0 - rain_factor)
        ph_err = abs(1.0 - ph_factor)

        # Environment total error (max ~0.8)
        env_error = (temp_err + hum_err + rain_err + ph_err) / 4

        # Environmental score (1.0 is perfect, lowers linearly with error)
        env_score = max(0.4, 1.0 - (env_error * 2))

        # Base yield modified by nutrition (70% base guaranteed + 30% nutrition weight) 
        # *multiplied* by environmental score
        # Adding a bit of random noise (+/- 5%) for ML realism
        
        noise = random.uniform(0.95, 1.05)
        
        # Modified heuristic: 50% base, 30% nutrients, 20% environment
        calculated_yield = base_yield * (0.5 + (0.3 * nutrient_score) + (0.2 * env_score)) * noise

        data.append({
            'crop': crop.capitalize(), # Capitalize for consistency
            'N': N,
            'P': P,
            'K': K,
            'temperature': temp,
            'humidity': hum,
            'ph': ph,
            'rainfall': rain,
            'yield': round(calculated_yield, 2)
        })

df = pd.DataFrame(data)

# Ensure directory exists
os.makedirs('data', exist_ok=True)
df.to_csv('data/synthetic_yield_data.csv', index=False)

print(f"✅ Generated {len(df)} rows of synthetic yield data at ml/data/synthetic_yield_data.csv")
