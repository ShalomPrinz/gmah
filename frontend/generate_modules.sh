#!/bin/bash

# Data Preparation
family_id_prop="שם מלא"
family_attributes=([0]=$family_id_prop [1]="רחוב" [2]="בניין" [3]="דירה" [4]="קומה" [5]="מס' בית" [6]="מס' פלאפון" [7]="נהג" [8]="ממליץ" [9]="הערות")
add_family_exclude="7 9"
families_table_exclude="9"
holiday_families_exclude="7"

history_family_attributes=("${family_attributes[@]:0:7}")
history_family_attributes+=( "ממליץ" "תאריך יציאה" "סיבה" )

holiday_select_family_attributes=([0]=$family_id_prop [1]="ממליץ")

report_date_prop="תאריך"
report_receive_prop="קיבל/ה"
report_columns=([0]=$family_id_prop [1]="אחראי" [2]="נהג" [3]=$report_date_prop [4]=$report_receive_prop)
report_completion_columns=([0]=$family_id_prop [1]="נהג" [2]="רחוב")
build_completion_exclude="1"

family_receipt_history_attributes=([0]="חודש" [1]=$report_date_prop [2]=$report_receive_prop)

# Path Preparation

dir_path="src/modules/"
index_file="${dir_path}index.ts"

output_filename="families"
output_file="${dir_path}${output_filename}.ts"
echo "" > $output_file
index_exports=""
index_type_exports=""

reports_filename="reports"
reports_file="${dir_path}${reports_filename}.ts"
echo "" > $reports_file
report_exports=""
report_type_exports=""

# Families File

# Replaces ' with $, to prevent react-hook-form key error
function prepare_path {
    local value=$1
    local path=$(echo "$value" | tr "'" "$")
    echo "$path"
}

