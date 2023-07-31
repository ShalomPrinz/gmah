#!/bin/bash

cd frontend
npm run build
cd ..

rm -rf backend/static
mv frontend/static backend
