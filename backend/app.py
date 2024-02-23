from flask import Flask, jsonify, request, g, make_response, Blueprint
from flask_cors import CORS
from dotenv import load_dotenv
from os import getenv, _exit
from os.path import exists

import src.managers as managers
import src.families as families
import src.month as month
import src.report as report
import src.drivers as drivers
import src.holiday as holiday

from src.results import get_result, Result

index_filename = "index.html"
assets_foldername = "assets"

load_dotenv()
DEVELOPMENT = getenv('DEVELOPMENT')
is_development_mode = True if DEVELOPMENT else False

CLIENT_ADDRESS = getenv('CLIENT_ADDRESS')

if not is_development_mode:
    if CLIENT_ADDRESS is None:
        print("CLIENT_ADDRESS is necessary in order to run this app")
        print("CLIENT_ADDRESS should be in this format: \"x.x.x.x:port\"")
        _exit(1)

client_address = "http://localhost:3000" if is_development_mode else f"http://{CLIENT_ADDRESS}"

api_blueprint = Blueprint('api', __name__, url_prefix="/api")
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": client_address}})

if not is_development_mode:
    def to_assets_path(path):
        if assets_foldername in path:
            index = path.find(assets_foldername)
            return path[index:]
        else:
            return index_filename
        
    def serve_file(path):
        if exists(f'./static/{path}'):
            return app.send_static_file(path)
        else:
            return None

    @app.route('/')
    def serve_app():
        return serve_file(index_filename)
        
    @app.route('/<path:path>')
    def serve_static_file(path):
        file = serve_file(path)
        if file is None:
            file = serve_file(to_assets_path(path))
            if file is None:
                return "Server Error: app contents cannot be served correctly"
        return file

def result_error_response(result: Result):
    return jsonify(error=result.title, description=result.description), result.status

def error_response(error: Exception):
    result = get_result(error)
    return result_error_response(result)

def boolean_arg(arg):
    return arg and arg.lower() == 'true'

@api_blueprint.before_request
def load_files():
    error, families_file = families.load_families_file()
    if error is not None:
        return error_response(error)
    g.families_file = families_file

    error, families_history_file = families.load_families_history_file()
    if error is not None:
        return error_response(error)
    g.families_history_file = families_history_file
    
    error, managers_file = managers.load_managers_file()
    if error is not None:
        return error_response(error)
    g.managers_file = managers_file

# Families

@api_blueprint.route('/familiesCount')
def families_count():
    count = families.get_count(g.families_file)
    return jsonify(familiesCount=count), 200

@api_blueprint.route('/families')
def query_families():
    query = request.args.get('query')
    search_by = request.args.get('by')
    query_result = families.search_families(g.families_file, query, search_by)
    return jsonify(families=query_result), 200

@api_blueprint.route('/families/history')
def query_families_history():
    query = request.args.get('query')
    search_by = request.args.get('by')    
    query_result = families.search_families(g.families_history_file, query, search_by)
    return jsonify(families=query_result), 200

@api_blueprint.route('/families/holiday')
def query_holiday_families():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    query = request.args.get('query')
    search_by = request.args.get('by')
    query_result = families.search_families(holiday_families_file, query, search_by)
    return jsonify(families=query_result), 200

@api_blueprint.route('/families', methods=["POST"])
def add_families():
    req_families = request.json['families']
    month_insert = request.json['month_insert']
    result = families.add_families(g.families_file, req_families)
    if result.status == 200 and month_insert:
        month.insert_families_to_active(req_families)
    return jsonify(title=result.title, description=result.description, family_name=result.family_key), result.status

@api_blueprint.route('/family', methods=["PUT"])
def update_family():
    original_name = request.json['original_name']
    family_data = request.json['family_data']
    error = families.update_family(g.families_file, original_name, family_data)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/holiday/family', methods=["PUT"])
def update_holiday_family():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    original_name = request.json['original_name']
    family_data = request.json['family_data']
    error = families.update_family(holiday_families_file, original_name, family_data)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/family/remove', methods=["DELETE"])
