from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sys
from io import StringIO
import contextlib
import traceback
import builtins

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

# Mock input function that returns predefined values
class MockInput:
    def __init__(self):
        self.default_response = "default_input"
        
    def __call__(self, prompt=""):
        print(prompt, end="")  # Print the prompt
        print(self.default_response)  # Print the simulated input
        return self.default_response

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

        # Create a mock input function
        mock_input = MockInput()
        
        # Set up the execution environment with the mock input
        exec_globals = GLOBAL_NAMESPACE.copy()
        exec_globals['input'] = mock_input
        
        # Capture stdout
        output = StringIO()
        with contextlib.redirect_stdout(output):
            # Execute the code in the global namespace
            exec(compiled_code, exec_globals)
            
        # Update the global namespace with any new definitions
        GLOBAL_NAMESPACE.update(exec_globals)
            
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
