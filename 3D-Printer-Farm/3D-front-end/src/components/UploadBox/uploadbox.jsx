import React, { useContext, useState } from 'react';
import styles from './uploadbox.module.css';
import PrinterContext from '../Nested/Context/printercontext';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig.js';
import { sendEmail } from '../../utils';

export const UploadBox = () => {
    const { selectedPrinter } = useContext(PrinterContext);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Upload File Method
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file || !selectedPrinter) {
            setMessage('Please select a printer and a file to upload.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const storageRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);

            const queueRef = collection(db, 'verificationQueue');
            await addDoc(queueRef, {
                printer: selectedPrinter,
                fileURL,
                timestamp: new Date(),
                // TODO - Extract from GCode Info
                title: file.name,
                duration: "1 hour"
            });

            console.log('File uploaded, sending email...');

            // SENDING EMAIL
            await sendEmail({
                from: '3dprinters@openhub.be',  // Sender email
                to: 'alonso.peralta03@gmail.com', // Recipient email
                subject: 'New File Uploaded',
                text: `A new file has been uploaded to the queue for Printer ${selectedPrinter}.`,
            }); 

            console.log('Email sent successfully.');
            
            setMessage('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file or sending email:', error);
            setMessage(`Failed to upload file. Please try again. Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.container}>
            <div className={styles.uploadContainer}>
                <label className={styles.uploadText} htmlFor="file-upload">
                    Printer {selectedPrinter || "(select a printer)"}
                </label>
                <input
                    className={styles.upload}
                    type="file"
                    id="file-upload"
                    onChange={handleFileChange}
                />
                <button className={styles.uploadButton} onClick={handleFileUpload} disabled={loading}>
                    {loading ? 'Uploading...' : 'Upload File'}
                </button>
            </div>
            {message && <p className={styles.message}>{message}</p>}
        </section>
    );
};
