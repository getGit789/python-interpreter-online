from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.main import app

# Create FastAPI application
application = FastAPI()

# Add CORS middleware
application.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include the main app's router
application.include_router(app.router)

# Health check endpoint
@application.get("/health")
def health_check():
    return {"status": "healthy"}

# AWS EB looks for an 'application' callable by default
app = application

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("application:app", host="0.0.0.0", port=8000)