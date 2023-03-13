from flask import Flask, jsonify, request
from flask_cors import CORS
from brain import Brain

app = Flask(__name__)
CORS(app)

brain = Brain()

@app.route('/upload/image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found'}), 400
    args = request.args
    model = args.get('model', 'GPT')

    image_file_stream = request.files['image'].stream
    try:
        caption = brain.process(image_file_stream, model)
        if caption is None:
            return jsonify({'Unable to generate captions': str(e)}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

    return jsonify({'captions': caption}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=20438)