import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import { db, doc, getDoc, 
        addDoc, deleteDoc, collection, 
        query, where, getDocs } 
from '../3D-front-end/src/firebaseConfig.mjs';

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
    tls: {
        rejectUnauthorized: false
    },
});

app.post('/send-email', async (req, res) => {
    const { from, to, subject, text, verificationCode } = req.body;

    const emailContent = `${text}`;

    const mailOptions = {
        from,
        to,
        subject,
        html: emailContent,
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

app.get('/validate/:verificationCode', async (req, res) => {
    const { verificationCode } = req.params;

    try {
        const q = query(collection(db, 'verificationQueue'), where('verificationCode', '==', verificationCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const { printer, fileURL, title, duration, timestamp } = data;

            const printerQueueRef = collection(db, `printers/printer${printer}/queue`);
            await addDoc(printerQueueRef, { fileURL, title, duration, timestamp });

            await deleteDoc(doc.ref);

            res.status(200).send('Print job validated and moved to printer queue.');
        } else {
            res.status(404).send('Verification code not found.');
        }
    } catch (error) {
        console.error('Error validating print job:', error);
        res.status(500).send('Internal server error.');
    }
});

app.get('/invalidate/:verificationCode', async (req, res) => {
    const { verificationCode } = req.params;

    try {
        const q = query(collection(db, 'verificationQueue'), where('verificationCode', '==', verificationCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const { userEmail, title } = data;

            await deleteDoc(doc.ref);

            // Send email to user
            const mailOptions = {
                from: '3dprinters@openhub.be',
                to: userEmail,
                subject: 'Print Job Denied',
                text: `Your print job "${title}" was denied. Please verify with the head engineer and re-send the print.`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending denial email:', error);
                } else {
                    console.log('Denial email sent:', info.response);
                }
            });

            res.status(200).send('Print job denied and user notified.');
        } else {
            res.status(404).send('Verification code not found.');
        }
    } catch (error) {
        console.error('Error invalidating print job:', error);
        res.status(500).send('Internal server error.');
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SMTP server is listening on port ${PORT}`);
});
