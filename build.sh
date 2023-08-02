#!/bin/bash

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

# Push image to dockerhub

if [[ "$1" == "push" ]]; then

  # Version number must be provided
  
  if [[ "$2" == "" ]]; then
    echo "Error: No version number supplied."
    return 1
  fi

  if [[ ! "$2" =~ \..*\..* ]]; then
    echo "Error: The string '$2' does not match a version number, e.g. 1.0.0"
    return 1
  fi

  VERSION_NUMBER=$2

  echo "Pushing image to dockerhub, tagging with $VERSION_NUMBER..."
  docker tag gmah-app shalomprinz/gmah:$VERSION_NUMBER
  docker push shalomprinz/gmah:$VERSION_NUMBER
fi

echo "Successfully built the gmah app image"
