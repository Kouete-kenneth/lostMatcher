# Docker Build Troubleshooting Guide

## Common Issues and Solutions

### 1. Network Connectivity Issues

If you see errors like "Could not resolve 'deb.debian.org'":

**Solution A: Use Minimal Build**

```bash
docker build -f Dockerfile.minimal -t robust-image-matcher .
```

**Solution B: Use Alpine Build**

```bash
docker build -f Dockerfile.alpine -t robust-image-matcher .
```

**Solution C: Clear Docker Cache**

```bash
docker system prune -a
docker builder prune
```

### 2. DNS Resolution Issues

If you're behind a corporate firewall:

**Add DNS to Docker Build**

```bash
docker build --network=host --dns=8.8.8.8 --dns=8.8.4.4 -t robust-image-matcher .
```

### 3. Proxy Issues

If you're behind a proxy:

**Set Build Args**

```bash
docker build \
  --build-arg HTTP_PROXY=http://proxy.company.com:8080 \
  --build-arg HTTPS_PROXY=http://proxy.company.com:8080 \
  -t robust-image-matcher .
```

### 4. Package Repository Issues

If Debian repositories are down:

**Use Mirror**
Add this to Dockerfile before apt-get commands:

```dockerfile
RUN sed -i 's/deb.debian.org/ftp.debian.org/g' /etc/apt/sources.list
```

### 5. Alternative Build Methods

**Method 1: Multi-stage Build**
Uses `Dockerfile.minimal` which requires minimal system dependencies.

**Method 2: Pre-built Image**
Use a pre-built image with OpenCV:

```dockerfile
FROM quay.io/jupyter/scipy-notebook
# Then install only Flask and your app dependencies
```

**Method 3: Local Development**
For testing purposes, run locally:

```bash
pip install -r requirements.minimal.txt
python app.py
```

### 6. Docker Hub Alternatives

If Docker Hub is slow, try:

-   GitHub Container Registry
-   Azure Container Registry
-   Google Container Registry

### 7. Build Arguments

You can customize the build process:

```bash
# Use different Python version
docker build --build-arg PYTHON_VERSION=3.11 -t robust-image-matcher .

# Use different OpenCV version
docker build --build-arg OPENCV_VERSION=4.9.0 -t robust-image-matcher .
```

### 8. Platform-Specific Builds

For ARM64 (Apple Silicon) or other architectures:

```bash
# Build for current platform
docker build --platform linux/amd64 -t robust-image-matcher .

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t robust-image-matcher .
```

## Testing the Built Image

Once built successfully, test the image:

```bash
# Run the container
docker run -p 5000:5000 robust-image-matcher

# Test health endpoint
curl http://localhost:5000/health

# Test extract endpoint
curl -X POST -F "image=@test_image.jpg" http://localhost:5000/extract

# Test compare endpoint
curl -X POST \
  -F "image1=@image1.jpg" \
  -F "image2=@image2.jpg" \
  http://localhost:5000/compare
```

## Performance Optimization

### Memory Limits

```bash
# Limit memory usage
docker run -m 2g -p 5000:5000 robust-image-matcher
```

### CPU Limits

```bash
# Limit CPU usage
docker run --cpus="1.5" -p 5000:5000 robust-image-matcher
```

### Volume Mounting

```bash
# Mount uploads directory
docker run -v $(pwd)/uploads:/app/uploads -p 5000:5000 robust-image-matcher
```

## Production Deployment

### Using Docker Compose

```bash
docker-compose up -d
```

### Using nginx proxy

```bash
docker-compose --profile with-proxy up -d
```

### Environment Variables

```bash
docker run -e FLASK_ENV=production -e MAX_CONTENT_LENGTH=16777216 -p 5000:5000 robust-image-matcher
```
