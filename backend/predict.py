import sys
import json
import joblib
import numpy as np
import traceback
import os

# Immediate feedback that script started
print("Python script started", file=sys.stderr)
sys.stderr.flush()

try:
    # Print current working directory and file list for debugging
    print("Current working directory:", os.getcwd(), file=sys.stderr)
    print("Files in directory:", os.listdir('.'), file=sys.stderr)
    sys.stderr.flush()

    # Load the trained model - try multiple possible paths
    model_paths = [
        'Profit_Predictor_Model.pkl',
        os.path.join(os.getcwd(), 'Profit_Predictor_Model.pkl'),
        os.path.join(os.path.dirname(__file__), 'Profit_Predictor_Model.pkl')
    ]
    
    model = None
    for model_path in model_paths:
        try:
            print(f"Attempting to load model from: {model_path}", file=sys.stderr)
            sys.stderr.flush()
            if os.path.exists(model_path):
                model = joblib.load(model_path)
                print(f"Model loaded successfully from {model_path}", file=sys.stderr)
                sys.stderr.flush()
                break
            else:
                print(f"Model file not found at {model_path}", file=sys.stderr)
                sys.stderr.flush()
        except Exception as e:
            print(f"Failed to load model from {model_path}: {str(e)}", file=sys.stderr)
            sys.stderr.flush()
    
    if model is None:
        raise Exception("Could not load model from any of the attempted paths")

    # Read input from Node.js
    print("Waiting for input...", file=sys.stderr)
    sys.stderr.flush()
    input_data = sys.stdin.read()
    print("Raw input received:", input_data, file=sys.stderr)
    sys.stderr.flush()
    
    data = json.loads(input_data)
    print("Parsed data:", data, file=sys.stderr)
    sys.stderr.flush()

    # Extract input features from received JSON
    features = np.array([[data['rnd'], data['admin'], data['marketing']]])
    print("Features array:", features, file=sys.stderr)
    sys.stderr.flush()

    # Make prediction
    prediction = model.predict(features)
    print("Raw prediction:", prediction, file=sys.stderr)
    sys.stderr.flush()

    # Output prediction to stdout and flush
    print(prediction[0])
    sys.stdout.flush()

except Exception as e:
    print("Error occurred:", str(e), file=sys.stderr)
    print("Full traceback:", file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.stderr.flush()
    sys.exit(1)
