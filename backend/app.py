from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB Connection (uses environment variable for Atlas or defaults to localhost)
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGODB_URI)

db = client.test_swe_database  # Replace with your database name
todos = db.todos

@app.route('/api/todos')
def get_todos():
    return jsonify(list(todos.find()))

@app.route('/api/testdb')
def test_db():
    try:
        db.command('ping')  # Pings the database to check connection
        return jsonify({"status": "Connected to test_swe_database!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return "Hello World", 200

if __name__ == '__main__':
    app.run(debug=True)
