import { db, query, collection, where, getDocs, addDoc, deleteDoc } from '../../3D-front-end/src/firebaseConfig.mjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateAcceptanceEmailContent } from './emailContent.mjs';

dotenv.config();  // Ensure this is called to load environment variables

const transporter = nodemailer.createTransport({
    host: 'smtp.openhub.be',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER, // Ensure these are correctly set in your .env file
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
});

export async function validatePrintJob(req, res) {
    const { verificationCode } = req.params;

    try {
        const q = query(collection(db, 'verificationQueue'), where('verificationCode', '==', verificationCode));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            const data = doc.data();
            const { printer, fileURL, title, duration, timestamp, userEmail, thumbnail } = data; // Added thumbnail

            const printerQueueRef = collection(db, `printers/printer${printer}/queue`);
            await addDoc(printerQueueRef, { fileURL, title, duration, timestamp, thumbnail }); // Ensure thumbnail is included

            await deleteDoc(doc.ref);

            // Generate acceptance email content
            const emailText = generateAcceptanceEmailContent(title);

            // Send acceptance email
            const mailOptions = {
                from: '3dprinters@openhub.be',
                to: userEmail,
                subject: 'Print Job Accepted',
                text: emailText,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log('Error sending acceptance email:', error);
                } else {
                    console.log('Acceptance email sent:', info.response);
                }
            });

            res.status(200).send('Print job validated and moved to printer queue.');
        } else {
            res.status(404).send('Verification code not found.');
        }
    } catch (error) {
        console.error('Error validating print job:', error);
        res.status(500).send('Internal server error.');
    }
}
