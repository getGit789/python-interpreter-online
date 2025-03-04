from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
from io import StringIO
import contextlib

app = FastAPI()

# Configure CORS with more permissive settings for debugging
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://getgit789.github.io", "http://localhost:3002", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

class CodeRequest(BaseModel):
    code: str

@app.post("/execute")
async def execute_code(request: CodeRequest):
    try:
        # Capture stdout
        output = StringIO()
        with contextlib.redirect_stdout(output):
            exec(request.code)
        return {"output": output.getvalue()}
    except Exception as e:
        return {"error": str(e)}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
