const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const dotenv = require('dotenv');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for now, adjust as needed
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3001;

dotenv.config();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Add a variable to store the last notification
let lastNotification = null;

app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Payload:', payload);
  console.log('Webhook called successfully.');

  // Emit a WebSocket event to all connected clients
  io.emit('webhookEvent', payload);

  // Update the last notification
  lastNotification = payload;

  res.status(200).send('Webhook received successfully');
});

// Add an endpoint to get the last notification
app.get('/last-notification', (req, res) => {
  res.status(200).json(lastNotification);
});

app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Payload:', payload);
  console.log('Webhook called successfully.');

  // Emit a WebSocket event to all connected clients
  io.emit('webhookEvent', payload);

  res.status(200).send('Webhook received successfully');
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
