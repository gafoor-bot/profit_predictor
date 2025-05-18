const express = require('express');
const app = express();

app.get('/test', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.listen(5000, () => {
    console.log('Test server running on http://localhost:5000');
}); 