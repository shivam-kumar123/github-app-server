const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const dotenv = require('dotenv');

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();
app.use(cors());
app.use(bodyParser.json());

// Secret token from your GitHub webhook settings
// const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

app.post('/webhook', (req, res) => {
    console.log('req', req);
    console.log('payload', req.payload);
    console.log('webhook called sucessfully');
//   const event = req.headers['x-github-event'];
//   const signature = req.headers['x-hub-signature'];

//   // Verify the payload's signature
//   if (!verifyGitHubSignature(signature, JSON.stringify(req.body))) {
//     console.error('Invalid GitHub webhook signature');
//     return res.status(403).send('Invalid signature');
//   }

//   Handle pull request events
//   if (event === 'pull_request' && req.body.action === 'opened') {
//     const pullRequest = req.body.pull_request;
//     console.log('New pull request created:', pullRequest.title);
//     // Handle the pull request event as needed
//   }

  res.status(200).send('Webhook received successfully');
});

function verifyGitHubSignature(signature, payload) {
  const hmac = crypto.createHmac('sha1', webhookSecret);
  const digest = Buffer.from('sha1=' + hmac.update(payload).digest('hex'), 'utf8');
  const checksum = Buffer.from(signature, 'utf8');
  return crypto.timingSafeEqual(digest, checksum);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
