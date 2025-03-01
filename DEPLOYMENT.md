# Python Interpreter Online - Deployment Guide

This guide provides instructions for deploying the Python Interpreter Online project securely in a production environment.

## Security Measures Implemented

The application includes several security measures to prevent abuse:

1. **Rate Limiting**: Limits users to 10 requests per minute to prevent DoS attacks.
2. **Resource Limiting**: 
   - CPU time limited to 2 seconds per execution
   - Memory usage limited to 100MB per execution
   - Execution timeout of 3 seconds
3. **Code Size Limit**: Maximum code size is limited to 10KB.
4. **Restricted Imports**: Potentially dangerous modules like `os`, `subprocess`, etc. are blocked.
5. **Restricted Operations**: Operations like `eval()`, `exec()`, and file I/O are blocked.
6. **Docker Containerization**: Both frontend and backend are containerized with resource limits.

## Deployment Options

### 1. Docker Compose (Recommended)

The simplest way to deploy is using Docker Compose:

```bash
# Clone the repository
git clone https://github.com/getGit789/python-interpreter-online.git
cd python-interpreter-online

# Build and start the containers
docker-compose up -d
```

This will start both the frontend and backend services with appropriate resource limits.

### 2. Manual Deployment

#### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8002 --workers 4
```

#### Frontend

```bash
cd frontend
npm install
node server.js
```

## Additional Security Recommendations

1. **Reverse Proxy**: Deploy behind Nginx or Apache with rate limiting.
2. **HTTPS**: Configure SSL/TLS for secure communication.
3. **Firewall**: Configure a firewall to restrict access to necessary ports only.
4. **Regular Updates**: Keep all dependencies updated to patch security vulnerabilities.
5. **Monitoring**: Set up monitoring for resource usage and suspicious activities.

## Production Environment Variables

For production deployment, consider setting these environment variables:

- `MAX_WORKERS`: Number of worker processes (default: 4)
- `MAX_CODE_SIZE`: Maximum code size in characters (default: 10000)
- `REQUESTS_LIMIT`: Number of requests allowed per time window (default: 10)
- `TIME_WINDOW`: Time window for rate limiting in seconds (default: 60)

## Scaling Considerations

For high-traffic scenarios:
- Increase the number of backend workers
- Consider deploying multiple instances behind a load balancer
- Implement a distributed rate limiter using Redis

## Troubleshooting

Common issues:
- If the backend fails to start, check if port 8002 is already in use
- If the frontend can't connect to the backend, verify the API_URL environment variable
- For memory issues, adjust the resource limits in docker-compose.yml
