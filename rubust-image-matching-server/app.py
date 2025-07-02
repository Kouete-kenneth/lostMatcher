from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import tempfile
import json
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration - Reduced limits for memory efficiency
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # Reduced to 8MB max file size
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

# Create upload directory
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_sift_features(image_path):
    """
    Extract SIFT features from an image with memory optimization
    Returns keypoints and descriptors in a serializable format
    """
    import gc
    try:
        # Read image with reduced size to save memory
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if img is None:
            raise ValueError("Could not load image")
        
        # Resize large images to reduce memory usage
        max_dimension = 1024
        if max(img.shape) > max_dimension:
            scale = max_dimension / max(img.shape)
            new_width = int(img.shape[1] * scale)
            new_height = int(img.shape[0] * scale)
            img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
        
        # Initialize SIFT detector with reduced features
        sift = cv2.SIFT_create(nfeatures=200, contrastThreshold=0.08)  # Further reduced features
        
        # Detect keypoints and compute descriptors
        keypoints, descriptors = sift.detectAndCompute(img, None)
        
        # Clear image from memory immediately
        img = None
        gc.collect()
        
        if descriptors is None or len(keypoints) == 0:
            return {
                'keypoints_count': 0,
                'keypoints': [],
                'descriptors': None,
                'image_shape': (0, 0)
            }
        
        # Only store essential keypoint data (reduce memory)
        keypoints_data = []
        for kp in keypoints[:200]:  # Limit to 200 keypoints max
            keypoints_data.append({
                'x': float(kp.pt[0]),
                'y': float(kp.pt[1]),
                'size': float(kp.size),
                'angle': float(kp.angle)
            })
        
        # Limit descriptors to match keypoints
        if len(descriptors) > 200:
            descriptors = descriptors[:200]
        
        # Convert descriptors to base64 for JSON serialization
        descriptors_b64 = base64.b64encode(descriptors.tobytes()).decode('utf-8')
        
        result = {
            'keypoints_count': len(keypoints_data),
            'keypoints': keypoints_data,
            'descriptors': descriptors_b64,
            'descriptors_shape': descriptors.shape,
            'image_shape': img.shape if img is not None else (0, 0)
        }
        
        # Clean up
        keypoints = None
        descriptors = None
        keypoints_data = None
        gc.collect()
        
        return result
        
    except Exception as e:
        # Force cleanup on error
        gc.collect()
        raise Exception(f"Feature extraction failed: {str(e)}")

