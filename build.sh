#!/bin/bash

# Version number must be provided

if [[ "$1" == "" ]]; then
  echo "Error: No version number supplied."
  return 1
fi

if [[ ! "$1" =~ \..*\..* ]]; then
  echo "Error: The string '$1' does not match a version number, e.g. 1.0.0"
  return 1
fi

VERSION_NUMBER=$1

# Frontend Build

cd frontend
npm run build
cd ..

rm -rf backend/static
mv frontend/static backend

# Backend Build

cd backend
docker build -f Dockerfile.prod -t gmah-app .
cd ..

docker tag gmah-app shalomprinz/gmah:$VERSION_NUMBER
docker push shalomprinz/gmah:$VERSION_NUMBER
