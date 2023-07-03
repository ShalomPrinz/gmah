#!/bin/bash

if [[ $1 == "--coverage" ]]; then
    coverage run -m unittest discover tests
    coverage html
else
    python -m unittest discover tests
fi
