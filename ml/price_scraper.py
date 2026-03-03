import requests
from bs4 import BeautifulSoup
import json
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Fallback static prices from our JS reference, converted to Python dict
STATIC_PRICES = {
    'rice': 450, 'maize': 300, 'chickpea': 800, 'kidneybeans': 1200,
    'pigeonpeas': 900, 'mothbeans': 1100, 'mungbean': 1300, 'blackgram': 1000,
    'lentil': 1100, 'pomegranate': 1500, 'banana': 600, 'mango': 1200,
    'grapes': 2000, 'watermelon': 400, 'muskmelon': 500, 'apple': 1800,
    'orange': 1400, 'papaya': 800, 'coconut': 3500, 'cotton': 1600,
    'jute': 700, 'coffee': 4000
}

# Mapping dataset crops to their exact string in Agmarknet API response
API_CROP_MAP = {
    'rice': 'Paddy(Dhan)(Basmati)',
    'maize': 'Maize',
    'chickpea': 'Bengal Gram(Gram)(Whole)',
    'kidneybeans': 'Rajgir',
    'pigeonpeas': 'Arhar (Tur/Red Gram)(Whole)',
    'mothbeans': 'Moth Dal',
    'mungbean': 'Green Gram (Moong)(Whole)',
    'blackgram': 'Black Gram (Urd Beans)(Whole)',
    'lentil': 'Masur Dal',
    'pomegranate': 'Pomegranate',
    'banana': 'Banana',
    'mango': 'Mango',
    'grapes': 'Grapes',
    'watermelon': 'Water Melon',
    'muskmelon': 'Karbuja(Musk Melon)',
    'apple': 'Apple',
    'orange': 'Orange',
    'papaya': 'Papaya',
    'coconut': 'Coconut',
    'cotton': 'Cotton',
    'jute': 'Jute',
    'coffee': 'Coffee'
}

def fetch_realtime_price(crop_name):
    """
    Fetches the live real-time price for a given crop from Data.gov.in (Agmarknet).
    Converts INR/Quintal to USD/Ton and uses intelligent fallback mechanism.
    """
    crop_name = crop_name.lower()
    base_price = STATIC_PRICES.get(crop_name, 500)
    api_key = os.environ.get('DATA_GOV_API_KEY')
    
    if not api_key:
        print(f"⚠️ DATA_GOV_API_KEY not found. Simulating data for {crop_name}.")
        import random
        fluctuation = random.uniform(-0.02, 0.05)
        return round(base_price * (1 + fluctuation), 2)
        
    try:
        api_crop_name = API_CROP_MAP.get(crop_name)
        if not api_crop_name:
             raise ValueError(f"Crop {crop_name} not properly mapped to API.")

        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&filters[commodity]={api_crop_name}"
        
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get('records') and len(data['records']) > 0:
            # We take the first available modal_price (which is INR per Quintal)
            # Typically these are reported by Mandis daily.
            live_price_inr_quintal = float(data['records'][0]['modal_price'])
            
            # Conversion: 1 Quintal = 0.1 Ton. So 10 Quintals = 1 Ton.
            # E.g., 2000 INR/Quintal => 20,000 INR/Ton
            live_price_inr_ton = live_price_inr_quintal * 10
            
            # Standard USD conversion (Approx 83 INR = 1 USD)
            live_price_usd_ton = live_price_inr_ton / 83.0
            
            print(f"✅ Live API data fetched for {crop_name}: ${live_price_usd_ton:.2f}/Ton")
            return round(live_price_usd_ton, 2)
        else:
            raise ValueError(f"No records returned by API for {api_crop_name} today.")
            
    except Exception as e:
        print(f"⚠️ API Error fetching live price for {crop_name}: {e}. Using fallback simulation.")
        import random
        fluctuation = random.uniform(-0.02, 0.05)
        return round(base_price * (1 + fluctuation), 2)

if __name__ == '__main__':
    # Test the real Data.gov API integration
    print("Testing Live Data.gov.in Price API...")
    print(f"Live Price for Rice: ${fetch_realtime_price('rice')}/Ton")
    print(f"Live Price for Mango: ${fetch_realtime_price('mango')}/Ton")
    print(f"Live Price for Cotton: ${fetch_realtime_price('cotton')}/Ton")
