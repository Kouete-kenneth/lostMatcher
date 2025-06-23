# lostmatch-model-server/image-match-api.py

from flask import Flask, request, jsonify
import numpy as np
import cv2
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

def process_image(image_bytes: bytes):
    npimg = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError("Invalid image data")
    img = cv2.resize(img, (512, 512))
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img

def serialize_keypoints(keypoints):
    return [
        {
            "pt": kp.pt,
            "size": kp.size,
            "angle": kp.angle,
            "response": kp.response,
            "octave": kp.octave,
            "class_id": kp.class_id,
        }
        for kp in keypoints
    ]

def deserialize_keypoints(kp_list):
    return [
        cv2.KeyPoint(
            x=kp["pt"][0],
            y=kp["pt"][1],
            _size=kp["size"],
            _angle=kp["angle"],
            _response=kp["response"],
            _octave=kp["octave"],
            _class_id=kp["class_id"],
        )
        for kp in kp_list
    ]

@app.route("/extract-features", methods=["POST"])
def extract_features():
    try:
        if 'file' not in request.files:
            return jsonify({"detail": "No file part"}), 400
        file = request.files['file']
        print(f"Received file: {file.filename}")
        image_bytes = file.read()
        img = process_image(image_bytes)
        orb = cv2.ORB_create(nfeatures=500)
        keypoints, descriptors = orb.detectAndCompute(img, None)
        if descriptors is None:
            descriptors = []
        return jsonify({
            "keypoints": serialize_keypoints(keypoints),
            "descriptors": descriptors.tolist() if len(descriptors) else []
        })
    except Exception as e:
        return jsonify({"detail": str(e)}), 400

@app.route("/compare-features", methods=["POST"])
def compare_features():
    try:
        data = request.get_json()
        keypoints1 = data.get("keypoints1", [])
        descriptors1 = data.get("descriptors1", [])
        keypoints2 = data.get("keypoints2", [])
        descriptors2 = data.get("descriptors2", [])
        desc1 = np.array(descriptors1, dtype=np.uint8)
        desc2 = np.array(descriptors2, dtype=np.uint8)
        if len(desc1) == 0 or len(desc2) == 0:
            return jsonify({"similarity": 0.0, "matches": 0})
        bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
        matches = bf.match(desc1, desc2)
        matches = sorted(matches, key=lambda x: x.distance)
        good_matches = [m for m in matches if m.distance < 50]
        similarity = len(good_matches) / min(len(desc1), len(desc2))
        return jsonify({
            "similarity": similarity,
            "matches": len(good_matches)
        })
    except Exception as e:
        return jsonify({"detail": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
