from flask import Flask
app = Flask(__name__)

@app.route('/')
def app_entry():
    return 'Welcome to app entry'