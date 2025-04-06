from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

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

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Check if the user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 409

    # Insert user into the database
    users_collection.insert_one({"email": email, "password": password})
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
    if user and user["password"] == password:
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


if __name__ == '__main__':
    app.run(debug=True)
