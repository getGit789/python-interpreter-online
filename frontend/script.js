// Initialize variables
let editor;
let runButton;
let clearButton;
let exampleSelect;
let output;
let executionStatus;
let statusMessage;

// Code examples
const codeExamples = {
    hello: '# Hello World Example\nprint("Hello, World!")',
    error: '# Error Handling Example\n\ntry:\n    # Division by zero error\n    result = 10 / 0\n    print("This won\'t be printed")\nexcept ZeroDivisionError as e:\n    print(f"Caught an error: {e}")\n\ntry:\n    # Index error\n    my_list = [1, 2, 3]\n    print(my_list[10])\nexcept IndexError as e:\n    print(f"Caught an index error: {e}")\n\n# Syntax error example (commented out)\n# print("Missing closing parenthesis")',
    loop: '# Performance Test Example\n\n# Fibonacci sequence calculation\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Calculate first 10 Fibonacci numbers\nfor i in range(10):\n    result = fibonacci(i)\n    print(f"fibonacci({i}) = {result}")\n\n# Loop example\nprint("\nCounting from 1 to 1000 by 100s:")\nfor i in range(1, 1001, 100):\n    print(i)',
    input: '# Input Handling Example\n\n# Method 1: Using variables to simulate input\n# Simulated user input\nuser_name = "John"  # Normally would be: input("Enter your name: ")\nuser_age = 25      # Normally would be: int(input("Enter your age: "))\n\nprint(f"Hello, {user_name}! You are {user_age} years old.")\n\n# Calculating years until retirement\nretirement_age = 65\nyears_left = retirement_age - user_age\n\nprint(f"You have {years_left} years until retirement.")\n\n# Method 2: Using actual input() function\n# Note: The backend will intercept this and provide a default value\nprint("\n--- Testing actual input() function ---")\nname = input("Enter your name: ")\nprint(f"Hello, {name}!")'  
};

// Flag to prevent multiple initializations
let isInitialized = false;

// Initialize the Monaco Editor when it's loaded
require(['vs/editor/editor.main'], function() {
    // Prevent multiple initializations
    if (isInitialized) {
        console.log('Monaco Editor already initialized, skipping');
        return;
    }
    isInitialized = true;
    // Configure Python syntax highlighting
    monaco.languages.registerCompletionItemProvider('python', {
        provideCompletionItems: function(model, position) {
            const suggestions = [
                {
                    label: 'def',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Define a new function'
                },
                {
                    label: 'class',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'class ${1:ClassName}:\n\tdef __init__(self${2:parameters}):\n\t\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Define a new class'
                },
                {
                    label: 'if',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'if ${1:condition}:\n\t${2:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'If statement'
                },
                {
                    label: 'for',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'for ${1:item} in ${2:iterable}:\n\t${3:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'For loop'
                },
                {
                    label: 'while',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'while ${1:condition}:\n\t${2:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'While loop'
                },
                {
                    label: 'try',
                    kind: monaco.languages.CompletionItemKind.Keyword,
                    insertText: 'try:\n\t${1:pass}\nexcept ${2:Exception} as ${3:e}:\n\t${4:pass}',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Try/except block'
                },
                {
                    label: 'print',
                    kind: monaco.languages.CompletionItemKind.Function,
                    insertText: 'print(${1:content})',
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    documentation: 'Print to console'
                }
            ];
            return { suggestions: suggestions };
        }
    });

    // Initialize the Monaco Editor with enhanced options
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '# Write your Python code here\nprint("Hello, World!")',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        renderLineHighlight: 'all',
        fontLigatures: true,
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 4,
        insertSpaces: true,
        detectIndentation: true,
        wordWrap: 'on'
    });
    
    // Get DOM elements
    runButton = document.getElementById('run-button');
    clearButton = document.getElementById('clear-button');
    exampleSelect = document.getElementById('example-select');
    output = document.getElementById('output');
    executionStatus = document.getElementById('execution-status');
    statusMessage = document.getElementById('status-message');
    
    // Remove any existing event listeners
    runButton.removeEventListener('click', runCode);
    clearButton.removeEventListener('click', clearOutput);
    exampleSelect.removeEventListener('change', loadExample);
    
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

// Common Python errors and their user-friendly messages
const errorMessages = {
    'SyntaxError': {
        'EOL while scanning string literal': 'You have an unclosed string. Make sure all quotes are properly closed.',
        'unexpected EOF while parsing': 'Your code is incomplete. Check for missing closing brackets or parentheses.',
        'invalid syntax': 'There\'s a syntax error in your code. Check for typos or missing colons after statements like if, for, while, etc.',
        'invalid token': 'There\'s an invalid character in your code. Check for special characters that aren\'t allowed in Python.'
    },
    'IndentationError': {
        'expected an indented block': 'You need to indent the code block after a colon (:).',
        'unexpected indent': 'You have an unexpected indentation. Make sure your indentation is consistent.'
    },
    'NameError': {
        'name': 'You\'re using a variable that hasn\'t been defined. Check for typos or make sure to define the variable before using it.'
    },
    'TypeError': {
        'unsupported operand': 'You\'re trying to perform an operation on incompatible types. Check the data types of your variables.',
        'can\'t multiply sequence by non-int': 'You can only multiply sequences (like strings or lists) by integers.',
        'object is not subscriptable': 'You\'re trying to use indexing [] on an object that doesn\'t support it.'
    },
    'ZeroDivisionError': {
        'division by zero': 'You\'re trying to divide by zero, which is not allowed in mathematics.'
    },
    'IndexError': {
        'list index out of range': 'You\'re trying to access an index that doesn\'t exist in your list. Remember, indexing starts at 0.'
    },
    'KeyError': {
        '': 'You\'re trying to access a key that doesn\'t exist in your dictionary.'
    },
    'ImportError': {
        'No module named': 'You\'re trying to import a module that doesn\'t exist or isn\'t installed.'
    },
    'ValueError': {
        'invalid literal for int()': 'You\'re trying to convert a string to an integer, but the string doesn\'t represent a valid number.'
    },
    'FileNotFoundError': {
        'No such file or directory': 'The file you\'re trying to open doesn\'t exist or the path is incorrect.'
    },
    'TimeoutError': {
        '': 'Your code took too long to execute. Check for infinite loops or inefficient algorithms.'
    }
};

