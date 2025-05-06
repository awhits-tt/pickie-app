import os
import secret_store

# API keys stored securely in secrets.py
WHISPER_API_KEY = secret_store.WHISPER_API_KEY
OPENAI_API_KEY = secret_store.OPENAI_API_KEY
OPENROUTER_API_KEY = secret_store.OPENROUTER_API_KEY

# OpenRouter settings (defaults can be overridden via environment)
OPENROUTER_API_BASE = os.getenv("OPENROUTER_API_BASE", "https://openrouter.ai/api/v1")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "gpt-3.5-turbo")

# Secret key for Flask sessions
SECRET_KEY = secret_store.SECRET_KEY

# Path to dummy dataset (JSON file)
BASEDIR = os.path.abspath(os.path.dirname(__file__))
DATASET_PATH = os.path.join(BASEDIR, "data", "dummy_recommendations.json")
