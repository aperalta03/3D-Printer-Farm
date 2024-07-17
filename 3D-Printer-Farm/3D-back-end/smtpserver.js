// smtpServer.js
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Verify if environment variable is loaded correctly
console.log('Email Password:', process.env.EMAIL_PASS);

// Service = Sender's Service
const transporter = nodemailer.createTransport({
    host: 'smtp.openhub.be', // Change to 'gmail' for Gmail SMTP
    port: 587,
    secure: false,
    auth: {
        user: '3dprinters@openhub.be',
        pass: process.env.EMAIL_PASS,
    },
    //TODO - FIND A WAY TO GET RIGHT SMTP CONFIGURATION (IT-DEPARTMENT). FOR NOW USE THIS:
    tls: {
        rejectUnauthorized: false
    },
});

app.post('/send-email', (req, res) => {
    const { from, to, subject, text } = req.body;

    // Send email
    const mailOptions = {
        from,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully', response: info.response });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SMTP server is listening on port ${PORT}`);
});
