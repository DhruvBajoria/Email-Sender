// here we are creating options such as whom the mail need to be dropped ,adding the subject feature and finally the text
const sendMail = require('./gmail');

const main = async () => {


  const options = {
    to: 'himanshugoel517@gmail.com',
    subject: 'Hello Himanshu 🚀',
    text: 'This email is sent from the command line',
    html: `<p>🙋🏻‍♀️  &mdash; This is a <b>test email</b> from DHRUV BAJORIA.</p>`,
    // attachments: fileAttachments,
    textEncoding: 'base64',
    headers: [
      { key: 'X-Application-Developer', value: 'Amit Agarwal' },
      { key: 'X-Application-Version', value: 'v1.0.0.2' },
    ],
  };

  const messageId = await sendMail(options);
  return messageId;
};

main()
  .then((messageId) => console.log('Message sent successfully:', messageId))
  .catch((err) => console.error(err));