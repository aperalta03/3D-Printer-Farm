import axios from 'axios';
import { db, doc, getDoc, deleteDoc, collection, getDocs } from '../../3D-front-end/src/firebaseConfig.mjs';
import { execFile } from 'child_process';
import path from 'path';

const PRUSA_API_PATH = '/api/job';

/**
 * Send G-code file to the specified printer.
 * @param {string} printerNumber - The printer number.
 * @param {string} gcodeFileURL - The URL of the G-code file.
 */
const sendGCodeToPrinter = async (printerNumber, gcodeFileURL) => {
    try {
        const printerDoc = doc(db, 'printers', `printer${printerNumber}`);
        const printerSnapshot = await getDoc(printerDoc);

        if (!printerSnapshot.exists()) {
            throw new Error(`Printer ${printerNumber} does not exist in Firestore`);
        }

        const printerData = printerSnapshot.data();
        const { ip, key } = printerData;

        // Call the Python script
        const pythonScriptPath = path.resolve('components/sendGcode.py');
        execFile('python', [pythonScriptPath, gcodeFileURL, ip, key], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error.message}`);
                throw error;
            }
            console.log(`Python script output: ${stdout}`);
            if (stderr) {
                console.error(`Python script stderr: ${stderr}`);
            }
        });
    } catch (error) {
        console.error(`Failed to send G-code to printer ${printerNumber}:`, error.message);
        throw error;
    }
};

/**
 * Process the queue for a given printer and send the first G-code file.
 * @param {string} printerNumber - The printer number.
 */
const processPrinterQueue = async (printerNumber) => {
    try {
        const printerQueueRef = collection(db, `printers/printer${printerNumber}/queue`);
        const printerQueueSnapshot = await getDocs(printerQueueRef);

        if (printerQueueSnapshot.empty) {
            console.log(`Queue for printer ${printerNumber} is empty`);
            return;
        }

        const firstQueueItem = printerQueueSnapshot.docs[0];
        const { fileURL } = firstQueueItem.data();

        // Send G-code to the printer
        await sendGCodeToPrinter(printerNumber, fileURL);

        // Remove the G-code from the queue after sending
        await deleteDoc(doc(db, `printers/printer${printerNumber}/queue`, firstQueueItem.id));
        console.log(`Removed G-code from queue for printer ${printerNumber}`);
    } catch (error) {
        console.error(`Failed to process queue for printer ${printerNumber}:`, error.message);
        throw error;
    }
};

/**
 * Start monitoring the printer queues.
 */
const startMonitoringQueues = () => {
    const printerNumbers = ['1', '2', '3', '4', '5', '6', '7']; // Add your printer numbers here
    const delayBetweenChecks = 10000; // Delay between checks in milliseconds (e.g., 10 seconds)

    printerNumbers.forEach(printerNumber => {
        setInterval(async () => {
            await processPrinterQueue(printerNumber);
        }, delayBetweenChecks);
    });
};

export { processPrinterQueue, startMonitoringQueues };
