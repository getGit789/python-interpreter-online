# Python Interpreter Online

![Python Interpreter Online](https://raw.githubusercontent.com/getGit789/python-interpreter-online/main/frontend/public/screenshot.png)

## 🚀 Live Demo

**Try it now:** [Python Interpreter Online](https://getgit789.github.io/python-interpreter-online/)

## 📝 Description

Python Interpreter Online is a web-based application that allows users to write, execute, and share Python code securely from their browser. It features a modern code editor with syntax highlighting, error handling, and the ability to share code snippets via URL.

## ✨ Features

- **Modern Code Editor**: Built with Monaco Editor (the same engine that powers VS Code)
- **Syntax Highlighting**: Makes your code more readable with proper coloring
- **Code Execution**: Run Python code directly in your browser
- **Error Handling**: User-friendly error messages with explanations
- **Code Sharing**: Share your code snippets with others via URL
- **Example Code**: Pre-loaded examples to help you get started
- **Responsive Design**: Works on desktop and mobile devices
- **Secure Execution**: Code runs in a sandboxed environment with resource limits

## 🛠️ Technology Stack

### Frontend
- Vanilla JavaScript
- Monaco Editor
- HTML/CSS
- Axios for API requests

### Backend
- FastAPI (Python)
- Uvicorn ASGI server
- RestrictedPython for sandboxed execution
- Rate limiting and security measures

## 🔧 Local Development Setup

### Prerequisites
- Node.js (for frontend)
- Python 3.9+ (for backend)

### Backend Setup
1. Clone the repository
   ```bash
   git clone https://github.com/getGit789/python-interpreter-online.git
   cd python-interpreter-online
   ```

2. Install backend dependencies
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Run the backend server
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```bash
   cd frontend
   ```

2. Install frontend dependencies
   ```bash
   npm install
   ```

3. Start the frontend server
   ```bash
   node server.js
   ```

4. Open your browser and navigate to `http://localhost:3002`

## 🌐 Deployment

The project is deployed using:
- **Frontend**: GitHub Pages
- **Backend**: Render

### Deploying the Frontend to GitHub Pages

The frontend is automatically deployed to GitHub Pages using GitHub Actions whenever changes are pushed to the main branch.

### Deploying the Backend to Render

Follow the instructions in [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) to deploy the backend to Render.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

If you have any questions or feedback, please open an issue on GitHub or contact the maintainer directly.

---

Made with ❤️ by [GetGit789](https://github.com/getGit789)
