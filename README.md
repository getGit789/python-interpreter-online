# Online Python Interpreter

A web-based Python interpreter that allows users to write, execute, and share Python code in a secure and scalable environment.

## Features
- In-browser code editor with syntax highlighting (Monaco Editor)
- Secure Python code execution
- Real-time output display

## Tech Stack
- Frontend: Simple HTML/JS with Monaco Editor
- Backend: FastAPI
- Code Execution: Python subprocess with timeout

## Setup Instructions

### Backend
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `pip install -r requirements.txt`
3. Start the server: `uvicorn app.main:app --reload --port 8002`

### Frontend
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser and navigate to: `http://localhost:3002/`

The frontend uses a simple custom Node.js server to serve the application with Monaco Editor for code editing.

## 👏 Acknowledgements

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the powerful code editor
- [FastAPI](https://fastapi.tiangolo.com/) for the high-performance backend
- [RestrictedPython](https://github.com/zopefoundation/RestrictedPython) for secure code execution

## ❤️ Support the Project

If you find this project useful, please consider supporting its development and maintenance. Your contributions help ensure that Python Interpreter Online remains free, up-to-date, and continuously improved.

### Donation Options

- **[GitHub Sponsors](https://github.com/sponsors/GetGit789)**: Support with monthly donations and get special recognition
- **[Ko-fi](https://ko-fi.com/getgit789)**: Buy me a coffee to fuel more coding sessions
- **[PayPal](https://paypal.me/getgit789)**: One-time donations of any amount

### Why Donate?

Donations help cover:
- Server hosting costs
- Development time for new features
- Maintenance and security updates
- Documentation improvements

All donations are greatly appreciated, but completely optional. This project will always remain free and open-source regardless of financial support.

### Other Ways to Support

- **Star the repository**: It helps others discover the project
- **Report bugs**: Help improve the project by reporting issues
- **Submit pull requests**: Contribute code or documentation improvements
- **Share with others**: Tell your friends and colleagues about this project

---

Made with ❤️ by [GetGit789](https://github.com/GetGit789)
