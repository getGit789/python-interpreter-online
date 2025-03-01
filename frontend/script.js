// Configure Monaco Editor
require.config({ paths: { 'vs': 'node_modules/monaco-editor/min/vs' }});

let editor;

require(['vs/editor/editor.main'], function() {
    // Initialize the Monaco Editor
    editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '# Write your Python code here\nprint("Hello, World!")',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

// Get DOM elements
const runButton = document.getElementById('run-button');
const clearButton = document.getElementById('clear-button');
const output = document.getElementById('output');

// Run code function
async function runCode() {
    const code = editor.getValue();
    output.textContent = 'Running...';
    
    try {
        const response = await axios.post('http://localhost:8002/execute', {
            code: code
        });
        
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
    output.textContent = '';
}

// Add event listeners
runButton.addEventListener('click', runCode);
clearButton.addEventListener('click', clearOutput);
