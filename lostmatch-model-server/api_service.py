# lostmatch-model-server/api_service.py

    # api_service.py
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import torch
import os

app = Flask(__name__)

# Define the path where the model is saved
model_path = "./trained_model"

# Load the model (load it once when the service starts)
try:
    model = SentenceTransformer(model_path)
    print(f"Sentence Transformer model loaded from {model_path}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None # Handle the case where the model fails to load

@app.get("/health")
def health():
    return {"status": "ok"}

@app.route('/compare_items', methods=['POST'])
def compare_items():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    data = request.get_json()
    if not data or 'description1' not in data or 'description2' not in data:
        return jsonify({"error": "Invalid input. Provide 'description1' and 'description2'."}), 400

    text1 = data['description1']
    text2 = data['description2']

    try:
        # Encode the texts
        embeddings1 = model.encode([text1], convert_to_tensor=True)
        embeddings2 = model.encode([text2], convert_to_tensor=True)

        # Compute cosine similarity
        cosine_score = torch.nn.functional.cosine_similarity(embeddings1, embeddings2).item()

        return jsonify({"similarity": cosine_score})

    except Exception as e:
        return jsonify({"error": f"An error occurred during processing: {e}"}), 500

if __name__ == '__main__':
    # Production configuration
    app.run(host='0.0.0.0', port=8000, debug=False)