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
    origin: "*", // Adjust this to the origin of your client app
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3001;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const payload = req.body;
  console.log('Payload:', payload);
  console.log('Webhook called successfully.');

  // Emit a WebSocket event to all connected clients
  io.emit('webhookEvent', payload);

  res.status(200).send('Webhook received successfully');
});

// Updated endpoint to fetch repositories after login
app.get('/fetch-repos', async (req, res) => {
  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    });

    const repos = response.data.map(repo => repo.full_name);
    res.status(200).json({ repos });
  } catch (error) {
    console.error('Error fetching repositories:', error.message);
    res.status(500).json({ error: 'Error fetching repositories' });
  }
});

// New endpoint to create webhooks for all repositories
app.post('/create-webhooks', async (req, res) => {
  const { repos } = req.body;

  try {
    for (const repo of repos) {
      await axios.post(`https://api.github.com/repos/${repo}/hooks`, {
        name: 'web',
        active: true,
        events: ['push'],
        config: {
          url: 'https://github-app-server.onrender.com/webhook', // Replace with your server URL
          content_type: 'json',
        },
      }, {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
        }
      });
      console.log(`Webhook created for repository: ${repo}`);
    }

    res.status(200).send('Webhooks created successfully');
  } catch (error) {
    console.error('Error creating webhooks:', error.message);
    res.status(500).json({ error: 'Error creating webhooks' });
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
