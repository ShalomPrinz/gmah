from flask import Flask, jsonify, request, g
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv

import src.managers as managers
import src.families as families
import src.month as month

from src.results import get_result, Result

load_dotenv()
FRONTEND_DOMAIN = getenv('FRONTEND_DOMAIN')

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": FRONTEND_DOMAIN}})

def result_error_response(result: Result):
    return jsonify(error=result.title, description=result.description), result.status

def error_response(error: Exception):
    result = get_result(error)
    return result_error_response(result)

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

@app.route('/family/remove', methods=["DELETE"])
def remove_family():
    family_name = request.args.get('family_name')
    exit_date = request.args.get('exit_date')
    reason = request.args.get('reason')
    error = families.remove_family(g.families_file, family_name, exit_date, reason)
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

@app.route('/managers/remove', methods=["DELETE"])
def remove_manager():
    manager_id = request.args.get('manager_id')
    error = managers.remove_manager(g.managers_file, manager_id)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@app.route('/managers/add', methods=["POST"])
def add_manager():
    manager_name = request.json['manager_name']
    error = managers.add_manager(g.managers_file, manager_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@app.route('/validate/drivers')
def validate_drivers():
    error, no_manager_drivers = month.get_no_manager_drivers()
    if error is not None:
        return error_response(error)

    error, no_driver_families = month.get_no_driver_families()
    if error is not None:
        return error_response(error)

    return jsonify(no_manager_drivers=no_manager_drivers, no_driver_families=no_driver_families), 200

@app.route('/generate/month', methods=["POST"])
def generate_month():
    name = request.json['name']
    override_name = request.json['override_name']
    error = month.generate_month_report(name, override_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@app.route('/reports')
def get_reports_list():
    reports = month.get_reports_list()
    return jsonify(reports=reports), 200

@app.route('/report')
def query_report():
    report_name = request.args.get('report_name')
    query = request.args.get('query')
    search_by = request.args.get('by')

    error, report_file = month.load_report_file(report_name)
    if error is not None:
        return error_response(error)
    
    query_result = month.search_report(report_file, query, search_by)
    return jsonify(report=query_result), 200

@app.route('/report/column')
def query_report_column():
    report_name = request.args.get('report_name')
    query = request.args.get('query')
    search_by = request.args.get('by')

    error, report_file = month.load_report_file(report_name)
    if error is not None:
        return error_response(error)
    
    query_result = month.search_report_column(report_file, query, search_by)
    return jsonify(report_column=query_result), 200

@app.route('/report/update', methods=["PUT"])
def update_receipt_status():
    report_name = request.json['report_name']
    family_name = request.json['family_name']
    receipt = request.json['receipt']

    error, report_file = month.load_report_file(report_name)
    if error is not None:
        return error_response(error)
    
    result = month.update_receipt_status(report_file, family_name, receipt)
    if result.status != 200:
        return result_error_response(result)
    
    return jsonify(), 200

@app.route('/report/get')
def get_receipt_status():
    report_name = request.args.get('report_name')
    family_name = request.args.get('family_name')

    error, report_file = month.load_report_file(report_name)
    if error is not None:
        return error_response(error)
    
    receipt_status = month.get_receipt_status(report_file, family_name)
    return jsonify(receipt_status=receipt_status)