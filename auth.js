//if we run this file using command "node auth.js" we will get a link ,clicking that link will help to get the 
//code through the url

const { google } = require('googleapis');
const credentials = require('./credentials.json');

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const GMAIL_SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const url = oAuth2Client.generateAuthUrl({    //generate author url
  access_type: 'offline',
  prompt: 'consent',
  scope: GMAIL_SCOPES,
});

console.log('Authorize this app by visiting this url:', url);