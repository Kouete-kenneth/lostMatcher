@echo off
echo Testing Docker image locally with Render-like environment...

REM Test the image with PORT environment variable like Render would use
docker run --rm -p 8000:8000 -e PORT=8000 lostmatchermodel/robust-image-matcher-minimal:latest

pause
