# Online Python Interpreter

A web-based Python interpreter that allows users to write, execute, and share Python code in a secure and scalable environment.

## Features
- In-browser code editor with syntax highlighting (Monaco Editor)
- Secure Python code execution
- Real-time output display

## Tech Stack
- Frontend: Simple HTML/JS with Monaco Editor
- Backend: FastAPI
- Code Execution: Python subprocess with timeout

## Setup Instructions

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn app.main:app --reload --port 8002`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and navigate to: `http://localhost:3002/`

The frontend uses a simple custom Node.js server to serve the application with Monaco Editor for code editing.
