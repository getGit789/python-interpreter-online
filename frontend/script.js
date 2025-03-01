// Initialize variables
let editor;
let runButton;
let clearButton;
let exampleSelect;
let output;

// Code examples
const codeExamples = {
    hello: '# Hello World Example\nprint("Hello, World!")',
    error: '# Error Handling Example\n\ntry:\n    # Division by zero error\n    result = 10 / 0\n    print("This won\'t be printed")\nexcept ZeroDivisionError as e:\n    print(f"Caught an error: {e}")\n\ntry:\n    # Index error\n    my_list = [1, 2, 3]\n    print(my_list[10])\nexcept IndexError as e:\n    print(f"Caught an index error: {e}")\n\n# Syntax error example (commented out)\n# print("Missing closing parenthesis")',
    loop: '# Performance Test Example\n\n# Fibonacci sequence calculation\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 Fibonacci numbers\nfor i in range(10):\n    result = fibonacci(i)\n    print(f"fibonacci({i}) = {result}")\n\n# Loop example\nprint("\nCounting from 1 to 1000 by 100s:")\nfor i in range(1, 1001, 100):\n    print(i)',
    input: '# Input Handling Example\n\n# Method 1: Using variables to simulate input\n# Simulated user input\nuser_name = "John"  # Normally would be: input("Enter your name: ")\nuser_age = 25      # Normally would be: int(input("Enter your age: "))\n\nprint(f"Hello, {user_name}! You are {user_age} years old.")\n\n# Calculating years until retirement\nretirement_age = 65\nyears_left = retirement_age - user_age\n\nprint(f"You have {years_left} years until retirement.")\n\n# Method 2: Using actual input() function\n# Note: The backend will intercept this and provide a default value\nprint("\n--- Testing actual input() function ---")\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")'  
};

// Initialize the Monaco Editor when it's loaded
require(['vs/editor/editor.main'], function() {
    // Initialize the Monaco Editor
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '# Write your Python code here\nprint("Hello, World!")',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });
    
    // Get DOM elements
    runButton = document.getElementById('run-button');
    clearButton = document.getElementById('clear-button');
    exampleSelect = document.getElementById('example-select');
    output = document.getElementById('output');
    
    // Add event listeners
    runButton.addEventListener('click', runCode);
    clearButton.addEventListener('click', clearOutput);
    exampleSelect.addEventListener('change', loadExample);
    
    // Log success message
    console.log('Monaco Editor initialized successfully');
});

// Load example code
function loadExample() {
    const example = exampleSelect.value;
    if (example && codeExamples[example]) {
        editor.setValue(codeExamples[example]);
    }
}

// Run code function
async function runCode() {
    if (!editor) {
        console.error('Editor not initialized');
        return;
    }
    
    const code = editor.getValue();
    output.textContent = 'Running...';
    output.className = 'running';
    
    try {
        console.log('Sending code to backend:', code);
        const response = await axios.post('http://localhost:8002/execute', {
            code: code
        });
        
        console.log('Response received:', response.data);
        
        // Handle the response
        let outputText = '';
        let outputClass = '';
        
        // Check if there's any output
        if (response.data.output && response.data.output.trim()) {
            outputText += response.data.output;
        }
        
        // Check if there's any error
        if (response.data.error && response.data.error.trim()) {
            if (outputText) outputText += '\n\n';
            outputText += 'Error:\n' + response.data.error;
            outputClass = 'error';
        }
        
        // Check exit code
        if (response.data.exit_code !== 0) {
            outputClass = 'error';
            if (!outputText) {
                outputText = 'Program exited with code ' + response.data.exit_code;
            }
        }
        
        // If no output or error
        if (!outputText) {
            outputText = 'Program executed successfully with no output';
            outputClass = 'success';
        }
        
        output.textContent = outputText;
        output.className = outputClass;
    } catch (error) {
        console.error('Error executing code:', error);
        output.textContent = 'Error connecting to server: ' + 
            (error.response?.data?.error || error.message || 'Unknown error');
        output.className = 'error';
    }
}

// Clear output function
function clearOutput() {
    if (output) {
        output.textContent = '';
    }
}

// Log initialization
console.log('Script loaded');
