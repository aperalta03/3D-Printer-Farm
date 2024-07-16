import React, { useContext } from 'react';
import styles from './uploadbox.module.css';
import PrinterContext from '../Nested/Context/printercontext';

export const UploadBox = () => {
    const { selectedPrinter } = useContext(PrinterContext);

    return (
        <section className={styles.container}>
            <div className={styles.uploadContainer}>
                <label className={styles.uploadText} for="file-upload">Printer {selectedPrinter || "(select a printer)"}</label>
                <button className={styles.uploadBox}>
                    <input className={styles.upload} type="file" id="file-upload"/>
                </button>
            </div>
        </section>
    )
}