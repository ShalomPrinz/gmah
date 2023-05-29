import json
from os import path

filename = "drivers.json"

class Drivers():
    def __init__(self):
        if not path.exists(filename):
            raise FileNotFoundError(f'הקובץ {filename} לא נמצא')

    def load_json(self):
        with open(filename) as file:
            return json.load(file)

def load_drivers():
    try:
        drivers = Drivers()
        return (None, drivers.load_json())
    except Exception as e:
        return (e, None)
