FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Security: Create non-root user
RUN useradd -m -r appuser && chown -R appuser /app
USER appuser

# Set environment variables
ENV MAX_WORKERS=4
ENV MAX_CODE_SIZE=10000
ENV REQUESTS_LIMIT=10
ENV TIME_WINDOW=60

# Expose port
EXPOSE 8002

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002", "--workers", "4"]
