@echo off
REM Robust Image Matching API - Windows Docker Build and Deploy Script

setlocal EnableDelayedExpansion

REM Configuration
set IMAGE_NAME=robust-image-matcher
set DOCKER_HUB_USERNAME=yourusername
set VERSION=latest
set FULL_IMAGE_NAME=%DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%VERSION%

echo 🔨 Building Docker image: %IMAGE_NAME%
echo ======================================

REM Try building with minimal Dockerfile first (most likely to succeed)
echo 🚀 Trying minimal build (opencv-python-headless)...
docker build -f Dockerfile.minimal -t %IMAGE_NAME%-minimal .

if %ERRORLEVEL% equ 0 (
    echo ✅ Minimal Docker image built successfully!
    set IMAGE_NAME=%IMAGE_NAME%-minimal
    goto tag_image
)

echo ⚠️  Minimal build failed, trying Alpine build...
docker build -f Dockerfile.alpine -t %IMAGE_NAME%-alpine .

if %ERRORLEVEL% equ 0 (
    echo ✅ Alpine Docker image built successfully!
    set IMAGE_NAME=%IMAGE_NAME%-alpine
    goto tag_image
)

echo ⚠️  Alpine build failed, trying standard build...
REM Build the Docker image with standard Dockerfile
docker build -t %IMAGE_NAME% .

if %ERRORLEVEL% neq 0 (
    echo ❌ All Docker builds failed!
    echo 💡 Try these troubleshooting steps:
    echo    1. Check your internet connection
    echo    2. Try again later (package servers might be down)
    echo    3. Use a VPN if you're behind a restrictive firewall
    echo    4. Clear Docker cache: docker system prune -a
    pause
    exit /b 1
)

echo ✅ Standard Docker image built successfully!

:tag_image
echo.

REM Tag for Docker Hub
echo 🏷️  Tagging image for Docker Hub...
docker tag %IMAGE_NAME% %FULL_IMAGE_NAME%

echo ✅ Image tagged as: %FULL_IMAGE_NAME%
echo.

REM Test the image locally
echo 🧪 Testing the image locally...
echo Starting container on port 7000...

REM Start container in background
for /f "tokens=*" %%i in ('docker run -d -p 7000:7000 %IMAGE_NAME%') do set CONTAINER_ID=%%i

echo Container started with ID: %CONTAINER_ID%
echo Waiting for service to start...
timeout /t 10 /nobreak >nul

REM Test health endpoint
curl -f http://localhost:7000/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Health check passed!
    echo 🔍 Testing API endpoints...
    echo Health endpoint response:
    curl -s http://localhost:7000/health
) else (
    echo ❌ Health check failed!
    echo Container logs:
    docker logs %CONTAINER_ID%
)

REM Stop the test container
echo.
echo 🛑 Stopping test container...
docker stop %CONTAINER_ID%
docker rm %CONTAINER_ID%

echo.
echo 📦 Build Summary:
echo ==================
echo Image Name: %IMAGE_NAME%
echo Tagged As: %FULL_IMAGE_NAME%
echo Status: Ready for deployment
echo.

REM Ask user if they want to push to Docker Hub
set /p response="Would you like to push this image to Docker Hub? (y/N): "

if /i "%response%"=="y" (
    echo.
    echo 🚀 Pushing to Docker Hub...
    echo ============================
    
    echo Please make sure you're logged in to Docker Hub (docker login)
    pause
    
    REM Push the image
    docker push %FULL_IMAGE_NAME%
    
    if %ERRORLEVEL% equ 0 (
        echo ✅ Successfully pushed to Docker Hub!
        echo.
        echo 🌐 Your image is now available at:
        echo    docker pull %FULL_IMAGE_NAME%
        echo.
        echo 🚀 To run from Docker Hub:
        echo    docker run -p 7000:7000 %FULL_IMAGE_NAME%
    ) else (
        echo ❌ Push to Docker Hub failed!
    )
) else (
    echo.
    echo 🏠 Local build complete. To run locally:
    echo    docker run -p 7000:7000 %IMAGE_NAME%
)

echo.
echo 🎉 Process completed successfully!
echo.
echo 📚 Usage Examples:
echo ==================
echo.
echo 1. Run locally:
echo    docker run -p 7000:7000 %IMAGE_NAME%
echo.
echo 2. Run in background:
echo    docker run -d -p 7000:7000 --name image-matcher %IMAGE_NAME%
echo.
echo 3. Test the API:
echo    curl http://localhost:7000/health
echo.
echo 4. Compare images:
echo    curl -X POST http://localhost:7000/compare-images ^
echo      -F "image1=@image1.jpg" ^
echo      -F "image2=@image2.jpg"

pause
