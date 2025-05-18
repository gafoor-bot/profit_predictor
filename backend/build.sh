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

# Create and activate virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv
chmod +x venv/bin/python
chmod +x venv/bin/pip

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

# Print installed Python packages
echo "Installed Python packages:"
python -m pip list

# Print current directory and contents
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la

# Print virtual environment contents
echo "Virtual environment contents:"
ls -la venv/bin/

# Deactivate virtual environment
deactivate 