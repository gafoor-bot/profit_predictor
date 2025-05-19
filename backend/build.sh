#!/usr/bin/env bash
# exit on error
set -o errexit

# Print Python version and path
echo "Python version:"
/usr/bin/python3 --version
echo "Python path:"
which python3

# Install Python dependencies globally
echo "Installing Python dependencies..."
sudo /usr/bin/python3 -m pip install --upgrade pip
sudo /usr/bin/python3 -m pip install --no-cache-dir -r requirements.txt

# Print installed packages
echo "Installed Python packages:"
/usr/bin/python3 -m pip list

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

# Print current directory and contents
echo "Current directory:"
pwd
echo "Directory contents:"
ls -la 