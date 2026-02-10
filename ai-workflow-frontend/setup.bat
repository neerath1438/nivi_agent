@echo off
echo ========================================
echo   AI Workflow Builder - Frontend Setup
echo ========================================
echo.

echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo Run: npm run dev
echo.
pause
