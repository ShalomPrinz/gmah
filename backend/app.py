from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv

import src.families as families
from src.results import get_result

load_dotenv()
FRONTEND_DOMAIN = getenv('FRONTEND_DOMAIN')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": FRONTEND_DOMAIN}})

@app.before_request
def load_families_file():
    error, families_file = families.open_families_file()
    if error is not None:
        result = get_result(error)
        return jsonify(error=result.title, description=result.description), result.status
    else:
        g.families_file = families_file

@app.route('/familiesCount')
def families_count():
    count = families.get_count(g.families_file)
    return jsonify(familiesCount=count), 200

@app.route('/families')
def query_family():
    query = request.args.get('query')
    search_by = request.args.get('by')
    query_result = families.search_families(g.families_file, query, search_by)
    return jsonify(families=query_result), 200

@app.route('/families', methods=["POST"])
def add_family():
    result = families.add_family(g.families_file, request.json)
    return jsonify(title=result.title, description=result.description), result.status
