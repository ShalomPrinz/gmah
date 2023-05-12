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
        return Result(500, "Internal Server Error", "קרתה שגיאה לא צפויה")

add_results = {
    "FAMILY_ADDED":         Result(200, "Family Added", "המשפחה נוספה בהצלחה"),
    "MISSING_FULL_NAME":    Result(400, "Missing Full Name", "לא ניתן להכניס משפחה ללא שם לרשימת הנתמכים"),
    "FAMILY_EXISTS":        Result(409, "Family Exists", "כבר קיימת משפחה עם השם הזה"),
    "PHONE_NOT_DIGITS":     Result(400, "Phone is Not Digits", "מספר הטלפון של המשפחה יכול להכיל ספרות בלבד"),
    "PHONE_WRONG_LEN":      Result(400, "Phone has Wrong Length", "מספר הטלפון של המשפחה צריך להיות באורך של 9 או 10 ספרות"),
}

@dataclass
class AddManyResult(Result):
    family_key: any

add_many_results = {
    "FAMILIES_ADDED":   AddManyResult(200, "Families Added", "המשפחות נוספו בהצלחה", None),
}

def add_many_error(result: Result, family_key):
    return AddManyResult(result.status, result.title, result.description, family_key)
