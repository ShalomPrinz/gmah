def without_hyphen(string: str):
    return string.replace('-', '')

def insert_hyphen(string: str, index: int):
    return string[:index] + '-' + string[index:]

def letter_by_index(index: int):
    '''
    Index starts at 1. To get the letter A, call the function with index = 1.
    '''
    return chr(ord('A') + index - 1)
