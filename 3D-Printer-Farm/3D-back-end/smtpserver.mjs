import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validatePrintJob } from './components/validate.mjs';
import { invalidatePrintJob } from './components/invalidate.mjs';
import gcodeHandler from './components/gcodeHandler.mjs';
import { startMonitoringQueues } from './components/sendGCode.mjs';
import { db, setDoc, doc } from '../3D-front-end/src/firebaseConfig.mjs';

dotenv.config();

const populatePrinters = async () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const jsonFilePath = path.join(__dirname, '../3D-front-end/src/data/printers.json');

    const printersData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));

    for (const printer of printersData) {
        const printerDoc = doc(db, 'printers', `printer${printer.number}`);
        await setDoc(printerDoc, {
            ip: printer.ip,
            key: printer.key
        });
        console.log(`Added printer${printer.number} to Firestore`);
    }
};

populatePrinters().then(() => {
    console.log('All printers added to Firestore');
}).catch(error => {
    console.error('Error adding printers to Firestore:', error);
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

console.log('Email Password:', process.env.EMAIL_PASS);

app.get('/validate/:verificationCode', validatePrintJob);
app.get('/invalidate/:verificationCode', invalidatePrintJob);
app.use('/api', gcodeHandler);

app.post('/send-gcode/:printerNumber', async (req, res) => {
    const { printerNumber } = req.params;

    try {
        await processPrinterQueue(printerNumber);
        res.status(200).json({ message: `G-code sent to printer ${printerNumber} successfully.` });
    } catch (error) {
        res.status(500).json({ error: `Failed to send G-code to printer ${printerNumber}. Error: ${error.message}` });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`SMTP server is listening on port ${PORT}`);
    startMonitoringQueues();  // Start monitoring queues when server starts
});
