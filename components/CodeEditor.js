import { useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = () => {
  const [code, setCode] = useState("print('Hello, World!')");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runCode = async () => {
    setLoading(true);
    setOutput("");
    setError("");
    
    try {
      const response = await axios.post("http://localhost:8002/execute", {
        code,
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        setOutput(response.data.output);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Error executing code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Editor
          height="300px"
          defaultLanguage="python"
          defaultValue={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
          }}
        />
      </div>
      
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
        
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 
                    focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => setCode("print('Hello, World!')")}
        >
          Reset
        </button>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Output</h2>
        <div className="bg-gray-900 text-gray-100 p-4 rounded h-48 overflow-auto">
          {loading ? (
            <p className="text-yellow-400">Running code...</p>
          ) : error ? (
            <pre className="text-red-400 whitespace-pre-wrap">{error}</pre>
          ) : output ? (
            <pre className="whitespace-pre-wrap">{output}</pre>
          ) : (
            <p className="text-gray-500">Run your code to see output</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
