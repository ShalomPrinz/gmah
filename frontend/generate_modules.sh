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
add_families_array "addFamilyInputs" "name" "$add_family_exclude"

# Edit Family
add_families_array "editFamilyInputs" "name" ""

# Add Families
add_families_array "addFamilyHeaders" "path" "$add_family_exclude"

# Families Table
add_families_array "familiesTableHeaders" "path" ""

function write_family_properties {
    var_name="familyProperties"
    echo "export const $var_name = " >> $output_file

    var_text="["
    for idx in ${!family_attributes[@]}; do
        var_text+='"'${family_attributes[$idx]}'",'
    done
    var_text+="]"

    echo -e "$var_text\n" >> $output_file
    index_exports+="$var_name,"
}

write_family_properties

# Family ID Prop
fip_name="familyIdProp"
echo "export const $fip_name = \"$family_id_prop\"" >> $output_file
index_exports+="$fip_name"

# Index File
# Note: export from main output file must be first export
file_contents=$(cat $index_file)
other_exports="${file_contents#*;}"
first_export='export { '$index_exports' } from "./'$output_filename'"'
echo -e "$first_export\n" > $index_file
echo $other_exports >> $index_file

# Lint
npx eslint --ext ts src/modules --fix
