const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const credentials = require('./credentials.json');
const tokens = require('./token.json');
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new OAuth2(
  client_id,
  client_secret,
  redirect_uris[0] // This can be any URL, as we are using the 'offline' scope
);

// Set credentials for the OAuth2 client
oAuth2Client.setCredentials(tokens);

// Create the Gmail API client
const gmail = google.gmail({
  version: 'v1',
  auth: oAuth2Client
});

// Retrieve the first unread email in the inbox
gmail.users.messages.list({
  userId: 'me',
  q: 'is:unread',
  maxResults: 1
}, (err, res) => {
  if (err) return console.log('The API returned an error:', err);
  const messages = res.data.messages;
  if (!messages) return console.log('No unread messages found.');

  // Retrieve the message details for the first unread email
  gmail.users.messages.get({
    userId: 'me',
    id: messages[0].id
  }, (err, res) => {
    if (err) return console.log('The API returned an error:', err);
    const message = res.data;
    const threadId = message.threadId;

    // Check if the email thread has any replies
    if (message.payload.headers.some(header => header.name === 'In-Reply-To')) {
      return console.log('The email thread already has replies.');
    }

    // Send a reply to the email thread
    gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        threadId: threadId,
        raw: Buffer.from(`To: ${message.payload.headers.find(header => header.name === 'From').value}\r\n` +
          `Subject: RE: ${message.payload.headers.find(header => header.name === 'Subject').value}\r\n` +
          `Content-Type: text/plain; charset=utf-8\r\n\r\n` +
          `Hello, thank you for your email. I am currently out of office and will respond as soon as possible.\r\n`).toString('base64')
      }
    }, (err, res) => {
      if (err) return console.log('The API returned an error:', err);
      console.log(`Reply sent to email thread with ID: ${threadId}`);

      // Add a label to the email thread
      gmail.users.labels.create({
        userId: 'me',
        requestBody: {
          labelListVisibility: 'labelShow',
          messageListVisibility: 'show',
          name: 'Vacation Replies'
        }
      }, (err, res) => {
        if (err) return console.log('The API returned an error:', err);
        const labelId = res.data.id;

        // Apply the label to the email thread
        gmail.users.threads.modify({
          userId: 'me',
          id: threadId,
          requestBody: {
            addLabelIds: [labelId]
          }
        }, (err, res) => {
          if (err) return console.log('The API returned an error:', err);
          console.log(`Label added to email thread with ID: ${threadId}`);
        });
      });
    });
  });
});
