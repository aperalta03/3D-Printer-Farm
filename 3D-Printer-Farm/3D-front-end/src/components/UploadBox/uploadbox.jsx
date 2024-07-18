import React, { useContext, useState } from 'react';
import styles from './uploadbox.module.css';
import PrinterContext from '../Nested/Context/printercontext';
import { useAuth } from '../Nested/Context/authentication';

export const UploadBox = () => {
    const { selectedPrinter } = useContext(PrinterContext);
    const { currentUser } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file || !selectedPrinter || !currentUser?.email) {
            setMessage('Please select a printer and select a file to upload.');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('selectedPrinter', selectedPrinter);
            formData.append('currentUserEmail', currentUser.email);
            formData.append('file', file);

            const response = await fetch('http://localhost:5000/api/upload-gcode', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process file on the server');
            }

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error('Error uploading file or processing GCode:', error);
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
