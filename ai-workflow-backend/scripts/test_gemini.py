import google.generativeai as genai

api_key = "AIzaSyCxUbkwnNvQv1fi6lZqx8lHErMzmAHllkI"
genai.configure(api_key=api_key)

with open('c:/Users/Admin/Agemt-chatbot/Agemt-chatbot/gemini_output.txt', 'a', encoding='utf-8') as f:
    models_to_test = ['gemini-2.0-flash', 'gemini-2.5-flash']
    
    for m_name in models_to_test:
        f.write(f"--- Testing {m_name} ---\n")
        try:
            model = genai.GenerativeModel(m_name)
            response = model.generate_content("Hi")
            f.write(f"SUCCESS {m_name}: {response.text[:100]}\n")
        except Exception as e:
            f.write(f"FAILED {m_name}: {str(e)}\n")

print("Done. Results appended to gemini_output.txt")
