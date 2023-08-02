system_files_folder = "system_files"
families_filename = f"{system_files_folder}/נתמכים.xlsx"
families_history_filename = f"{system_files_folder}/הסטוריית נתמכים.xlsx"

key_prop = "שם מלא"
street_prop = "רחוב"
driver_prop = "נהג"
recommender_prop = "ממליץ"
family_properties = [key_prop, street_prop, "בניין", "דירה", "קומה", "מס' בית",
                     "מס' פלאפון", driver_prop, recommender_prop, "הערות"]

exit_date_prop = "תאריך יציאה"
reason_prop = "סיבה"
history_properties = [*family_properties[:-3], recommender_prop, exit_date_prop, reason_prop]

driver_prop_index = family_properties.index(driver_prop)

date_pattern = r'^\d{4}-\d{2}-\d{2}$'
date_prop = "תאריך"
status_prop = "קיבל/ה"
report_properties = [key_prop, "אחראי", driver_prop, date_prop, status_prop]
default_date = ""
default_status = False

pdf_properties = family_properties[:-3]

managers_filename = f"{system_files_folder}/managers.json"
