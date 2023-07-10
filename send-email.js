const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const sanitizeHtml = require('sanitize-html');
const fs = require('fs');

// Read the configuration file
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Validate and sanitize form inputs
app.post('/send_message', (req, res) => {
  const { name, email, message } = req.body;

  // Perform validation checks
  if (!name || !email || !message) {
    return res.status(400).send('Missing required fields');
  }

  // Sanitize inputs
  const sanitizedName = sanitizeHtml(name);
  const sanitizedEmail = sanitizeHtml(email);
  const sanitizedMessage = sanitizeHtml(message);

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return res.status(400).send('Invalid email address');
  }

  // Extract the email configuration from the config file
  const emailConfig = config.email;

  // Configure nodemailer with the email provider settings
  let transporter;

  if (emailConfig.service === 'gmail') {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });
  }

  const mailOptions = {
    from: emailConfig.auth.user,
    to: emailConfig.recipient,
    subject: 'New Contact Message',
    text: `Name: ${sanitizedName}\nEmail: ${sanitizedEmail}\n\nMessage:\n${sanitizedMessage}`,
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending message');
    } else {
      console.log('Email sent: ' + info.response);
      res.sendFile(config.path.messageSent);
    }
  });
});

// Handle GET requests to /send_message
app.use((req, res) => {
  res.sendFile(config.path.notFound);
});

// Start the server
app.listen(8383, () => {
  console.log('Server listening on port 8383');
});
