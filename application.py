from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.main import app

# Update the application instance name to match the EB configuration
application = app

# Add CORS middleware
application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=8000)