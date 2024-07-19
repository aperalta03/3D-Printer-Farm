import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { db, collection, addDoc } from '../../3D-front-end/src/firebaseConfig.mjs';
import GCode from './gcodeScraper.mjs';
import { generateEmailContent } from './emailContent.mjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();  // Ensure this is called to load environment variables

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Temporary directory for file uploads

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

router.post('/upload-gcode', upload.single('file'), async (req, res) => {
    try {
        const { selectedPrinter, currentUserEmail } = req.body;
        const file = req.file;

        if (!file) {
            throw new Error('File not found');
        }

        console.log('File uploaded:', file);

        const filePath = path.resolve(file.path); // Correctly resolve the file path
        console.log('File path resolved:', filePath);

        // Simulate generating a download URL for the file
        const fileURL = `http://localhost:5000/uploads/${file.filename}`;

        // Parse GCode file for details
        const gcode = new GCode(filePath);
        const filamentCost = gcode.getFilamentCost();
        const filamentUsed = gcode.getFilamentUsed();
        const supportMaterial = gcode.getSupportMaterial();
        const colour = gcode.getColour();
        const filamentType = gcode.getFilamentType();
        const printingTime = gcode.getPrintingTime();
        const infill = gcode.getInfill();
        const settings = gcode.getSettings();
        const supports = gcode.getSupports();
        const thumbnail = gcode.extractGCodeThumbnail();

        console.log('GCode parsed successfully');

        const verificationCode = uuidv4(); // Generate unique verification code

        const queueRef = collection(db, 'verificationQueue');
        await addDoc(queueRef, {
            printer: selectedPrinter,
            fileURL,  // Ensure fileURL is included here
            timestamp: new Date(),
            title: file.originalname,
            duration: printingTime || "Unknown",
            userEmail: currentUserEmail,
            verificationCode,
            filamentCost,
            filamentUsed,
            supportMaterial,
            colour,
            filamentType,
            infill,
            settings,
            supports,
            thumbnail
        });

        console.log('Data added to Firestore successfully');

        // Generate email content with GCode details
        const emailText = generateEmailContent(selectedPrinter, {
            filamentCost,
            filamentUsed,
            supportMaterial,
            colour,
            filamentType,
            printingTime,
            infill,
            settings,
            supports
        }, verificationCode);

        // Create the email
        const mailOptions = {
            from: '3dprinters@openhub.be',  // Sender email
            to: currentUserEmail, // Recipient email
            subject: 'New File Uploaded',
            html: emailText, // Use generated email text as HTML
            attachments: [
                {
                    filename: 'thumbnail.png',
                    content: Buffer.from(thumbnail, 'base64'),
                    cid: 'thumbnail'
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ error: 'Failed to send email' });
            }
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'File uploaded and email sent successfully!' });
        });

        // Clean up temporary file
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error processing GCode file or sending email:', error);
        res.status(500).json({ error: `Failed to process file. Error: ${error.message}` });
    }
});

export default router;
