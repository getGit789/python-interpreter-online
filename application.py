from mangum import Mangum
from backend.app.main import app

# Update the application instance name to match the EB configuration
application = app

# Create handler for AWS Lambda
handler = Mangum(application)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(application, host="0.0.0.0", port=5000)