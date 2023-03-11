from flask import Flask
from families import get_count

app = Flask(__name__)

@app.route('/familiesCount')
def families_count():
    return get_count()