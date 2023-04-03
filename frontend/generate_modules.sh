#!/bin/bash

# Preparation
family_attributes=([0]="שם מלא" [1]="רחוב" [2]="בניין" [3]="דירה" [4]="קומה" [5]="מס' בית" [6]="מס' פלאפון" [7]="נהג במקור" [8]="ממליץ" [9]="הערות")
add_family_exclude=(7)

dir_path="src/modules/"

output_filename="families"
output_file="${dir_path}${output_filename}.ts"
echo "" > $output_file

index_file="${dir_path}index.ts"
index_exports=""

function add_families_array {
    var_name=$1
    obj_attr=$2
    excludes=$3
    echo "export const $var_name = " >> $output_file

    var_text="["
    for idx in ${!family_attributes[@]}; do
        if [[ ! " $excludes " =~ " $idx " ]]; then
            var_text+='{id: '$idx', '$obj_attr': "'${family_attributes[$idx]}'"},'
        fi
    done
    var_text+="]"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

# Add Family
add_families_array "addFamilyInputs" "name" "${add_family_exclude[*]}"

# Add Families
add_families_array "addFamilyHeaders" "path" "${add_family_exclude[*]}"

# Families Table
add_families_array "familiesTableHeaders" "path" ""

# Index File
# Note: export from main output file must be first export
file_contents=$(cat $index_file)
other_exports="${file_contents#*;}"
first_export='export { '$index_exports' } from "./'$output_filename'"'
echo $first_export > $index_file
echo $other_exports >> $index_file

# Lint
npx eslint --ext ts src/modules --fix
