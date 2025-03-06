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
const API_URL = 'https://pythonpal.up.railway.app'; // Railway URL

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
    
    const now = Date.now();
    if (isRunning || (now - lastRunTime < DEBOUNCE_TIME)) {
        console.log('Execution already in progress or too soon after last execution, skipping');
        return;
    }
    
    isRunning = true;
    lastRunTime = now;
    
    const code = editor.getValue();
    
    // Show running status
    executionStatus.style.display = 'block';
    statusMessage.textContent = 'Running...';
    statusMessage.style.color = '#ffd700';
    
    try {
        console.log('Sending code to backend:', code);
        const response = await fetch(`${API_URL}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': 'https://getgit789.github.io'
            },
            body: JSON.stringify({ code: code })
        });
        
        const data = await response.json();
        console.log('Response received:', data);
        
        if (data.error) {
            output.textContent = data.error;
            output.style.color = '#ff6b6b';
            statusMessage.textContent = 'Error';
            statusMessage.style.color = '#ff6b6b';
        } else {
            output.textContent = data.output || 'No output';
            output.style.color = '#98c379';
            statusMessage.textContent = 'Success';
            statusMessage.style.color = '#98c379';
        }
    } catch (error) {
        console.error('Error:', error);
        output.textContent = error.message || 'Unknown error';
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

// Clear output function
function clearOutput() {
    output.textContent = '';
    output.style.color = '';
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
