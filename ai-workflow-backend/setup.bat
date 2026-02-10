@echo off
echo ========================================
echo   AI Workflow Builder - Backend Setup
echo ========================================
echo.

echo Step 1: Creating virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo ERROR: Failed to create virtual environment
    pause
    exit /b 1
)
echo ✓ Virtual environment created

echo.
echo Step 2: Activating virtual environment...
call venv\Scripts\activate.bat
echo ✓ Virtual environment activated

echo.
echo Step 3: Installing dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo Step 4: Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo ✓ .env file created (please edit with your settings)
) else (
    echo ✓ .env file already exists
)

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create PostgreSQL database: ai_workflow
echo 2. Edit .env file with your settings
echo 3. Run: uvicorn app.main:app --reload --port 8000
echo.
pause
