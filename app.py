from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from flask_cors import CORS  # Added for CORS
from dotenv import load_dotenv  # For .env file
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return render_template("index.html")  

def setup_gemini(api_key):
    genai.configure(api_key=api_key)
    return genai.GenerativeModel("gemini-1.5-flash")  # Use latest model

api_key = os.getenv("GEMINI_API_KEY")  
model = setup_gemini(api_key)

history = [
    {"role": "user", "parts": [
        "You are a helpful AI assistant specialized in healthcare. Keep responses concise and informative. "
        "When the user communicates in English, respond in English unless they ask for Hindi."
        "When the user communicates in Hindi, respond only in Hindi. "
        "Remember, do not ever suggest any medicine, ask users to visit a doctor for medicines. "
        "You are only supposed to help with information related to what the user is asking. "
        "You will not entertain any query that is not related to healthcare."
    ]}
]

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message")
    
    if not user_input:
        return jsonify({"error": "No message provided"}), 400
    
    history.append({"role": "user", "parts": [user_input]})
    response = model.generate_content(history)
    history.append({"role": "model", "parts": [response.text]})
    
    return jsonify({"response": response.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
