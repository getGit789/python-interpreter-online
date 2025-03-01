# Deploying to Render

This guide will help you deploy the Python Interpreter Online backend to Render.

## Prerequisites

1. A [Render](https://render.com/) account
2. Your project pushed to GitHub

## Step-by-Step Deployment Guide

1. **Log in to Render**
   - Go to [render.com](https://render.com/) and log in or create an account

2. **Create a New Web Service**
   - Click on "New" and select "Web Service"
   - Connect your GitHub repository
   - Search for and select your "python-interpreter-online" repository

3. **Configure the Web Service**
   - **Name**: `python-interpreter-api` (or your preferred name)
   - **Environment**: `Python`
   - **Region**: Choose the region closest to your users
   - **Branch**: `main`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variables**
   - Click on "Advanced" to expand advanced options
   - Add the following environment variables:
     - `PYTHON_VERSION`: `3.9.0`
     - `ALLOWED_ORIGINS`: `https://getgit789.github.io,http://localhost:3002,http://localhost:5500`

5. **Deploy the Service**
   - Click "Create Web Service"
   - Render will automatically deploy your application
   - Wait for the deployment to complete (this may take a few minutes)

6. **Verify the Deployment**
   - Once deployed, click on the URL provided by Render
   - You should see the message: `{"message":"Welcome to Python Interpreter API"}`
   - Test the health endpoint: `https://your-render-url.onrender.com/health`

## Connecting Frontend to Backend

After deploying the backend, the frontend should automatically connect to it if you're using the updated `script.js` file that detects the environment.

## Troubleshooting

If you encounter any issues:

1. **Check Render Logs**
   - Go to your web service on Render
   - Click on "Logs" to see what might be causing the issue

2. **CORS Issues**
   - Ensure the `ALLOWED_ORIGINS` environment variable includes your frontend URL
   - The backend should be configured to accept requests from your GitHub Pages domain

3. **API Connection Issues**
   - Make sure the frontend is using the correct backend URL
   - Check browser console for any errors

## Updating Your Deployment

When you push changes to your GitHub repository:

1. **Backend**: Render will automatically redeploy your backend
2. **Frontend**: GitHub Actions will automatically redeploy your frontend

No manual steps are required for updates!
