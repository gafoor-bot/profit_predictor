const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:3000', 'https://profit-predictor.vercel.app'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Check if model file exists
const modelPath = path.join(__dirname, 'Profit_Predictor_Model.pkl');
const modelExists = fs.existsSync(modelPath);
console.log('Model file exists:', modelExists);
console.log('Model path:', modelPath);
console.log('Current directory:', __dirname);
console.log('Directory contents:', fs.readdirSync(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        modelExists: modelExists,
        modelPath: modelPath,
        currentDirectory: __dirname,
        directoryContents: fs.readdirSync(__dirname)
    });
});

// Test route
app.get('/test', (req, res) => {
    res.json({ 
        message: 'Server is running!',
        timestamp: new Date().toISOString(),
        modelExists: modelExists,
        modelPath: modelPath
    });
});

app.post('/predict', (req, res) => {
    console.log('Received request body:', req.body);
    
    const { rd_spend, administration, marketing_spend } = req.body;
    
    if (!rd_spend || !administration || !marketing_spend) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📥 Request received:', req.body);

    // Get the absolute path to predict.py
    const pythonScriptPath = path.join(__dirname, 'predict.py');
    console.log('Python script path:', pythonScriptPath);

    // Check if Python script exists
    if (!fs.existsSync(pythonScriptPath)) {
        console.error('Python script not found at:', pythonScriptPath);
        return res.status(500).json({ 
            error: 'Python script not found',
            details: `Script not found at ${pythonScriptPath}`
        });
    }

    // Check if model file exists
    if (!fs.existsSync(modelPath)) {
        console.error('Model file not found at:', modelPath);
        return res.status(500).json({ 
            error: 'Model file not found',
            details: `Model not found at ${modelPath}`
        });
    }

    console.log('Starting Python process...');
    const python = spawn('python3', [pythonScriptPath]);
    
    const input = JSON.stringify({
        rnd: rd_spend,
        admin: administration,
        marketing: marketing_spend
    });

    console.log('📤 Sending to Python:', input);

    python.stdin.write(input);
    python.stdin.end();

    let prediction = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
        console.log('📬 Python output:', data.toString());
        prediction += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error('❌ Python error:', data.toString());
        errorOutput += data.toString();
    });

    python.on('error', (err) => {
        console.error('❌ Failed to start Python process:', err);
        res.status(500).json({ 
            error: 'Failed to start Python process',
            details: err.message,
            stack: err.stack
        });
    });

    python.on('close', (code) => {
        console.log('Python process exited with code:', code);
        if (code !== 0) {
            console.error('❌ Python process failed with error:', errorOutput);
            res.status(500).json({ 
                error: 'Python process failed',
                details: errorOutput,
                exitCode: code
            });
            return;
        }
        
        if (prediction) {
            try {
                const result = parseFloat(prediction);
                console.log('✅ Final prediction:', result);
                res.json({ predicted_profit: result });
            } catch (err) {
                console.error('❌ Failed to parse prediction:', err);
                res.status(500).json({ 
                    error: 'Failed to parse prediction',
                    details: err.message,
                    raw_prediction: prediction,
                    stack: err.stack
                });
            }
        } else {
            console.error('❌ No prediction returned');
            res.status(500).json({ 
                error: 'No prediction returned from Python script',
                details: errorOutput
            });
        }
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('Test the server with: curl http://localhost:' + PORT + '/test');
});