def compare_features(features1, features2, ratio_threshold=0.7):
    """
    Compare two sets of SIFT features with memory optimization
    """
    import gc
    try:
        # Check for valid descriptors
        if not features1.get('descriptors') or not features2.get('descriptors'):
            return {
                'similarity_score': 0.0,
                'good_matches': 0,
                'total_matches': 0,
                'match_ratio': 0.0,
                'confidence': 'low'
            }
        
        # Validate descriptor shapes
        shape1 = features1['descriptors_shape']
        shape2 = features2['descriptors_shape']
        
        # Check if descriptor dimensions match
        if len(shape1) != len(shape2) or (len(shape1) > 1 and shape1[1] != shape2[1]):
            return {
                'similarity_score': 0.0,
                'good_matches': 0,
                'total_matches': 0,
                'match_ratio': 0.0,
                'confidence': 'low',
                'error': f'Descriptor dimension mismatch: {shape1} vs {shape2}. Features were likely extracted using different algorithms.'
            }
        
        # Decode descriptors from base64
        desc1_bytes = base64.b64decode(features1['descriptors'])
        desc2_bytes = base64.b64decode(features2['descriptors'])
        
        # Validate byte length matches expected shape
        expected_size1 = np.prod(shape1) * 4  # 4 bytes per float32
        expected_size2 = np.prod(shape2) * 4
        
        if len(desc1_bytes) != expected_size1:
            raise Exception(f"Descriptor 1 byte size mismatch: got {len(desc1_bytes)}, expected {expected_size1}")
        if len(desc2_bytes) != expected_size2:
            raise Exception(f"Descriptor 2 byte size mismatch: got {len(desc2_bytes)}, expected {expected_size2}")
        
        # Reconstruct descriptor arrays
        desc1 = np.frombuffer(desc1_bytes, dtype=np.float32).reshape(shape1)
        desc2 = np.frombuffer(desc2_bytes, dtype=np.float32).reshape(shape2)
        
        # Clear base64 data from memory
        desc1_bytes = None
        desc2_bytes = None
        gc.collect()
        
        if len(desc1) < 2 or len(desc2) < 2:
            return {
                'similarity_score': 0.0,
                'good_matches': 0,
                'total_matches': 0,
                'match_ratio': 0.0,
                'confidence': 'low'
            }
        
        # Use BruteForce matcher instead of FLANN for better memory efficiency
        matcher = cv2.BFMatcher()
        
        # Find matches with reduced k value
        matches = matcher.knnMatch(desc1, desc2, k=2)
        
        # Apply Lowe's ratio test
        good_matches = []
        for match_pair in matches:
            if len(match_pair) == 2:
                m, n = match_pair
                if m.distance < ratio_threshold * n.distance:
                    good_matches.append(m)
        
        # Calculate similarity metrics
        total_matches = len(matches)
        good_match_count = len(good_matches)
        match_ratio = good_match_count / max(len(desc1), len(desc2)) if max(len(desc1), len(desc2)) > 0 else 0
        
        # Calculate similarity score (0-100) with more conservative scoring
        similarity_score = min(100, match_ratio * 80)  # Reduced multiplier
        
        # Determine confidence level
        if good_match_count < 5:
            confidence = 'low'
        elif good_match_count < 15:
            confidence = 'medium'
        else:
            confidence = 'high'
        
        result = {
            'similarity_score': round(similarity_score, 2),
            'good_matches': good_match_count,
            'total_matches': total_matches,
            'match_ratio': round(match_ratio, 4),
            'confidence': confidence,
            'features1_count': len(desc1),
            'features2_count': len(desc2)
        }
        
        # Clean up large arrays
        desc1 = None
        desc2 = None
        matches = None
        good_matches = None
        matcher = None
        gc.collect()
        
        return result
        
    except Exception as e:
        # Force cleanup on error
        gc.collect()
        raise Exception(f"Feature comparison failed: {str(e)}")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'robust-image-matcher-simple',
        'timestamp': datetime.now().isoformat(),
        'version': '2.0.0'
    }), 200

@app.route('/extract-features', methods=['POST'])
def extract_features():
    """
    Extract SIFT features from an uploaded image with memory management
    Returns keypoints and descriptors for database storage
    """
    import gc
    filepath = None
    try:
        # Check if image was uploaded
        if 'image' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No image file provided'
            }), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({
                'success': False,
                'error': 'No file selected'
            }), 400
        
        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, bmp, tiff'
            }), 400
        
        # Save uploaded file temporarily
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        
        # Clear file object from memory
        file = None
        gc.collect()
        
        try:
            # Extract features
            features = extract_sift_features(filepath)
            
            response_data = {
                'success': True,
                'filename': filename,
                'features': features,
                'extraction_timestamp': datetime.now().isoformat(),
                'message': f'Extracted {features["keypoints_count"]} keypoints'
            }
            
            return jsonify(response_data), 200
            
        except Exception as e:
            raise e
        finally:
            # Always clean up temporary file
            if filepath and os.path.exists(filepath):
                os.remove(filepath)
            gc.collect()
            
    except Exception as e:
        # Clean up on error
        if filepath and os.path.exists(filepath):
            os.remove(filepath)
        gc.collect()
        return jsonify({
            'success': False,
            'error': f'Feature extraction failed: {str(e)}'
        }), 500

