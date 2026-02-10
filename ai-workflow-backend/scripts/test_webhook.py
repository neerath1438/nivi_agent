import requests
import json

url = "http://localhost:8000/api/whatsapp/webhook"
payload = {
    "from": "1234567890@s.whatsapp.net",
    "name": "Test User",
    "content": "Hello from simulation!",
    "timestamp": 123456789
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
