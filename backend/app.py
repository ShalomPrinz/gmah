from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv

from src.families import get_count

load_dotenv()
FRONTEND_DOMAIN = getenv('FRONTEND_DOMAIN')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": FRONTEND_DOMAIN}})

@app.route('/familiesCount')
def families_count():
    return jsonify(familiesCount=get_count()), 200