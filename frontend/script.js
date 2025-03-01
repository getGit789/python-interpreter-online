// Initialize variables
let editor;
let runButton;
let clearButton;
let output;

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
    output = document.getElementById('output');
    
    // Add event listeners
    runButton.addEventListener('click', runCode);
    clearButton.addEventListener('click', clearOutput);
    
    // Log success message
    console.log('Monaco Editor initialized successfully');
});

// Run code function
async function runCode() {
    if (!editor) {
        console.error('Editor not initialized');
        return;
    }
    
    const code = editor.getValue();
    output.textContent = 'Running...';
    
    try {
        console.log('Sending code to backend:', code);
        const response = await axios.post('http://localhost:8002/execute', {
            code: code
        });
        
        console.log('Response received:', response.data);
        if (response.data && response.data.output) {
            output.textContent = response.data.output;
        } else if (response.data && response.data.error) {
            output.textContent = 'Error: ' + response.data.error;
        } else {
            output.textContent = 'No output received';
        }
    } catch (error) {
        console.error('Error executing code:', error);
        output.textContent = 'Error: ' + (error.response?.data?.error || error.message || 'Unknown error');
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
