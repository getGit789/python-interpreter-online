from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeInput(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"message": "Welcome to Python Interpreter API"}

@app.post("/execute")
def execute_code(payload: CodeInput):
    try:
        result = subprocess.run(
            ["python3", "-c", payload.code],
            capture_output=True,
            text=True,
            timeout=5  # Prevent infinite loops
        )
        return {"output": result.stdout, "error": result.stderr}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=400, detail="Execution timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
