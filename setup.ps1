Write-Host "Setting up Planner Application..." -ForegroundColor Green

Write-Host "`nSetting up Backend..." -ForegroundColor Yellow
Set-Location backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Write-Host "Backend setup complete!" -ForegroundColor Green

Write-Host "`nSetting up Frontend..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
Write-Host "Frontend setup complete!" -ForegroundColor Green

Write-Host "`nSetup complete! To run the application:" -ForegroundColor Cyan
Write-Host "1. Start the backend: cd backend && .\venv\Scripts\Activate.ps1 && python app.py" -ForegroundColor White
Write-Host "2. Start the frontend: cd frontend && npm start" -ForegroundColor White
Write-Host "`nThe application will be available at http://localhost:3000" -ForegroundColor Cyan

Read-Host "Press Enter to continue" 