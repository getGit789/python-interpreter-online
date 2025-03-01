# Python Interpreter Online

![Python Interpreter Online](https://img.shields.io/badge/Python-Interpreter-blue?style=for-the-badge&logo=python)

A modern, web-based Python interpreter that allows users to write, execute, and share Python code in a secure and scalable environment. Perfect for learning, teaching, quick code testing, or sharing code snippets with others.

**Live Demo:** [https://github.com/GetGit789/python-interpreter-online](https://github.com/GetGit789/python-interpreter-online)

![Screenshot of Python Interpreter Online](https://via.placeholder.com/800x450.png?text=Python+Interpreter+Online)

## ✨ Features

- **In-browser Code Editor** with syntax highlighting, code completion, and error detection (powered by Monaco Editor)
- **Secure Python Code Execution** with resource limits and sandboxing
- **Real-time Output Display** for immediate feedback
- **Dark Theme** for reduced eye strain during extended coding sessions
- **Code Sharing** via shareable URLs
- **One-click Code Copying** to clipboard
- **Pre-loaded Code Examples** to help users get started
- **Responsive Design** that works on desktop and mobile devices
- **Rate Limiting** to prevent abuse

## 🛠️ Tech Stack

- **Frontend:**
  - HTML5, CSS3, and vanilla JavaScript
  - Monaco Editor for code editing
  - Responsive design with CSS Grid and Flexbox
  
- **Backend:**
  - FastAPI for high-performance API endpoints
  - RestrictedPython for secure code execution
  - Resource limiting with Python's `resource` module
  - Authentication and rate limiting

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ for the backend
- Node.js 14+ for the frontend server

### Installation

#### Clone the Repository

```bash
git clone https://github.com/GetGit789/python-interpreter-online.git
cd python-interpreter-online
```

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   uvicorn app.main:app --reload --port 8002
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3002/
   ```

## 🔒 Security

The Python Interpreter Online takes security seriously:

- **Code Sandboxing**: Uses RestrictedPython to prevent malicious code execution
- **Resource Limits**: Restricts CPU time, memory usage, and process creation
- **Rate Limiting**: Prevents abuse by limiting requests per user
- **Input Validation**: Sanitizes all user inputs to prevent injection attacks
- **Module Whitelisting**: Only allows safe Python modules to be imported

## 🧩 Architecture

### Backend (FastAPI)

The backend is built with FastAPI and provides the following endpoints:

- `POST /execute`: Executes Python code and returns the output
- `POST /token`: Authenticates users and provides access tokens
- `GET /health`: Health check endpoint

### Frontend

The frontend is a simple, responsive web application that communicates with the backend API:

- **Monaco Editor**: Provides a rich code editing experience
- **API Client**: Uses Axios to communicate with the backend
- **UI Components**: Custom-built components for a cohesive user experience

## 🎮 Usage

1. **Write Code**: Type your Python code in the editor
2. **Run Code**: Click the "Run Code" button to execute your code
3. **View Output**: See the results in the output panel below the editor
4. **Share Code**: Click "Share Code" to generate a shareable URL
5. **Copy Code**: Click "Copy Code" to copy your code to the clipboard
6. **Clear Output**: Click "Clear Output" to clear the output panel
7. **Load Examples**: Select an example from the dropdown to load pre-written code

## 🛣️ Roadmap

- [ ] Add support for multiple files and projects
- [ ] Implement user accounts for saving code snippets
- [ ] Add code formatting options
- [ ] Support for additional programming languages
- [ ] Collaborative editing features

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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
