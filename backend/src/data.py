families_filename = "נתמכים.xlsx"

key_prop = "שם מלא"
driver_prop = "נהג"
family_properties = [key_prop, "רחוב", "בניין", "דירה", "קומה", "מס' בית",
                     "מס' פלאפון", driver_prop, "ממליץ", "הערות"]

driver_prop_index = family_properties.index(driver_prop)

date_prop = "תאריך"
status_prop = "קיבל/ה"
report_properties = [key_prop, "אחראי", driver_prop, date_prop, status_prop]

pdf_properties = family_properties[:-3]

search_column_prop = "title"

managers_filename = "managers.json"
