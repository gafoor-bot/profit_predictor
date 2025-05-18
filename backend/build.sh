#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Node.js dependencies first
npm install

# Install Python dependencies
pip install -r requirements.txt

# Print installed Python packages for verification
pip list 