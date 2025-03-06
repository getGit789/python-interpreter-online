from fastapi import FastAPI
from mangum import Mangum
from backend.app.main import app

# Update the application instance name to match the EB configuration
application = app

# Add CORS middleware
from fastapi.middleware.cors import CORSMiddleware
application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create handler for AWS Lambda
handler = Mangum(application)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=5000)