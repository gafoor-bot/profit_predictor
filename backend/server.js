const express = require('express');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.post('/predict', (req, res) => {
    console.log('Received request body:', req.body);
    
    const { rd_spend, administration, marketing_spend } = req.body;
    
    if (!rd_spend || !administration || !marketing_spend) {
        console.error('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('📥 Request received:', req.body);

    const python = spawn('python3', ['predict.py']);
    
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
        res.status(500).json({ error: 'Failed to start Python process' });
    });

    python.on('close', (code) => {
        console.log('Python process exited with code:', code);
        if (code !== 0) {
            console.error('❌ Python process failed with error:', errorOutput);
            res.status(500).json({ error: 'Python process failed: ' + errorOutput });
            return;
        }
        
        if (prediction) {
            try {
                const result = parseFloat(prediction);
                console.log('✅ Final prediction:', result);
                res.json({ predicted_profit: result });
            } catch (err) {
                console.error('❌ Failed to parse prediction:', err);
                res.status(500).json({ error: 'Failed to parse prediction' });
            }
        } else {
            console.error('❌ No prediction returned');
            res.status(500).json({ error: 'No prediction returned from Python script' });
        }
    });
});

const PORT = process.env.PORT || 3001;  // Use environment variable PORT or fallback to 3001
app.listen(PORT, '0.0.0.0', (err) => {
    if (err) {
        console.error('Error starting server:', err);
        return;
    }
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('Test the server with: curl http://localhost:' + PORT + '/test');
});
