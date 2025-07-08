// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware

const app = express();
const port = 3001;

// Mock user data (in a real app, this would come from a database)
const users = [
    { id: 1, username: 'hannah', password: 'password123', name: 'Hannah' },
    { id: 2, username: 'david', password: 'password123', name: 'David' },
];

// Middleware
app.use(bodyParser.json()); // To parse JSON request bodies
app.use(cors()); // Enable CORS for all origins (for development)

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user by username
    const user = users.find(u => u.username === username);

    // Check if user exists and password matches
    if (user && user.password === password) {
        // In a real application, you would generate a JWT token here
        // and send it back to the client. For this demo, we just send user info.
        res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, username: user.username } });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

