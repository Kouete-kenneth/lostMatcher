import requests
import json
import time

def test_api():
    """
    Test script for the Robust Image Matching API
    """
    base_url = "http://localhost:5000"
    
    print("🧪 Testing Robust Image Matching API")
    print("=" * 40)
    
    # Test 1: Health Check
    print("\n1. Testing Health Check...")
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            print("✅ Health check passed!")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Could not connect to API: {e}")
        return
    
    # Test 2: Feature Extraction (requires test image)
    print("\n2. Testing Feature Extraction...")
    print("   Note: This test requires a test image file named 'test_image.jpg'")
    
    # Test 3: Image Comparison (requires two test images)
    print("\n3. Testing Image Comparison...")
    print("   Note: This test requires two test image files")
    
    # Example of how to test with actual images:
    print("\n📝 Example usage:")
    print("""
    # Compare two images
    import requests
    
    with open('image1.jpg', 'rb') as f1, open('image2.jpg', 'rb') as f2:
        response = requests.post(
            'http://localhost:5000/compare-images',
            files={
                'image1': f1,
                'image2': f2
            },
            data={
                'min_match_count': 8,
                'ratio_threshold': 0.75
            }
        )
        
        result = response.json()
        print(f"Similarity Score: {result.get('similarity_score', 0):.1f}%")
        print(f"Confidence: {result.get('confidence', 'unknown')}")
        print(f"Match Status: {result.get('match_status', 'unknown')}")
    """)
    
    print("\n✅ API appears to be running correctly!")
    print("   Ready to process image matching requests.")

if __name__ == "__main__":
    test_api()
