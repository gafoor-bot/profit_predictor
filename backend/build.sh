#!/usr/bin/env bash
# exit on error
set -o errexit

# Print Python version
echo "Python version:"
python3 --version

# Install Python dependencies
echo "Installing Python dependencies..."
python3 -m pip install -r requirements.txt

# Print installed packages
echo "Installed Python packages:"
python3 -m pip list

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Print current directory and contents
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la 