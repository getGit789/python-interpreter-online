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
// Automatically detect if we're running on GitHub Pages and use the production API
const isProduction = window.location.hostname === 'getgit789.github.io';
const API_URL = isProduction 
    ? 'https://python-interpreter-api.onrender.com' 
    : 'http://localhost:8002';

console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);
console.log(`API URL: ${API_URL}`);

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
    copyButton = document.getElementById('copy-button');
    shareButton = document.getElementById('share-button');
    shareContainer = document.getElementById('share-container');
    shareUrlInput = document.getElementById('share-url');
    copyShareUrlButton = document.getElementById('copy-share-url');
    closeShareButton = document.getElementById('close-share');
    exampleSelect = document.getElementById('example-select');
    output = document.getElementById('output');
    executionStatus = document.getElementById('execution-status');
    statusMessage = document.getElementById('status-message');
    
    // Remove any existing event listeners
    runButton.removeEventListener('click', runCode);
    clearButton.removeEventListener('click', clearOutput);
    copyButton.removeEventListener('click', copyCode);
    shareButton.removeEventListener('click', shareCode);
    copyShareUrlButton.removeEventListener('click', copyShareUrl);
    closeShareButton.removeEventListener('click', closeShareModal);
    exampleSelect.removeEventListener('change', loadExample);
    
    // Add event listeners
    runButton.addEventListener('click', runCode);
    clearButton.addEventListener('click', clearOutput);
    copyButton.addEventListener('click', copyCode);
    shareButton.addEventListener('click', shareCode);
    copyShareUrlButton.addEventListener('click', copyShareUrl);
    closeShareButton.addEventListener('click', closeShareModal);
    exampleSelect.addEventListener('change', loadExample);
    
    // Check if there's code in the URL to load
    loadCodeFromUrl();
    
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
        const response = await axios.post(`${API_URL}/execute`, {
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
    output.textContent = '';
    output.classList.remove('error');
}

// Copy code function
function copyCode() {
    const code = editor.getValue();
    
    // Use the Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code)
            .then(() => {
                // Show temporary success message
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                copyButton.style.backgroundColor = '#388e3c';
                
                // Revert button text after 2 seconds
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy code. Please try selecting and copying manually.');
            });
    } else {
        // Fallback for browsers that don't support clipboard API
        try {
            // Create a temporary textarea element
            const textarea = document.createElement('textarea');
            textarea.value = code;
            textarea.setAttribute('readonly', '');
            textarea.style.position = 'absolute';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            
            // Select and copy the text
            textarea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            
            if (successful) {
                // Show temporary success message
                const originalText = copyButton.textContent;
                copyButton.textContent = 'Copied!';
                copyButton.style.backgroundColor = '#388e3c';
                
                // Revert button text after 2 seconds
                setTimeout(() => {
                    copyButton.textContent = originalText;
                    copyButton.style.backgroundColor = '';
                }, 2000);
            } else {
                alert('Failed to copy code. Please try selecting and copying manually.');
            }
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy code. Please try selecting and copying manually.');
        }
    }
}

// Function to generate a shareable URL
function shareCode() {
    const code = editor.getValue();
    
    // Encode the code to be URL-safe
    const encodedCode = encodeURIComponent(code);
    
    // Generate the shareable URL
    const shareableUrl = `${window.location.origin}${window.location.pathname}?code=${encodedCode}`;
    
    // Display the shareable URL
    shareUrlInput.value = shareableUrl;
    shareContainer.classList.remove('hidden');
    
    // Select the URL for easy copying
    shareUrlInput.select();
}

// Function to copy the share URL
function copyShareUrl() {
    shareUrlInput.select();
    
    // Use the Clipboard API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrlInput.value)
            .then(() => {
                // Show temporary success message
                const originalText = copyShareUrlButton.textContent;
                copyShareUrlButton.textContent = 'Copied!';
                copyShareUrlButton.style.backgroundColor = '#388e3c';
                
                // Revert button text after 2 seconds
                setTimeout(() => {
                    copyShareUrlButton.textContent = originalText;
                    copyShareUrlButton.style.backgroundColor = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
                alert('Failed to copy URL. Please try selecting and copying manually.');
            });
    } else {
        // Fallback for browsers that don't support clipboard API
        try {
            const successful = document.execCommand('copy');
            
            if (successful) {
                // Show temporary success message
                const originalText = copyShareUrlButton.textContent;
                copyShareUrlButton.textContent = 'Copied!';
                copyShareUrlButton.style.backgroundColor = '#388e3c';
                
                // Revert button text after 2 seconds
                setTimeout(() => {
                    copyShareUrlButton.textContent = originalText;
                    copyShareUrlButton.style.backgroundColor = '';
                }, 2000);
            } else {
                alert('Failed to copy URL. Please try selecting and copying manually.');
            }
        } catch (err) {
            console.error('Failed to copy URL: ', err);
            alert('Failed to copy URL. Please try selecting and copying manually.');
        }
    }
}

// Function to close the share modal
function closeShareModal() {
    shareContainer.classList.add('hidden');
}

// Function to load code from URL
function loadCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    
    if (codeParam) {
        try {
            const decodedCode = decodeURIComponent(codeParam);
            editor.setValue(decodedCode);
            console.log('Code loaded from URL');
        } catch (error) {
            console.error('Error loading code from URL:', error);
        }
    }
}

// Log initialization
console.log('Script loaded');
