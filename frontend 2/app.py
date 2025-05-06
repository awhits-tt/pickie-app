import os
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_session import Session
import requests
import openai
from openai import OpenAI
import json
import traceback

import config


# Initialize Whisper client
whisper_client = OpenAI(api_key=config.WHISPER_API_KEY)
whisper_client.api_base = "https://api.openai.com/v1"

# Initialize OpenRouter client
router_client = OpenAI(api_key=config.OPENROUTER_API_KEY)
router_client.api_base = config.OPENROUTER_API_BASE

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = config.SECRET_KEY
# Use filesystem-based sessions (alternatively redis)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Configure OpenAI keys
# (Using whisper_client and router_client instead of global openai.api_key)

@app.route("/")
def landing():
    return render_template("landing.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/api/transcribe", methods=["POST"])
def transcribe_audio():
    # Receive audio file
    audio_file = request.files.get("audio")
    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    # Call Whisper API via whisper_client
    audio_bytes = audio_file.read()
    transcription = whisper_client.audio.transcriptions.create(
        file=(audio_file.filename, audio_bytes, audio_file.mimetype),
        model="whisper-1"
    )
    text = transcription.text
    return jsonify({"text": text})

@app.route("/api/process", methods=["POST"])
def process_text():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Call GPT to extract features
    system_prompt = (
        "You are an assistant that extracts the following features from movie descriptions or user input: "
        "sentiment (positive/neutral/negative), genre (one or two genres), "
        "mood (brief mood descriptor), length (short/medium/long). "
        "Output strictly as JSON with keys: sentiment, genre, mood, length."
    )
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": text}
    ]
    # Use OpenAI GPT for feature extraction
    client = OpenAI(api_key=config.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0
    )
    content = response.choices[0].message.content
    try:
        features = json.loads(content)
    except json.JSONDecodeError:
        return jsonify({"error": "Failed to parse features JSON", "raw": content}), 500

    # Store features and raw text in session for later steps
    session["features"] = features
    session["raw_text"] = text
    return jsonify(features)

@app.route("/visualization")
def visualization():
    features = session.get("features")
    raw_text = session.get("raw_text")
    if not features:
        return redirect(url_for("chat"))
    return render_template("visualization.html", features=features, raw=raw_text)

@app.route("/api/confirm", methods=["POST"])
def confirm_features():
    data = request.get_json()
    features = data.get("features")
    if not features:
        return jsonify({"error": "No features provided"}), 400
    session["features"] = features
    # Append plain-text summary to raw_text for recommendation API
    raw = session.get("raw_text", "")
    raw += f" Sentiment: {features.get('sentiment', '')}; Genre: {features.get('genre', '')}; Mood: {features.get('mood', '')}; Length: {features.get('length', '')}."
    session["raw_text"] = raw
    return jsonify({"status": "ok"})

@app.route("/review")
def review():
    features = session.get("features")
    if not features:
        return redirect(url_for("chat"))
    return render_template("review.html", features=features)

@app.route("/api/recommend")
def recommend():
    raw = session.get("raw_text")
    if not raw:
        return jsonify({"error": "No input text found"}), 400
    try:
        ext = requests.post("http://127.0.0.1:5000/recommend", json={"query": raw})
        ext.raise_for_status()
        return jsonify(ext.json())
    except Exception as e:
        return jsonify({"error": "External recommendation failed", "details": str(e)}), 500

@app.route("/results")
def results():
    raw = session.get("raw_text", "")
    return render_template("results.html", raw_text=raw)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5002, debug=True)
