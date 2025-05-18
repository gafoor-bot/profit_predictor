import sys
import json
import joblib
import numpy as np
import traceback

try:
    # Load the trained model
    model = joblib.load('Profit_Predictor_Model.pkl')

    # Read input from Node.js
    data = json.loads(sys.stdin.read())
    
    # Print received data for debugging
    print("Received data:", data, file=sys.stderr)

    # Extract input features from received JSON
    features = np.array([[data['rnd'], data['admin'], data['marketing']]])

    # Make prediction
    prediction = model.predict(features)

    # Output prediction to stdout and flush
    print(prediction[0])
    sys.stdout.flush()

except Exception as e:
    print("Error occurred:", str(e), file=sys.stderr)
    print(traceback.format_exc(), file=sys.stderr)
    sys.exit(1)
