#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Starting build process..."

# Print Python version
echo "Python version:"
python3 --version

# Install Node.js dependencies first
echo "Installing Node.js dependencies..."
npm install

# Install Python dependencies
echo "Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# Print installed Python packages
echo "Installed Python packages:"
python3 -m pip list

# Print current directory and contents
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la 