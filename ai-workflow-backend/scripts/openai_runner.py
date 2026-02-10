import os
import sys
import subprocess
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

# Load .env from the backend directory
backend_env_path = Path("ai-workflow-backend") / ".env"
load_dotenv(backend_env_path)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_code_from_openai(prompt):
    """Asks OpenAI to generate code based on the prompt."""
    system_prompt = (
        "You are a Python code generator. "
        "Return ONLY the raw Python code without any markdown formatting, "
        "without triple backticks, and without any explanations. "
        "Ensure the code is properly indented and ready to run."
    )
    
    response = client.chat.completions.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0
    )
    
    code = response.choices[0].message.content.strip()
    # Double check to remove markdown backticks if they appear
    if code.startswith("```"):
        code = "\n".join(code.split("\n")[1:-1])
    return code

def run_python_code(code):
    """Saves code to a temporary file and runs it to capture output."""
    temp_file = "temp_generated_code.py"
    try:
        with open(temp_file, "w", encoding="utf-8") as f:
            f.write(code)
        
        result = subprocess.run(
            [sys.executable, temp_file],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            return f"Success!\nOutput:\n{result.stdout}"
        else:
            return f"Code Execution Failed!\nError:\n{result.stderr}"
    except Exception as e:
        return f"An error occurred: {str(e)}"
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)

if __name__ == "__main__":
    test_prompt = "Create a for loop that prints numbers from 1 to 5 with a message 'Iterating node: [number]'"
    print(f"--- Prompting OpenAI ---\nPrompt: {test_prompt}\n")
    
    generated_code = get_code_from_openai(test_prompt)
    print(f"--- Generated Code ---\n{generated_code}\n")
    
    print("--- Executing Code ---")
    output = run_python_code(generated_code)
    print(output)
