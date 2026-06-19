@echo off
cls
echo ========================================
echo   Starting Local Server...
echo ========================================
echo.
echo Server will start at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
npx http-server -p 8000 -o
pause
