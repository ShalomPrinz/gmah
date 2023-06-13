from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv

import src.managers as managers
import src.families as families
from src.results import get_result

load_dotenv()
FRONTEND_DOMAIN = getenv('FRONTEND_DOMAIN')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": FRONTEND_DOMAIN}})

def error_response(error: Exception):
    result = get_result(error)
    return jsonify(error=result.title, description=result.description), result.status

@app.before_request
def load_files():
    error, families_file = families.load_families_file()
    if error is not None:
        return error_response(error)
    g.families_file = families_file
    
    error, managers_file = managers.load_managers_file()
    if error is not None:
        return error_response(error)
    g.managers_file = managers_file

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
def add_families():
    result = families.add_families(g.families_file, request.json)
    return jsonify(title=result.title, description=result.description, family_name=result.family_key), result.status

@app.route('/family', methods=["PUT"])
def update_family():
    original_name = request.json['original_name']
    family_data = request.json['family_data']
    error = families.update_family(g.families_file, original_name, family_data)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@app.route('/managers')
def get_managers():
    app_managers = managers.get_managers(g.managers_file)
    return jsonify(managers=app_managers), 200

@app.route('/managers', methods=["POST"])
def update_managers():
    app_managers = request.json['managers']
    error = managers.update_managers(g.managers_file, app_managers)
    if error is not None:
        return error_response(error)
    return jsonify(), 200
