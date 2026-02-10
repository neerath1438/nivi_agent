import os
import sys
import json
from dotenv import load_dotenv
import google.generativeai as genai
from openai import OpenAI

# Add current directory to path
sys.path.append(os.getcwd())

# Load .env from backend directory
env_path = os.path.join(os.getcwd(), 'ai-workflow-backend', '.env')
load_dotenv(env_path)
print(f"Loading env from: {env_path}")

def test_gemini():
    print("\n--- Testing Gemini ---")
    keys = os.getenv("GEMINI_API_KEY", "").split(",")
    if not keys or not keys[0]:
        print("❌ No Gemini API keys found in .env")
        return
    
    for i, key in enumerate(keys):
        key = key.strip()
        if not key: continue
        print(f"Testing Key #{i+1} (ends with {key[-4:]})...")
        try:
            genai.configure(api_key=key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content("Hello, this is a test. Reply with 'OK'.")
            print(f"✅ Success! Response: {response.text}")
            return
        except Exception as e:
            print(f"❌ Failed: {str(e)}")

def test_openai():
    print("\n--- Testing OpenAI ---")
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        print("❌ No OpenAI API key found in .env")
        return
    
    print(f"Testing OpenAI Key (ends with {key[-4:]})...")
    try:
        client = OpenAI(api_key=key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": "Hello, this is a test. Reply with 'OK'."}],
            temperature=0.7,
            max_tokens=10
        )
        print(f"✅ Success! Response: {response.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Failed: {str(e)}")

if __name__ == "__main__":
    test_gemini()
    test_openai()
