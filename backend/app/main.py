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

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/execute")
def execute_code(payload: CodeInput):
    try:
        # Create a temporary file to execute the code
        with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as f:
            # Add input handling wrapper
            input_wrapper = """# Override input function to handle web-based input
def custom_input(prompt=''):
    print(f"[INPUT REQUESTED]: {prompt}")
    return "default_input_value"

# Replace built-in input function
input = custom_input

"""
            
            # Write the input wrapper and the user's code
            f.write(input_wrapper + payload.code)
            temp_file_name = f.name
        
        try:
            # Run the code with proper error handling
            result = subprocess.run(
                ["python3", temp_file_name],
                capture_output=True,
                text=True,
                timeout=5  # Prevent infinite loops
            )
            
            # Return both stdout and stderr
            return {
                "output": result.stdout,
                "error": result.stderr,
                "exit_code": result.returncode
            }
            
        except subprocess.TimeoutExpired:
            return {
                "output": "",
                "error": "Execution timed out after 5 seconds. Your code might contain an infinite loop.",
                "exit_code": 124
            }
        except Exception as e:
            return {
                "output": "",
                "error": f"Execution error: {str(e)}",
                "exit_code": 1
            }
        finally:
            # Clean up the temporary file
            if os.path.exists(temp_file_name):
                os.unlink(temp_file_name)
                
    except Exception as e:
        return {
            "output": "",
            "error": f"Server error: {str(e)}",
            "exit_code": 1
        }
