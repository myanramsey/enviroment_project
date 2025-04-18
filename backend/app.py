from flask import Flask, jsonify, request, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import re
from datetime import datetime
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Make Flask's sessions encrypt cookies with this key
#app.secret_key = os.environ.get('SECRET_KEY', 'unsafe-key-blah-blah-blah')
app.secret_key = os.environ['SECRET_KEY']

bcrypt = Bcrypt(app)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

client = MongoClient('mongodb://localhost:27017/')
try:
    client.admin.command('ping')
    print("MongoDB is connected!")
except Exception as e:
    print(f"MongoDB connection failed: {e}")

# Creating simple user 
db = client['test_swe_database']
users_collection = db['users']
# create one user for test :)
# user = {
#     "email": "example_user",
#     "password": "123"  # Always hash passwords before storing
# }
# users_collection.insert_one(user)
# print(db.list_collection_names())


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')  # Store plaintext password
    #results = {}

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Stronger passwords
    pwd_re = re.compile(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$')
    if not pwd_re.match(password):
        return jsonify({"error": "Password must be at least 8 chars long, "
                        "include uppercase, lowercase, number, and special char."}), 400

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409

    # Insert user into the database (SECURELY)
    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    users_collection.insert_one({"email": email, "password": pw_hash, "quiz_history": []})
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')  # Compare plaintext password

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find the user in the database
    user = users_collection.find_one({"email": email})
    if user and bcrypt.check_password_hash(user["password"], password):
        session.clear()
        session['email'] = email
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/testdb')
def test_db():
    try:
        client.admin.command('ping')  # Pings the database to check connection
        return jsonify({
            "status": "Connected",
            "database": db.name,
            "collections": db.list_collection_names()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save_results', methods=['POST'])
def save_results():

    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.json
    #email = data.get('email')  # Identify user by email or user ID
    results = data.get('results')  # The quiz results object

    if not results:
        return jsonify({"error": "Email and results are required"}), 400

    # Save the results in a new collection or embed in user document
    users_collection.update_one(
        {"email": session['email']},
        {"$push": {
            "quiz_history": {
                "results": results,
                "timestamp": datetime.utcnow()
            }
        }}
        #upsert=False
    )
    return jsonify({"message": "Results saved successfully"}), 200

#LOGOUT
@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200

# QUIZ HISTORY
@app.route('/api/quiz_history', methods=['GET'])
def quiz_history():
    if 'email' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    user = users_collection.find_one(
        {"email": session['email']},
        {"quiz_history": {"$slice": -5}, "_id": 0} # to pull only last 5 entries from quiz_history
    )

    history = user.get('quiz_history', [])
    # So the newest is pulled first
    history.reverse()
    return jsonify(history), 200

if __name__ == '__main__':
    app.run(debug=True)
