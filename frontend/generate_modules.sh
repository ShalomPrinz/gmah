#!/bin/bash

# Preparation
family_id_prop="שם מלא"
family_attributes=([0]=$family_id_prop [1]="רחוב" [2]="בניין" [3]="דירה" [4]="קומה" [5]="מס' בית" [6]="מס' פלאפון" [7]="נהג" [8]="נהג במקור" [9]="ממליץ" [10]="הערות")
add_family_exclude="7 8 10"

dir_path="src/modules/"

output_filename="families"
output_file="${dir_path}${output_filename}.ts"
echo "" > $output_file

index_file="${dir_path}index.ts"
index_exports=""
index_type_exports=""

# Replaces ' with $, to prevent react-hook-form key error
function prepare_path {
    local value=$1
    local path=$(echo "$value" | tr "'" "$")
    echo "$path"
}

function add_families_array {
    local var_name=$1
    local obj_attr=$2
    local excludes=$3
    echo "export const $var_name = " >> $output_file

    local var_text="["
    for idx in ${!family_attributes[@]}; do
        if [[ ! " $excludes " =~ " $idx " ]]; then
            var_text+='{id: '$idx', '$obj_attr': "'${family_attributes[$idx]}'"},'
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
            if [[ "$var_name" == "editFamilyInputs" && "$value" == "הערות" ]]; then
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

# Add Families
add_labeled_families_array "addFamilyHeaders" "$add_family_exclude"

# Families Table
add_families_array "familiesTableHeaders" "path" ""

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

# Family ID Prop
fip_name="familyIdProp"
echo "export const $fip_name = \"$family_id_prop\"" >> $output_file
index_exports+="$fip_name"

# Index File

# Save schemas exports, which are external to this script
schemas_exports=$(awk '/export/{rec=""; f=1} f{rec = rec $0 RS} END{printf "%s", rec}' "$index_file")

# Write regular exports to index
first_export='export { '$index_exports' } from "./'$output_filename'"'
echo -e "$first_export\n" > $index_file

# Write type exports to index
type_export='export type { '$index_type_exports' } from "./'$output_filename'"'
echo -e "$type_export\n" >> $index_file

# Write schemas exports to index
echo $schemas_exports >> $index_file

# Lint
npx eslint --ext ts src/modules --fix