@app.route('/compare-features', methods=['POST'])
def compare_features_route():
    """
    Compare two sets of features (from extract-features endpoint)
    Input: JSON with 'features1' and 'features2' objects
    Returns: Similarity metrics
    
    Expected input format:
    {
        "features1": {output from /extract-features for first image},
        "features2": {output from /extract-features for second image}
    }
    """
    import gc
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided'
            }), 400
        
        if 'features1' not in data or 'features2' not in data:
            return jsonify({
                'success': False,
                'error': 'Both features1 and features2 are required'
            }), 400
        
        features1 = data['features1']
        features2 = data['features2']
        
        # Extract the actual features from the response structure if needed
        if 'features' in features1:
            features1 = features1['features']
        if 'features' in features2:
            features2 = features2['features']
        
        # Validate feature objects
        required_fields = ['descriptors', 'descriptors_shape', 'keypoints_count']
        for features, name in [(features1, 'features1'), (features2, 'features2')]:
            if not features:
                return jsonify({
                    'success': False,
                    'error': f'{name} is empty or invalid'
                }), 400
                
            for field in required_fields:
                if field not in features:
                    return jsonify({
                        'success': False,
                        'error': f'Missing {field} in {name}'
                    }), 400
        
        # Check if descriptors are None (no features found)
        if features1.get('descriptors') is None or features2.get('descriptors') is None:
            return jsonify({
                'success': True,
                'comparison': {
                    'similarity_score': 0.0,
                    'good_matches': 0,
                    'total_matches': 0,
                    'match_ratio': 0.0,
                    'confidence': 'low',
                    'message': 'One or both images have no detectable features'
                },
                'comparison_timestamp': datetime.now().isoformat()
            }), 200
        
        # Perform comparison
        comparison_result = compare_features(features1, features2)
        
        response_data = {
            'success': True,
            'comparison': comparison_result,
            'comparison_timestamp': datetime.now().isoformat(),
            'input_features1_count': features1.get('keypoints_count', 0),
            'input_features2_count': features2.get('keypoints_count', 0)
        }
        
        # Clean up input data
        data = None
        features1 = None
        features2 = None
        gc.collect()
        
        return jsonify(response_data), 200
        
    except Exception as e:
        # Force cleanup on error
        gc.collect()
        return jsonify({
            'success': False,
            'error': f'Feature comparison failed: {str(e)}'
        }), 500

@app.route('/compare-images', methods=['POST'])
def compare_images():
    """
    Quick comparison of two uploaded images
    Combines feature extraction and comparison in one step
    """
    try:
        # Check if both images were uploaded
        if 'image1' not in request.files or 'image2' not in request.files:
            return jsonify({
                'success': False,
                'error': 'Both image1 and image2 files are required'
            }), 400
        
        file1 = request.files['image1']
        file2 = request.files['image2']
        
        if file1.filename == '' or file2.filename == '':
            return jsonify({
                'success': False,
                'error': 'Both files must be selected'
            }), 400
        
        if not (allowed_file(file1.filename) and allowed_file(file2.filename)):
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif, bmp, tiff'
            }), 400
        
        # Save files temporarily
        filepaths = []
        try:
            for i, file in enumerate([file1, file2], 1):
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4()}_{filename}"
                filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
                file.save(filepath)
                filepaths.append(filepath)
            
            # Extract features from both images
            features1 = extract_sift_features(filepaths[0])
            features2 = extract_sift_features(filepaths[1])
            
            # Compare features
            comparison_result = compare_features(features1, features2)
            
            return jsonify({
                'success': True,
                'image1_filename': file1.filename,
                'image2_filename': file2.filename,
                'image1_features': {
                    'keypoints_count': features1['keypoints_count'],
                    'image_shape': features1['image_shape']
                },
                'image2_features': {
                    'keypoints_count': features2['keypoints_count'],
                    'image_shape': features2['image_shape']
                },
                'comparison': comparison_result,
                'processing_timestamp': datetime.now().isoformat()
            }), 200
            
        finally:
            # Clean up temporary files
            for filepath in filepaths:
                if os.path.exists(filepath):
                    os.remove(filepath)
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Image comparison failed: {str(e)}'
        }), 500

@app.errorhandler(413)
def too_large(e):
    import gc
    gc.collect()
    return jsonify({
        'success': False,
        'error': 'File too large. Maximum size is 8MB.'
    }), 413

@app.errorhandler(404)
def not_found(e):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(e):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