def remove_family():
    family_name = request.args.get('family_name')
    remove_from = request.args.get('from')
    exit_date = request.args.get('exit_date')
    reason = request.args.get('reason')
    month_remove = boolean_arg(request.args.get('month_remove'))

    origin_file = g.families_file
    if remove_from == "holiday":
        error, holiday_families_file = families.load_holiday_families_file()
        if error is not None:
            return error_response(error)
        origin_file = holiday_families_file
    
    error = families.remove_family(origin_file, g.families_history_file, family_name, exit_date, reason)
    if error is not None:
        return error_response(error)
    
    if month_remove:
        error, active_report = month.get_active_report()
        if error is not None:
            return error_response(error)
        if active_report is not None:
            error = report.remove_from_report(active_report, family_name)
            if error is not None:
                return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/family/restore', methods=["POST"])
def restore_family():
    family_name = request.json['family_name']
    error = families.restore_family(g.families_file, g.families_history_file, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/family/remove/permanent', methods=["DELETE"])
def permanent_remove_family():
    family_name = request.args.get('family_name')
    error = families.permanent_remove_family(g.families_history_file, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/family/driver/remove', methods=["DELETE"])
def remove_family_driver():
    family_name = request.args.get('family_name')
    families.remove_driver(g.families_file, family_name)
    return jsonify(), 200

@api_blueprint.route('/family/driver/add', methods=["POST"])
def add_family_driver():
    family_name = request.json['family_name']
    driver_name = request.json['driver_name']
    result = families.add_driver(g.families_file, family_name, driver_name)
    if result.status != 200:
        return result_error_response(result)
    return jsonify(title=result.title, description=result.description), result.status

@api_blueprint.route('/family/receipt/history')
def get_family_receipt_history():
    family_name = request.args.get('family_name')
    error, statuses = month.get_family_receipt_history(family_name)
    if error is not None:
        return error_response(error)
    return jsonify(statuses=statuses), 200

# Managers

@api_blueprint.route('/managers')
def get_managers():
    response_managers = managers.get_managers(g.managers_file)
    return jsonify(managers=response_managers), 200

@api_blueprint.route('/managers', methods=["POST"])
def update_managers():
    request_managers = request.json['managers']
    removed_drivers = managers.get_drivers_diff(g.managers_file, request_managers)
    families.remove_many_drivers(g.families_file, removed_drivers)
    error = managers.update_managers(g.managers_file, request_managers)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/managers/remove', methods=["DELETE"])
def remove_manager():
    manager_id = request.args.get('manager_id')
    error = managers.remove_manager(g.managers_file, manager_id)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/managers/add', methods=["POST"])
def add_manager():
    manager_name = request.json['manager_name']
    error = managers.add_manager(g.managers_file, manager_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/managers/print', methods=["PUT"])
def update_manager_print_status():
    manager_name = request.json['manager_name']
    print_status = request.json['print_status']
    managers.update_manager_print_status(g.managers_file, manager_name, print_status)
    return jsonify(), 200

@api_blueprint.route('/validate/drivers')
def validate_drivers():
    error, no_manager_drivers = report.get_no_manager_drivers(g.families_file, g.managers_file)
    if error is not None:
        return error_response(error)

    error, no_driver_families = report.get_no_driver_families(g.families_file)
    if error is not None:
        return error_response(error)

    return jsonify(no_manager_drivers=no_manager_drivers, no_driver_families=no_driver_families), 200

# Month and report

@api_blueprint.route('/generate/month', methods=["POST"])
def generate_month():
    name = request.json['name']
    override_name = request.json['override_name']
    error = month.generate_month_files(g.families_file, name, override_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/reports')
def get_reports_list():
    error, reports = month.get_reports_list()
    if error is not None:
        return error_response(error)
    return jsonify(reports=reports), 200

@api_blueprint.route('/report')
def query_report():
    report_name = request.args.get('report_name')
    query = request.args.get('query')
    search_by = request.args.get('by')

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    query_result = report.search_report(report_file, query, search_by)
    return jsonify(report=query_result), 200

@api_blueprint.route('/report/column')
def query_report_column():
    report_name = request.args.get('report_name')
    query = request.args.get('query')
    search_by = request.args.get('by')

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    query_result = report.search_report_column(report_file, query, search_by)
    return jsonify(report_column=query_result), 200

@api_blueprint.route('/report/update-family', methods=["PUT"])
def update_family_receipt_status():
    report_name = request.json['report_name']
    family_name = request.json['family_name']
    receipt = request.json['receipt']

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    result = report.update_family_receipt_status(report_file, family_name, receipt)
    if result.status != 200:
        return result_error_response(result)
    
    return jsonify(), 200

@api_blueprint.route('/report/update-driver', methods=["PUT"])
def update_driver_receipt_status():
    report_name = request.json['report_name']
    status = request.json['status']

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    result = report.update_driver_receipt_status(report_file, status)
    if result.status != 200:
        return result_error_response(result)
    
    return jsonify(), 200

@api_blueprint.route('/report/get-family')
def get_family_receipt_status():
    report_name = request.args.get('report_name')
    name = request.args.get('name')

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    status = report.get_family_receipt_status(report_file, name)    
    return jsonify(status=status)

@api_blueprint.route('/report/get-driver')
def get_driver_receipt_status():
    report_name = request.args.get('report_name')
    name = request.args.get('name')

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    status = report.get_driver_receipt_status(report_file, name)    
    return jsonify(status=status)

@api_blueprint.route('/report/completion')
def get_completions():
    report_name = request.args.get('report_name')

    error, report_file = month.load_month_report(report_name)
    if error is not None:
        return error_response(error)
    
    families = report.get_report_completion_families(report_file, g.families_file)
    return jsonify(families=families)

@api_blueprint.route('/report/completion/build', methods=["POST"])
def build_completion_page():
    month_name = request.json['month_name']
    title = request.json['title']
    families = request.json['families']
    month.generate_completion_pdf(month_name, title, g.families_file, families)
    return jsonify(), 200

@api_blueprint.route('/report/activate', methods=["PUT"])
def activate_month_report():
    report_name = request.json['report_name']
    error = month.activate_report(report_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/report/remove/family', methods=["DELETE"])
def remove_family_from_report():
    report_name = request.args.get('report_name')
    family_name = request.args.get('family_name')
    error = month.remove_family_from_report(report_name, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

# Prints

@api_blueprint.route('/print/generate', methods=["POST"])
def generate_general_printable():
    holiday_name = request.json['holiday_name']
    title = request.json['title']
    content = request.json['content']
    holiday.generate_holiday_custom_pdf(holiday_name, title, content)
    return jsonify(), 200

def get_printable_response(printable, error):
    if error is not None:
        return error_response(error)
    if printable is None:
        return jsonify(), 200

    response = make_response(printable)
    response.headers['Content-Type'] = 'application/pdf'
    response.headers['Content-Disposition'] = 'inline'
    return response

@api_blueprint.route('/print/month')
def get_month_printable_report():
    report_name = request.args.get('report_name')
    printable = request.args.get('printable')

    printable, error = month.get_printable_report(report_name, printable)
    return get_printable_response(printable, error)

@api_blueprint.route('/print/holiday')
def get_holiday_printable():
    holiday_name = request.args.get('holiday_name')
    printable = request.args.get('printable')

    printable, error = holiday.get_holiday_printable(holiday_name, printable)
    return get_printable_response(printable, error)

@api_blueprint.route('/print/month/all')
def get_month_printable_files():
    report_name = request.args.get('report_name')
    files = month.get_printable_files(report_name)    
    return jsonify(files=files), 200

@api_blueprint.route('/print/holiday/all')
def get_holiday_printable_files():
    holiday_name = request.args.get('holiday_name')
    files = holiday.get_printable_files(holiday_name)    
    return jsonify(files=files), 200

# Drivers

@api_blueprint.route('/drivers')
def get_drivers():
    app_drivers = drivers.get_drivers(g.families_file, g.managers_file)
    return jsonify(drivers=app_drivers), 200

@api_blueprint.route('/drivers/families')
def get_driver_families():
    driver_name = request.args.get('driver_name')
    families = drivers.get_driver_families(g.families_file, driver_name)
    return jsonify(families=families), 200

@api_blueprint.route('/drivers/update', methods=["PUT"])
def update_driver_name():
    original = request.json['original']
    updated = request.json['updated']
    result = drivers.update_driver_name(g.families_file, g.managers_file, original, updated)

    if result.status != 200:
        return result_error_response(result)
    return jsonify(), 200

@api_blueprint.route('/drivers/driverless')
def get_driverless_families():
    families = drivers.get_driverless_families(g.families_file)
    return jsonify(families=families), 200

@api_blueprint.route('/drivers/print', methods=["PUT"])
def update_driver_print_status():
    driver_name = request.json['driver_name']
    print_status = request.json['print_status']
    drivers.update_driver_print_status(g.managers_file, driver_name, print_status)
    return jsonify(), 200

# Holidays

@api_blueprint.route('/holiday/new', methods=["POST"])
def generate_holiday():
    holiday_name = request.json['holiday_name']
    holiday.initialize_holiday(g.families_file, holiday_name)
    return jsonify(), 200

@api_blueprint.route('/holidays')
def get_holidays_list():
    holidays = holiday.get_holidays_list()
    return jsonify(holidays=holidays), 200

@api_blueprint.route('holiday/families')
def get_holiday_regular_families():
    holiday_name = request.args.get('holiday_name')
    error, families = holiday.get_holiday_regular_families(holiday_name)
    if error is not None:
        return error_response(error)
    return jsonify(families=families), 200

@api_blueprint.route('holiday/status')
def get_holiday_families_selection():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    holiday_name = request.args.get('holiday_name')
    error, status = holiday.get_holiday_families_status(holiday_families_file, holiday_name)
    if error is not None:
        return error_response(error)
    return jsonify(status=status), 200

@api_blueprint.route('holiday/status/update', methods=["PUT"])
def update_holiday_families_selection():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    holiday_name = request.json['holiday_name']
    holiday_families = request.json['holiday_families']
    error, result = holiday.update_holiday_families_status(holiday_families_file, holiday_name, holiday_families)
    if error is not None:
        return error_response(error)

    if result.status != 200:
        return result_error_response(result)
    return jsonify(), 200

@api_blueprint.route('holiday/drivers')
def get_holiday_drivers_status():
    holiday_name = request.args.get('holiday_name')
    error, drivers = holiday.get_holiday_drivers(g.managers_file, holiday_name)
    if error is not None:
        return error_response(error)
    return jsonify(drivers=drivers), 200

@api_blueprint.route('holiday/drivers/families')
def get_holiday_driver_families():
    holiday_name = request.args.get('holiday_name')
    driver_name = request.args.get('driver_name')
    error, families = holiday.get_holiday_driver_families(holiday_name, driver_name)
    if error is not None:
        return error_response(error)
    return jsonify(families=families), 200

@api_blueprint.route('holiday/drivers/driverless')
def get_holiday_driverless_families():
    holiday_name = request.args.get('holiday_name')
    error, families = holiday.get_holiday_driverless_families(holiday_name)
    if error is not None:
        return error_response(error)
    return jsonify(families=families), 200

@api_blueprint.route('/holiday/driver/remove', methods=["DELETE"])
def remove_holiday_family_driver():
    holiday_name = request.args.get('holiday_name')
    family_name = request.args.get('family_name')
    error = holiday.remove_holiday_driver_family(holiday_name, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/holiday/driver/add', methods=["POST"])
def add_holiday_family_driver():
    holiday_name = request.json['holiday_name']
    family_name = request.json['family_name']
    driver_name = request.json['driver_name']
    error = holiday.add_holiday_driver(holiday_name, family_name, driver_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/holiday/generate/printable', methods=["POST"])
def generate_holiday_printable():
    holiday_name = request.json['holiday_name']
    holiday.generate_holiday_main_pdf(holiday_name, g.managers_file)
    return jsonify(), 200

@api_blueprint.route('/holiday/move/regular', methods=["POST"])
def move_holiday_family_to_regular():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    family_name = request.json['family_name']
    error = families.move_holiday_to_regular(g.families_file, holiday_families_file, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200

@api_blueprint.route('/families/move/holiday', methods=["POST"])
def move_regular_family_to_holiday():
    error, holiday_families_file = families.load_holiday_families_file()
    if error is not None:
        return error_response(error)

    family_name = request.json['family_name']
    error = families.move_regular_to_holiday(g.families_file, holiday_families_file, family_name)
    if error is not None:
        return error_response(error)
    return jsonify(), 200 

app.register_blueprint(api_blueprint)
