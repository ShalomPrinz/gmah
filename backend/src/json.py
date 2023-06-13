import json
from os import path

class Json():
    def __init__(self, filename):
        if not path.exists(filename):
            raise FileNotFoundError(f'הקובץ {filename} לא נמצא')
        
        self.filename = filename

    def load_json(self):
        with open(self.filename) as file:
            return json.load(file)

    def update_json(self, new_json):
        try:
            with open(self.filename, 'w', encoding='utf-8') as f:
                json.dump(new_json, f, ensure_ascii=False, indent=2)
        except Exception as e:
            return e
