from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from backend.app.main import app

# Update the application instance name to match the EB configuration
application = app

# Add CORS middleware with specific origins
origins = [
    "https://getgit789.github.io",
    "https://getgit789.github.io/python-interpreter-online/",
    "http://localhost:5000",
    "http://127.0.0.1:5000"
]

application.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

# Create handler for AWS Lambda
handler = Mangum(application)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=80)