def format_family_header(header):
    match header:
        case "שם מלא":
            return "fullName"
        case "רחוב":
            return "street"
        case "בניין":
            return "house"
        case "דירה":
            return "apartmentNumber"
        case "קומה":
            return "floor"
        case "מס' בית":
            return "homePhone"
        case "מס' פלאפון":
            return "mobilePhone"
        case "נהג במקור":
            return "originalDriver"
        case "ממליץ":
            return "referrer"
        case "הערות":
            return "notes"
    
    return "NoSuchHeader"

def without_hyphen(string: str):
    return string.replace('-', '')

def insert_hyphen(string: str, index: int):
    return string[:index] + '-' + string[index:]