function add_families_array {
    local var_name=$1
    local excludes=$2
    shift 2
    local attrs=("$@")
    echo "export const $var_name = " >> $output_file

    local var_text="["
    for idx in ${!attrs[@]}; do
        if [[ ! " $excludes " =~ " $idx " ]]; then
            var_text+='{id: '$idx', 'path': "'${attrs[$idx]}'"},'
        fi
    done
    var_text+="]"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

function add_labeled_families_array {
    local var_name=$1
    local excludes=$2
    echo "export const $var_name = " >> $output_file

    local var_text="["
    for idx in ${!family_attributes[@]}; do
        if [[ ! " $excludes " =~ " $idx " ]]; then
            value="${family_attributes[$idx]}"
            path=$(prepare_path "$value")
            var_text+='{id: '$idx', label: "'$value'", path: "'$path'"'
            if [[ "$var_name" =~ ^edit.* && "$value" == "הערות" ]]; then
                var_text+=', doubleSize: true'
            fi
            var_text+='},'
        fi
    done
    var_text+="]"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

# Edit Family
add_labeled_families_array "editFamilyInputs" ""

# Edit Holiday Family
add_labeled_families_array "editHolidayFamilyInputs" "$holiday_families_exclude"

# Add Families
add_labeled_families_array "addFamilyHeaders" "$add_family_exclude"

# Families Table
add_families_array "familiesTableHeaders" "$families_table_exclude" "${family_attributes[@]}"

# Families History Table
add_families_array "familiesHistoryTableHeaders" "" "${history_family_attributes[@]}"

# Holiday Families Table
add_families_array "holidayFamiliesTableHeaders" "$holiday_families_exclude" "${family_attributes[@]}"

# Holiday Families Selection Table
add_families_array "holidayFamiliesSelectionTableHeaders" "" "${holiday_select_family_attributes[@]}"

# Family Receipt History Table
add_families_array "familyReceiptHistoryHeaders" "" "${family_receipt_history_attributes[@]}"

function write_family_properties {
    local var_name="familyProperties"
    echo "export const $var_name = " >> $output_file

    local var_text="["
    for idx in ${!family_attributes[@]}; do
        var_text+='"'${family_attributes[$idx]}'",'
    done
    var_text+="]"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

write_family_properties

function write_default_family {
    local var_name="defaultFamily"
    echo "export const $var_name = " >> $output_file

    local var_text="{"
    for idx in ${!family_attributes[@]}; do
        path=$(prepare_path "${family_attributes[$idx]}")
        var_text+='"'$path'": "",'
    done
    var_text+="}"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

write_default_family

function write_family_type {
    local var_name=$1
    local regular=$2
    echo "export type $var_name = " >> $output_file

    local var_text="{"
    for idx in ${!family_attributes[@]}; do
        value="${family_attributes[$idx]}"
        if [ "$regular" = true ]; then
            var_text+='"'$value'": string;'
        else
            var_text+='"'$(prepare_path "$value")'": string;'
        fi
    done
    var_text+="}"

    echo -e "$var_text\n" >> $output_file
    index_type_exports+="$var_name,"
}

write_family_type "Family" true
write_family_type "FormFamily" false

function write_special_family_type {
    local var_name=$1
    shift 1
    local attrs=("$@")
    echo "export type $var_name = " >> $output_file

    local var_text="{"
    for idx in ${!attrs[@]}; do
        var_text+='"'${attrs[$idx]}'": string;'
    done
    var_text+="}"

    echo -e "$var_text\n" >> $output_file
    index_type_exports+="$var_name,"
}

write_special_family_type "HolidaySelectFamily" "${holiday_select_family_attributes[@]}"

# Family ID Prop
fip_name="familyIdProp"
echo "export const $fip_name = \"$family_id_prop\"" >> $output_file
index_exports+="$fip_name"

# Reports File

function add_report_headers {
    local var_name=$1
    local excludes=$2
    shift 2
    local attrs=("$@")
    echo "export const $var_name = " >> $reports_file

    local var_text="["
    for idx in ${!attrs[@]}; do
        if [[ ! " $excludes " =~ " $idx " ]]; then
            var_text+='{id: '$idx', 'path': "'${attrs[$idx]}'"},'
        fi
    done
    var_text+="]"

    echo -e "$var_text\n" >> $reports_file
    report_exports+="$var_name,"
}

# Report Table
add_report_headers "reportTableHeaders" "" "${report_columns[@]}"

# Report Completion Table
add_report_headers "reportCompletionHeaders" "" "${report_completion_columns[@]}"

# Report Completion Build Table
add_report_headers "reportCompletionBuilder" "$build_completion_exclude" "${report_completion_columns[@]}"

function write_family_completion_type {
    var_name="CompletionFamily"
    echo "export type $var_name = " >> $reports_file

    local var_text="{"
    for idx in ${!report_completion_columns[@]}; do
        value="${report_completion_columns[$idx]}"
        var_text+='"'$value'": string;'
    done
    var_text+="}"

    echo -e "$var_text\n" >> $reports_file
    report_type_exports+="$var_name,"
}

write_family_completion_type

# Report Receive Prop
rrp_name="reportReceiveProp"
echo "export const $rrp_name = \"$report_receive_prop\"" >> $reports_file
report_exports+="$rrp_name,"

# Report Date Prop
rdp_name="reportDateProp"
echo "export const $rdp_name = \"$report_date_prop\"" >> $reports_file
report_exports+="$rdp_name"

# Index File

# Save schemas exports, which are external to this script
schemas_exports=$(awk '/export/{rec=""; f=1} f{rec = rec $0 RS} END{printf "%s", rec}' "$index_file")

# Write families exports to index
families_export_declaration='export { '$index_exports' } from "./'$output_filename'"'
echo -e "$families_export_declaration\n" > $index_file

# Write reports exports to index
reports_export_declaration='export { '$report_exports' } from "./'$reports_filename'"'
echo -e "$reports_export_declaration\n" >> $index_file

# Write families type exports to index
families_type_export_declaration='export type { '$index_type_exports' } from "./'$output_filename'"'
echo -e "$families_type_export_declaration\n" >> $index_file

# Write reports type exports to index
reports_type_export_declaration='export type { '$report_type_exports' } from "./'$reports_filename'"'
echo -e "$reports_type_export_declaration\n" >> $index_file

# Write schemas exports to index
echo $schemas_exports >> $index_file

# Lint
npx eslint --ext ts src/modules --fix
