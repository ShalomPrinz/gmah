from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv

import src.families as families

load_dotenv()
FRONTEND_DOMAIN = getenv('FRONTEND_DOMAIN')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": FRONTEND_DOMAIN}})

@app.route('/familiesCount')
def families_count():
    return jsonify(familiesCount=families.get_count()), 200

@app.route('/families')
def query_family():
    query = request.args.get('query')
    return jsonify(families=families.search_families(query)), 200