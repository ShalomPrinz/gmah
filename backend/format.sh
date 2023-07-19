#!/bin/bash

# Add files from src folder to this list if you want to ignore them
declare -a ignore_list=("results.py")

# Construct ignore_files
ignore_files=""
for ignored_file in "${ignore_list[@]}"; do
    ignore_files+="! -name $ignored_file "
done
# Remove the trailing whitespace
ignore_files="${ignore_files::-1}"

ignore_rules="E20,E261,E300,E301,E302,E303,E304,E305,E306"

find ./src -type f -name '*.py' $ignore_files -exec autopep8 --in-place --ignore=$ignore_rules --aggressive --aggressive {} +
