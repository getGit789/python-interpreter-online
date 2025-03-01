// This is a production version of script.js with the API_URL set to the Render backend
// Copy the contents of this file to script.js before deploying to GitHub Pages

// Initialize variables
let editor;
let runButton;
let clearButton;
let copyButton;
let shareButton;
let shareContainer;
let shareUrlInput;
let copyShareUrlButton;
let closeShareButton;
let exampleSelect;
let output;
let executionStatus;
let statusMessage;

// API endpoint configuration
const API_URL = 'https://python-interpreter-api.onrender.com'; // Production Render backend URL

// Code examples
const codeExamples = {
    hello: '# Hello World Example\nprint("Hello, World!")',
    error: '# Error Handling Example\n\ntry:\n    # Division by zero error\n    result = 10 / 0\n    print("This won\'t be printed")\nexcept ZeroDivisionError as e:\n    print(f"Caught an error: {e}")\n\ntry:\n    # Index error\n    my_list = [1, 2, 3]\n    print(my_list[10])\nexcept IndexError as e:\n    print(f"Caught an index error: {e}")\n\n# Syntax error example (commented out)\n# print("Missing closing parenthesis")',
    loop: '# Performance Test Example\n\n# Fibonacci sequence calculation\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 Fibonacci numbers\nfor i in range(10):\n    result = fibonacci(i)\n    print(f"fibonacci({i}) = {result}")\n\n# Loop example\nprint("\nCounting from 1 to 1000 by 100s:")\nfor i in range(1, 1001, 100):\n    print(i)',
    input: '# Input Handling Example\n\n# Method 1: Using variables to simulate input\n# Simulated user input\nuser_name = "John"  # Normally would be: input("Enter your name: ")\nuser_age = 25      # Normally would be: int(input("Enter your age: "))\n\nprint(f"Hello, {user_name}! You are {user_age} years old.")\n\n# Calculating years until retirement\nretirement_age = 65\nyears_left = retirement_age - user_age\n\nprint(f"You have {years_left} years until retirement.")\n\n# Method 2: Using actual input() function\n# Note: The backend will intercept this and provide a default value\nprint("\n--- Testing actual input() function ---")\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")'  
};
