#!/bin/bash

# Robust Image Matching API - Docker Build and Deploy Script
# This script builds the Docker image and optionally pushes to Docker Hub

set -e

# Configuration
IMAGE_NAME="robust-image-matcher"
DOCKER_HUB_USERNAME="yourusername"  # Change this to your Docker Hub username
VERSION="latest"
FULL_IMAGE_NAME="${DOCKER_HUB_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "🔨 Building Docker image: ${IMAGE_NAME}"
echo "======================================"

# Build the Docker image
docker build -t ${IMAGE_NAME} .

echo "✅ Docker image built successfully!"
echo ""

# Tag for Docker Hub
echo "🏷️  Tagging image for Docker Hub..."
docker tag ${IMAGE_NAME} ${FULL_IMAGE_NAME}

echo "✅ Image tagged as: ${FULL_IMAGE_NAME}"
echo ""

# Test the image locally
echo "🧪 Testing the image locally..."
echo "Starting container on port 7000..."

# Start container in background
CONTAINER_ID=$(docker run -d -p 7000:7000 ${IMAGE_NAME})

echo "Container started with ID: ${CONTAINER_ID}"
echo "Waiting for service to start..."
sleep 10

# Test health endpoint
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    
    # Test with a simple API call
    echo "🔍 Testing API endpoints..."
    echo "Health endpoint response:"
    curl -s http://localhost:7000/health | python -m json.tool
    
else
    echo "❌ Health check failed!"
    echo "Container logs:"
    docker logs ${CONTAINER_ID}
fi

# Stop the test container
echo ""
echo "🛑 Stopping test container..."
docker stop ${CONTAINER_ID}
docker rm ${CONTAINER_ID}

echo ""
echo "📦 Build Summary:"
echo "=================="
echo "Image Name: ${IMAGE_NAME}"
echo "Tagged As: ${FULL_IMAGE_NAME}"
echo "Status: Ready for deployment"
echo ""

# Ask user if they want to push to Docker Hub
echo "Would you like to push this image to Docker Hub? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo ""
    echo "🚀 Pushing to Docker Hub..."
    echo "=============================="
    
    # Login to Docker Hub (if not already logged in)
    echo "Please make sure you're logged in to Docker Hub (docker login)"
    
    # Push the image
    docker push ${FULL_IMAGE_NAME}
    
    echo "✅ Successfully pushed to Docker Hub!"
    echo ""
    echo "🌐 Your image is now available at:"
    echo "   docker pull ${FULL_IMAGE_NAME}"
    echo ""
    echo "🚀 To run from Docker Hub:"
    echo "   docker run -p 7000:7000 ${FULL_IMAGE_NAME}"
    
else
    echo ""
    echo "🏠 Local build complete. To run locally:"
    echo "   docker run -p 7000:7000 ${IMAGE_NAME}"
fi

echo ""
echo "🎉 Process completed successfully!"
echo ""
echo "📚 Usage Examples:"
echo "=================="
echo ""
echo "1. Run locally:"
echo "   docker run -p 7000:7000 ${IMAGE_NAME}"
echo ""
echo "2. Run in background:"
echo "   docker run -d -p 7000:7000 --name image-matcher ${IMAGE_NAME}"
echo ""
echo "3. Test the API:"
echo "   curl http://localhost:5000/health"
echo ""
echo "4. Compare images:"
echo "   curl -X POST http://localhost:7000/compare-images \\"
echo "     -F \"image1=@image1.jpg\" \\"
echo "     -F \"image2=@image2.jpg\""
