const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const credentials = require('./credentials.json');

//the code we received by running auth.js
const code = '4/0AVHEtk6Bx67Yfwkz_dWcU-eaLNdlYLeWyx5BlzxYlsmJAH9BFUJoCDIzsppcEXkD3jygDg';
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

oAuth2Client.getToken(code).then(({ tokens }) => {
  const tokenPath = path.join(__dirname, 'token.json');
  fs.writeFileSync(tokenPath, JSON.stringify(tokens));
  console.log('Access token and refresh token stored to token.json');
});

// ruuning this file with the command "node token.js" helps to get token.json