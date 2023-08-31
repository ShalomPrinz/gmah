from src.results import Result

class FileResourcesMissingError(Exception):
    '''
    File doesn't contain critical resources.
    '''
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "File Resource Missing", description)

class FileNotFoundError(Exception):
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "File Not Found", description)

class FamilyNotFoundError(Exception):
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "Family Not Found", description)

class FileAlreadyExists(Exception):
    def __init__(self, description):
        super().__init__()
        self.result = Result(409, "File Already Exists", description)

class ActiveReportNotFound(Exception):
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "Active Report Not Found", description)
