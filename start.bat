@echo off
echo Starting Travel Checklist Application...
echo.
echo This will start both the backend server and frontend application...
cd "Travel Checklist API" && npm run dev:all
echo.
echo Backend will run on http://localhost:3000
echo Frontend will run on http://localhost:3001 