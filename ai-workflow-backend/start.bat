@echo off
echo ========================================
echo   AI Workflow Builder - Start Backend
echo ========================================
echo.

call venv\Scripts\activate.bat
uvicorn app.main:app --reload --port 8000
