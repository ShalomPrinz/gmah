families_filename = "נתמכים.xlsx"
families_history_filename = "הסטוריית נתמכים.xlsx"

key_prop = "שם מלא"
driver_prop = "נהג"
recommender_prop = "ממליץ"
family_properties = [key_prop, "רחוב", "בניין", "דירה", "קומה", "מס' בית",
                     "מס' פלאפון", driver_prop, recommender_prop, "הערות"]

exit_date_prop = "תאריך יציאה"
reason_prop = "סיבה"
history_properties = [*family_properties[:-3], recommender_prop, exit_date_prop, reason_prop]

driver_prop_index = family_properties.index(driver_prop)

date_pattern = r'^\d{4}-\d{2}-\d{2}$'
date_prop = "תאריך"
status_prop = "קיבל/ה"
report_properties = [key_prop, "אחראי", driver_prop, date_prop, status_prop]

pdf_properties = family_properties[:-3]

managers_filename = "managers.json"
