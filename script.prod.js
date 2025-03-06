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
const API_URL = 'https://fastapi-prod.eba-f2mg8dmn.us-east-1.elasticbeanstalk.com'; // AWS Elastic Beanstalk URL

// Configure default fetch options with proper CORS settings
const fetchOptions = {
    mode: 'cors',
    credentials: 'omit',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://getgit789.github.io'
    }
};

// Function to check API health
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_URL}/health`, fetchOptions);
        if (!response.ok) {
            throw new Error(`Health check failed: ${response.status}`);
        }
        const data = await response.json();
        console.log('API Health Status:', data);
        return data.status === 'healthy';
    } catch (error) {
        console.error('Health check error:', error);
        return false;
    }
}

// Run code function with improved error handling
async function runCode() {
    const now = Date.now();
    if (isRunning || (now - lastRunTime < DEBOUNCE_TIME)) {
        console.log('Debouncing code execution');
        return;
    }

    isRunning = true;
    lastRunTime = now;
    
    try {
        // Update status
        executionStatus.style.display = 'block';
        statusMessage.textContent = 'Running...';
        statusMessage.style.color = '#ffd700';
        
        const code = editor.getValue();
        console.log('Sending request to:', API_URL);
        
        // First check API health
        const isHealthy = await checkApiHealth();
        if (!isHealthy) {
            throw new Error('API is not available. Please try again later.');
        }

        // Execute code
        const response = await fetch(`${API_URL}/execute`, {
            ...fetchOptions,
            method: 'POST',
            body: JSON.stringify({ code: code })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Received response:', data);
        
        if (data.error) {
            output.textContent = `Error: ${data.error}`;
            output.style.color = '#ff6b6b';
            statusMessage.textContent = 'Error';
            statusMessage.style.color = '#ff6b6b';
            console.error('Execution error:', data.error);
            if (data.traceback) {
                console.error('Traceback:', data.traceback);
            }
        } else {
            output.textContent = data.output || 'No output';
            output.style.color = '#98c379';
            statusMessage.textContent = 'Success';
            statusMessage.style.color = '#98c379';
        }
    } catch (error) {
        console.error('Error:', error);
        output.textContent = `Error: ${error.message}`;
        output.style.color = '#ff6b6b';
        statusMessage.textContent = 'Error';
        statusMessage.style.color = '#ff6b6b';
    } finally {
        isRunning = false;
        setTimeout(() => {
            executionStatus.style.display = 'none';
        }, 2000);
    }
}

// Code examples
const codeExamples = {
    hello: '# Hello World Example\nprint("Hello, World!")',
    error: '# Error Handling Example\n\ntry:\n    # Division by zero error\n    result = 10 / 0\n    print("This won\'t be printed")\nexcept ZeroDivisionError as e:\n    print(f"Caught an error: {e}")\n\ntry:\n    # Index error\n    my_list = [1, 2, 3]\n    print(my_list[10])\nexcept IndexError as e:\n    print(f"Caught an index error: {e}")\n\n# Syntax error example (commented out)\n# print("Missing closing parenthesis")',
    loop: '# Performance Test Example\n\n# Fibonacci sequence calculation\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 Fibonacci numbers\nfor i in range(10):\n    result = fibonacci(i)\n    print(f"fibonacci({i}) = {result}")\n\n# Loop example\nprint("\nCounting from 1 to 1000 by 100s:")\nfor i in range(1, 1001, 100):\n    print(i)',
    input: '# Input Handling Example\n\n# Method 1: Using variables to simulate input\n# Simulated user input\nuser_name = "John"  # Normally would be: input("Enter your name: ")\nuser_age = 25      # Normally would be: int(input("Enter your age: "))\n\nprint(f"Hello, {user_name}! You are {user_age} years old.")\n\n# Calculating years until retirement\nretirement_age = 65\nyears_left = retirement_age - user_age\n\nprint(f"You have {years_left} years until retirement.")\n\n# Method 2: Using actual input() function\n# Note: The backend will intercept this and provide a default value\nprint("\n--- Testing actual input() function ---")\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")'  
};
