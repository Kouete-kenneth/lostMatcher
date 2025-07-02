@echo off
echo Building and pushing Docker image for multiple platforms...

REM Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -f Dockerfile.memory-optimized -t lostmatchermodel/robust-image-matcher-minimal:latest --push .

echo Build and push completed!
pause
