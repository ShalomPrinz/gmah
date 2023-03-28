from dataclasses import dataclass

@dataclass
class Result:
    status: int
    title: str
    description: str

def get_result(exception):
    '''
    Use this function to get the result out of an exception
    '''
    if hasattr(exception, "result") and isinstance(exception.result, Result):
        return exception.result
    else:
        return Result(500, "INTERNAL_SERVER_ERROR", "קרתה שגיאה לא צפויה")

class FileResourcesMissingError(Exception):
    '''
    File doesn't contain critical resources.
    '''
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "FILE_RESOURCE_MISSING", description)

class FileNotFoundError(Exception):
    '''
    File not found.
    '''
    def __init__(self, description):
        super().__init__()
        self.result = Result(404, "FILE_NOT_FOUND", description)