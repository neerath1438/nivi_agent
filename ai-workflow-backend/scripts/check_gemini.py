import google.generativeai as genai
print(f"Version: {genai.__version__}")
print(f"Has upload_file: {hasattr(genai, 'upload_file')}")
