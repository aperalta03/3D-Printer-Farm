import React, { useContext, useState } from 'react';
import styles from './uploadbox.module.css';
import PrinterContext from '../Nested/Context/printercontext';
import { useAuth } from '../Nested/Context/authentication'; // Import useAuth

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../firebaseConfig.mjs';
import { sendEmail } from '../../utils';
import { v4 as uuidv4 } from 'uuid'; // Import uuid

export const UploadBox = () => {
    const { selectedPrinter } = useContext(PrinterContext);
    const { currentUser } = useAuth(); // Use useAuth to get current user
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Upload File Method
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file || !selectedPrinter || !currentUser?.email) { // Use currentUser's email
            setMessage('Please select a printer and select a file to upload.');
            return;
        }

        setLoading(true);
        setMessage('');

        const verificationCode = uuidv4(); // Generate unique verification code

        try {
            const storageRef = ref(storage, `uploads/${file.name}`);
            await uploadBytes(storageRef, file);
            const fileURL = await getDownloadURL(storageRef);

            const queueRef = collection(db, 'verificationQueue');
            await addDoc(queueRef, {
                printer: selectedPrinter,
                fileURL,
                timestamp: new Date(),
                title: file.name,
                duration: "1 hour",
                userEmail: currentUser.email, // Use currentUser's email in the document
                verificationCode, // Include verification code
            });

            // SENDING EMAIL
            await sendEmail({
                from: '3dprinters@openhub.be',  // Sender email
                to: 'alonso.peralta03@gmail.com', // Recipient email
                subject: 'New File Uploaded',
                text: `A new file has been uploaded to the queue for Printer ${selectedPrinter}. 
                       <br><br>
                       <a href="http://localhost:5000/validate/${verificationCode}">ACCEPT</a>
                       <br>
                       <a href="http://localhost:5000/invalidate/${verificationCode}">DENY</a>`,
            });

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
                    Printer {selectedPrinter || "#"}
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
