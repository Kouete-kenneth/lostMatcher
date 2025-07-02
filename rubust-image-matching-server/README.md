# Robust Image Matching API

A powerful REST API service for robust image matching using SIFT (Scale-Invariant Feature Transform) features and RANSAC algorithm. This service can identify similar objects across images even under different lighting conditions, scales, rotations, and viewing angles.

## Features

- **Robust Feature Detection**: Uses SIFT algorithm for scale and rotation invariant feature detection
- **Advanced Matching**: Employs FLANN-based matcher with Lowe's ratio test for optimal matches
- **RANSAC Filtering**: Removes outlier matches using geometric consistency
- **Multiple Endpoints**: Feature extraction, pairwise comparison, and batch processing
- **Comprehensive Metrics**: Detailed similarity scores, confidence levels, and metadata
- **Docker Support**: Ready-to-deploy containerized service
- **Production Ready**: Built with Flask + Gunicorn for scalability

## API Endpoints

### 1. Health Check
```
GET /health
```
Returns service status and version information.

### 2. Extract Features
```
POST /extract-features
Content-Type: multipart/form-data
Body: image (file)
```
Extracts SIFT keypoints and descriptors from an uploaded image.

**Response:**
```json
{
  "success": true,
  "keypoints_count": 1247,
  "keypoints": [...],
  "descriptors_shape": [1247, 128],
  "descriptors_b64": "base64_encoded_descriptors",
  "image_shape": [480, 640],
  "processing_timestamp": "2024-01-15T10:30:00"
}
```

### 3. Compare Images
```
POST /compare-images
Content-Type: multipart/form-data
Body: 
  image1 (file)
  image2 (file)
  min_match_count (optional, default: 8)
  ratio_threshold (optional, default: 0.75)
```
Compares two images and returns detailed similarity metrics.

**Response:**
```json
{
  "success": true,
  "similarity_score": 85.5,
  "confidence": "high",
  "match_status": "good_match",
  "inlier_matches": 42,
  "inlier_ratio": 0.68,
  "initial_matches": 62,
  "image1_features": 1247,
  "image2_features": 1089,
  "homography_found": true,
  "feature_density_1": 0.004,
  "feature_density_2": 0.0035,
  "processing_timestamp": "2024-01-15T10:35:00"
}
```

### 4. Batch Compare
```
POST /batch-compare
Content-Type: multipart/form-data
Body:
  reference (file)
  candidates (multiple files)
```
Compares one reference image against multiple candidates, returns ranked results.

## Similarity Scoring

The API provides a comprehensive scoring system:

- **Similarity Score**: 0-100 scale based on inlier count and ratio
- **Confidence Levels**: very_low, low, medium, high, very_high
- **Match Status**: excellent_match, good_match, moderate_match, weak_match, poor_match

## Installation and Usage

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd robust-image-matching-server
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The API will be available at `http://localhost:5000`

### Docker Deployment

1. Build the Docker image:
```bash
docker build -t robust-image-matcher .
```

2. Run the container:
```bash
docker run -p 5000:5000 robust-image-matcher
```

### Docker Hub Deployment

1. Tag the image:
```bash
docker tag robust-image-matcher yourusername/robust-image-matcher:latest
```

2. Push to Docker Hub:
```bash
docker push yourusername/robust-image-matcher:latest
```

## Configuration

Environment variables:
- `PORT`: Server port (default: 5000)
- `FLASK_ENV`: Environment mode (production/development)

## Performance Characteristics

- **Lighting Invariance**: Robust to significant lighting changes
- **Scale Invariance**: Handles 10x+ scale differences
- **Rotation Invariance**: Full 360° rotation support
- **Perspective Changes**: Moderate viewpoint variations
- **Processing Speed**: ~200ms for typical image pair (1MP images)
- **Memory Usage**: ~100-200MB per worker process

## API Usage Examples

### Python Example
```python
import requests

# Compare two images
with open('image1.jpg', 'rb') as f1, open('image2.jpg', 'rb') as f2:
    response = requests.post(
        'http://localhost:5000/compare-images',
        files={
            'image1': f1,
            'image2': f2
        },
        data={
            'min_match_count': 10,
            'ratio_threshold': 0.8
        }
    )
    
result = response.json()
print(f"Similarity: {result['similarity_score']:.1f}%")
print(f"Confidence: {result['confidence']}")
```

### cURL Example
```bash
curl -X POST http://localhost:5000/compare-images \
  -F "image1=@/path/to/image1.jpg" \
  -F "image2=@/path/to/image2.jpg" \
  -F "min_match_count=8"
```

## Supported Image Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- BMP (.bmp)
- TIFF (.tiff)

Maximum file size: 16MB per image

## Error Handling

The API provides comprehensive error responses:

```json
{
  "success": false,
  "error": "Detailed error message",
  "match_status": "error"
}
```

## Performance Tips

1. **Image Size**: Resize images to 800-1200px width for optimal speed/accuracy balance
2. **Batch Processing**: Use `/batch-compare` for multiple comparisons against one reference
3. **Parameter Tuning**: Adjust `ratio_threshold` (0.6-0.8) and `min_match_count` (5-15) based on use case
4. **Preprocessing**: Ensure good image quality and contrast for best results

## Technical Details

- **Algorithm**: SIFT + FLANN + RANSAC
- **Feature Descriptor**: 128-dimensional SIFT vectors
- **Matching Strategy**: K-nearest neighbors (k=2) with ratio test
- **Geometric Verification**: Homography estimation with RANSAC
- **Framework**: Flask with Gunicorn WSGI server
- **Dependencies**: OpenCV, NumPy, Flask

## License

MIT License - See LICENSE file for details
