@echo off
echo Setting up Planner Application...

echo.
echo Setting up Backend...
cd backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
echo Backend setup complete!

echo.
echo Setting up Frontend...
cd ..\frontend
npm install
echo Frontend setup complete!

echo.
echo Setup complete! To run the application:
echo 1. Start the backend: cd backend && venv\Scripts\activate && python app.py
echo 2. Start the frontend: cd frontend && npm start
echo.
echo The application will be available at http://localhost:3000
pause 