def without_hyphen(string: str):
    return string.replace('-', '')

def insert_hyphen(string: str, index: int):
    return string[:index] + '-' + string[index:]
