from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sys
from io import StringIO
import contextlib
import traceback

app = FastAPI()

# Configure CORS with all possible frontend URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://getgit789.github.io",
        "https://getgit789.github.io/python-interpreter-online/",
        "http://localhost:5000",
        "http://127.0.0.1:5000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Global namespace for code execution
GLOBAL_NAMESPACE = {}

class CodeRequest(BaseModel):
    code: str

@app.get("/")
async def read_root():
    return {"message": "API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/execute")
async def execute_code(request: CodeRequest):
    try:
        # First try to compile the code to catch syntax errors
        try:
            compiled_code = compile(request.code, '<string>', 'exec')
        except SyntaxError as e:
            return JSONResponse(
                status_code=400,
                content={"error": str(e)},
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "*"
                }
            )

        # Capture stdout
        output = StringIO()
        with contextlib.redirect_stdout(output):
            # Execute the code in the global namespace
            exec(compiled_code, GLOBAL_NAMESPACE)
            
        return JSONResponse(
            content={"output": output.getvalue()},
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
    except Exception as e:
        error_details = {
            "error": str(e),
            "type": e.__class__.__name__
        }
        return JSONResponse(
            status_code=400,
            content=error_details,
            headers={
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "*"
            }
        )
