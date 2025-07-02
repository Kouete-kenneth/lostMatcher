# Memory management and error handling improvements for app.py
import gc
import psutil
import logging
from functools import wraps

# Add this after the existing imports
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def cleanup_memory(func):
    """Decorator to force garbage collection after heavy operations"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            # Force garbage collection after OpenCV operations
            gc.collect()
            return result
        except Exception as e:
            gc.collect()  # Cleanup on error too
            raise e
    return wrapper

def log_memory_usage():
    """Log current memory usage"""
    process = psutil.Process()
    memory_mb = process.memory_info().rss / 1024 / 1024
    logger.info(f"Memory usage: {memory_mb:.2f} MB")

# Add these improvements to the extract_features route:
@app.route('/extract-features', methods=['POST'])
@cleanup_memory
def extract_features():
    """
    Extract SIFT keypoints and descriptors from an uploaded image
    """
    filepath = None
    try:
        log_memory_usage()
        
        # Check if image file is present
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
        
        # Save the uploaded file
        filepath = save_uploaded_file(file)
        if not filepath:
            return jsonify({
                'success': False,
                'error': 'Invalid file type. Allowed types: png, jpg, jpeg, gif, bmp, tiff'
            }), 400
        
        # Create a new matcher instance for each request to avoid memory accumulation
        request_matcher = ImageMatcher()
        
        # Extract features
        result = request_matcher.extract_features(filepath)
        
        # Explicit cleanup
        del request_matcher
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"Feature extraction error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Feature extraction failed: {str(e)}'
        }), 500
    finally:
        # Always clean up the uploaded file
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except Exception as e:
                logger.warning(f"Failed to remove file {filepath}: {e}")
        log_memory_usage()