// Function to get a user-friendly error message
function getUserFriendlyErrorMessage(errorText) {
    // Extract error type and details
    const errorMatch = errorText.match(/([A-Za-z]+Error):(.*?)(?:\n|$)/);
    if (!errorMatch) return errorText;
    
    const errorType = errorMatch[1];
    const errorDetail = errorMatch[2].trim();
    
    // Check if we have a friendly message for this error type
    if (errorMessages[errorType]) {
        // Look for specific error details
        for (const [pattern, message] of Object.entries(errorMessages[errorType])) {
            if (pattern && errorDetail.includes(pattern)) {
                return `${errorType}: ${message}\n\nOriginal error: ${errorDetail}`;
            }
        }
        
        // If no specific detail matched but we have a general message for the error type
        if (errorMessages[errorType]['']) {
            return `${errorType}: ${errorMessages[errorType]['']}`;
        }
    }
    
    // Return the original error if no friendly message is found
    return errorText;
}

// Debounce mechanism
let isRunning = false;
let lastRunTime = 0;
const DEBOUNCE_TIME = 1000; // 1 second

// Run code function
async function runCode() {
    if (!editor) {
        console.error('Editor not initialized');
        return;
    }
    
    // Prevent multiple rapid executions
    const now = Date.now();
    if (isRunning || (now - lastRunTime < DEBOUNCE_TIME)) {
        console.log('Execution already in progress or too soon after last execution, skipping');
        return;
    }
    
    isRunning = true;
    lastRunTime = now;
    
    const code = editor.getValue();
    
    // Show running status
    executionStatus.className = 'execution-status running';
    statusMessage.textContent = 'Running code...';
    output.textContent = '';
    output.className = '';
    
    try {
        console.log('Sending code to backend:', code);
        const response = await axios.post('http://localhost:8002/execute', {
            code: code
        });
        
        console.log('Response received:', response.data);
        
        // Handle the response
        let outputText = '';
        let hasError = false;
        
        // Reset output class immediately to ensure clean state
        output.className = '';
        
        // Check if there's any output
        if (response.data.output && response.data.output.trim()) {
            outputText += response.data.output;
        }
        
        // Check if there's any error
        if (response.data.error && response.data.error.trim()) {
            hasError = true;
            if (outputText) outputText += '\n\n';
            const friendlyError = getUserFriendlyErrorMessage(response.data.error);
            outputText += 'Error:\n' + friendlyError;
            
            // Update status to error
            executionStatus.className = 'execution-status error';
            statusMessage.textContent = 'Error in code execution';
        }
        
        // Check exit code (if provided)
        if (response.data.exit_code !== undefined && response.data.exit_code !== 0) {
            hasError = true;
            if (!outputText) {
                outputText = 'Program exited with code ' + response.data.exit_code;
            }
            
            // Update status to error if not already set
            if (!executionStatus.classList.contains('error')) {
                executionStatus.className = 'execution-status error';
                statusMessage.textContent = 'Error in code execution';
            }
        }
        
        // If no output or error
        if (!outputText) {
            outputText = 'Program executed successfully with no output';
        }
        
        // This block is now handled in the output class setting section
        
        output.textContent = outputText;
        
        console.log('Has error:', hasError, 'Output text:', outputText);
        
        // Only set a class if there's an error, otherwise clear the class
        if (hasError) {
            output.className = 'error';
        } else {
            output.className = '';
        }
        
        // Clear the execution status error if we're showing success output
        if (hasError) {
            executionStatus.className = 'execution-status error';
            statusMessage.textContent = 'Error in code execution';
            
            // Hide error status after 3 seconds
            setTimeout(() => {
                if (executionStatus.classList.contains('error')) {
                    executionStatus.className = 'execution-status hidden';
                }
            }, 3000);
        } else {
            executionStatus.className = 'execution-status success';
            statusMessage.textContent = 'Code executed successfully!';
            
            // Hide success status after 3 seconds
            setTimeout(() => {
                if (executionStatus.classList.contains('success')) {
                    executionStatus.className = 'execution-status hidden';
                }
            }, 3000);
        }
    } catch (error) {
        console.error('Error executing code:', error);
        
        // Update status to error
        executionStatus.className = 'execution-status error';
        statusMessage.textContent = 'Error connecting to server';
        
        // Display error
        const errorMessage = error.response?.data?.error || error.message || 'Unknown error';
        output.textContent = 'Error connecting to server: ' + errorMessage;
        output.className = 'error';
        
        // Hide error status after 3 seconds
        setTimeout(() => {
            if (executionStatus.classList.contains('error')) {
                executionStatus.className = 'execution-status hidden';
            }
        }, 3000);
    } finally {
        // Reset running flag
        isRunning = false;
    }
}

// Clear output function
function clearOutput() {
    if (output) {
        output.textContent = '';
        output.className = '';
    }
    
    // Hide execution status
    if (executionStatus) {
        executionStatus.className = 'execution-status hidden';
    }
}

// Log initialization
console.log('Script loaded');
