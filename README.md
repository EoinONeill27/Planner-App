# Planner Application

A full-stack planner application built with React frontend and Flask backend.

## Features
- Create, edit, and delete tasks
- Organize tasks by categories
- Set due dates and priorities
- Mark tasks as complete
- Responsive design

## Project Structure
```
planner-app/
├── backend/          # Flask API
├── frontend/         # React application
└── README.md
```

## Setup Instructions

### Backend Setup
1. Navigate to the backend directory
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Run the Flask server: `python app.py`

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## API Endpoints
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<id>` - Update a task
- `DELETE /api/tasks/<id>` - Delete a task 