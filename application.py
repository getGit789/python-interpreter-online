import uvicorn
from backend.app.main import app as application

if __name__ == "__main__":
    uvicorn.run(application, host="0.0.0.0", port=8002) 