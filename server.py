from pickle import load
from flask import *
import numpy as np
import requests
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from flask_cors import CORS, cross_origin
import caption_it
import os

app = Flask(__name__, static_folder='./frontend/build',
            static_url_path='./frontend')
CORS(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    img = request.files['image']
    path = "./static/{}".format(img.filename)
    img.save(path)
    caption = caption_it.caption_this_image(path)
    print(caption)

    example_sent = caption
    stop_words = set(stopwords.words('english'))

    word_tokens = word_tokenize(example_sent)

    filtered_sentence = [w for w in word_tokens if not w in stop_words]

    filtered_sentence = []

    for w in word_tokens:
        if w not in stop_words:
            filtered_sentence.append(w)

    print(word_tokens)
    print(filtered_sentence)
    os.remove(path)

    return jsonify(
        msg=caption,
        tags=filtered_sentence
    )


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
