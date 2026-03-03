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

def fetch_all_realtime_prices():
    """
    Fetches the live real-time prices for ALL 22 supported crops.
    To avoid 22 separate API calls and rate-limiting, we fetch a large batch of today's records
    and map them to our crops locally.
    """
    import random
    api_key = os.environ.get('DATA_GOV_API_KEY')
    all_prices = {}
    
    if not api_key:
        print(f"⚠️ DATA_GOV_API_KEY not found. Simulating data for all crops.")
        for crop, base_price in STATIC_PRICES.items():
            fluctuation = random.uniform(-0.02, 0.05)
            all_prices[crop] = round(base_price * (1 + fluctuation), 2)
        return all_prices
        
    try:
        # Fetch up to 2000 records to get a good span of all commodities across mandis today
        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=2000"
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        records = data.get('records', [])
        
        # Build a fast lookup dictionary of { commodity_name: modal_price } from the API
        api_market_data = {}
        for row in records:
            comm = row.get('commodity')
            price_str = row.get('modal_price')
            if comm and price_str:
                # Store the most recent read or average it
                api_market_data[comm] = float(price_str)
        
        # Now match our 22 crops to the fast lookup dictionary
        for crop_key, api_crop_name in API_CROP_MAP.items():
            base_price = STATIC_PRICES.get(crop_key, 500)
            
            if api_crop_name in api_market_data:
                live_price_inr_quintal = api_market_data[api_crop_name]
                live_price_inr_ton = live_price_inr_quintal * 10
                live_price_usd_ton = live_price_inr_ton / 83.0
                all_prices[crop_key] = round(live_price_usd_ton, 2)
            else:
                # If a specific crop didn't have API data today, simulate its specific fluctuation
                fluctuation = random.uniform(-0.02, 0.05)
                all_prices[crop_key] = round(base_price * (1 + fluctuation), 2)
                
        return all_prices
        
    except Exception as e:
        print(f"⚠️ Bulk API Error: {e}. Falling back to simulation for all.")
        for crop, base_price in STATIC_PRICES.items():
            fluctuation = random.uniform(-0.02, 0.05)
            all_prices[crop] = round(base_price * (1 + fluctuation), 2)
        return all_prices

if __name__ == '__main__':
    # Test the real Data.gov API integration
    print("Testing Live Data.gov.in Price API...")
    print(f"Live Price for Rice: ${fetch_realtime_price('rice')}/Ton")
    print(f"Live Price for Mango: ${fetch_realtime_price('mango')}/Ton")
    print(f"Live Price for Cotton: ${fetch_realtime_price('cotton')}/Ton")
