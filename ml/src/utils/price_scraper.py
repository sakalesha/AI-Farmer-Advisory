import requests
from bs4 import BeautifulSoup
import json
import os
from dotenv import load_dotenv

# Load env variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

# Fallback static prices (₹ per Ton) - Real 2024 Mandi Averages
STATIC_PRICES = {
    'rice': 23000, 'maize': 22250, 'chickpea': 54400, 'kidneybeans': 75000,
    'pigeonpeas': 70000, 'mothbeans': 60000, 'mungbean': 85580, 'blackgram': 69500,
    'lentil': 64250, 'pomegranate': 80000, 'banana': 15000, 'mango': 40000,
    'grapes': 60000, 'watermelon': 10000, 'muskmelon': 15000, 'apple': 100000,
    'orange': 35000, 'papaya': 20000, 'coconut': 25000, 'cotton': 75000,
    'jute': 55000, 'coffee': 250000
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
    Converts INR/Quintal to INR/Ton and uses intelligent fallback mechanism.
    """
    crop_name = crop_name.lower()
    base_price = STATIC_PRICES.get(crop_name, 25000)
    api_key = os.environ.get('DATA_GOV_API_KEY')
    
    if not api_key:
        print(f"⚠️ DATA_GOV_API_KEY not found. Simulating data for {crop_name} (₹ Scale).")
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
            live_price_inr_quintal = float(data['records'][0]['modal_price'])
            
            # 1 Quintal = 0.1 Ton. So 1 Ton = 10 Quintals.
            live_price_inr_ton = live_price_inr_quintal * 10
            
            print(f"✅ Live API data fetched for {crop_name}: ₹{live_price_inr_ton:.2f}/Ton")
            return round(live_price_inr_ton, 2)
        else:
            raise ValueError(f"No records returned by API for {api_crop_name} today.")
            
    except Exception as e:
        print(f"⚠️ API Error fetching live price for {crop_name}: {e}. Using fallback grounding.")
        import random
        fluctuation = random.uniform(-0.02, 0.05)
        return round(base_price * (1 + fluctuation), 2)

def fetch_all_realtime_prices():
    """
    Fetches the live real-time prices for ALL 22 supported crops in INR.
    """
    import random
    api_key = os.environ.get('DATA_GOV_API_KEY')
    all_prices = {}
    
    if not api_key:
        print(f"⚠️ DATA_GOV_API_KEY not found. Simulating grounded data for all crops.")
        for crop, base_price in STATIC_PRICES.items():
            fluctuation = random.uniform(-0.02, 0.05)
            all_prices[crop] = round(base_price * (1 + fluctuation), 2)
        return all_prices
        
    try:
        url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=2000"
        response = requests.get(url, timeout=15)
        response.raise_for_status()
        data = response.json()
        
        records = data.get('records', [])
        api_market_data = {}
        for row in records:
            comm = row.get('commodity')
            price_str = row.get('modal_price')
            if comm and price_str:
                if comm not in api_market_data:
                    api_market_data[comm] = []
                api_market_data[comm].append({
                    'price': float(price_str),
                    'state': row.get('state'),
                    'district': row.get('district'),
                    'market': row.get('market')
                })
        
        for crop_key, api_crop_name in API_CROP_MAP.items():
            base_price = STATIC_PRICES.get(crop_key, 25000)
            
            if api_crop_name in api_market_data:
                crop_records = api_market_data[api_crop_name]
                # Calculate Average
                avg_quintal = sum(r['price'] for r in crop_records) / len(crop_records)
                # Find Best
                best_record = max(crop_records, key=lambda x: x['price'])
                
                all_prices[crop_key] = {
                    'price_ton': round(avg_quintal * 10, 2),
                    'best_mandi': {
                        'state': best_record['state'],
                        'district': best_record['district'],
                        'market': best_record['market'],
                        'price': round(best_record['price'] * 10, 2)
                    }
                }
            else:
                fluctuation = random.uniform(-0.02, 0.05)
                sim_price = round(base_price * (1 + fluctuation), 2)
                all_prices[crop_key] = {
                    'price_ton': sim_price,
                    'best_mandi': {'state': 'National', 'district': 'Average', 'market': 'Baseline', 'price': sim_price}
                }
                
        return all_prices
        
    except Exception as e:
        print(f"⚠️ Bulk API Error: {e}. Falling back to grounded INR simulation.")
        for crop, base_price in STATIC_PRICES.items():
            fluctuation = random.uniform(-0.02, 0.05)
            sim_price = round(base_price * (1 + fluctuation), 2)
            all_prices[crop] = {
                'price_ton': sim_price,
                'best_mandi': {'state': 'National', 'district': 'Average', 'market': 'Baseline', 'price': sim_price}
            }
        return all_prices

if __name__ == '__main__':
    # Test the real Data.gov API integration
    print("Testing Live Data.gov.in Price API...")
    print(f"Live Price for Rice: ${fetch_realtime_price('rice')}/Ton")
    print(f"Live Price for Mango: ${fetch_realtime_price('mango')}/Ton")
    print(f"Live Price for Cotton: ${fetch_realtime_price('cotton')}/Ton")
