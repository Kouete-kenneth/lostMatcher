#!/bin/bash
# Startup script for Render deployment

# Get the port from environment variable, default to 5000
PORT=${PORT:-5000}

echo "Starting application on port $PORT..."

# Start with gunicorn
exec gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 --log-level info --access-logfile - --error-logfile - app:app
