import React, { useContext, useState } from 'react';
import styles from './printer.module.css';
import { getImageUrl } from '../../utils';
import { QueueComponent } from '../Nested/Queue/queue';
import PrinterContext from '../Nested/Context/printercontext';
import ColorPalette from '../Nested/Color/color';

export const Printer = ({ printer: { number, ip, key } }) => {
    const { handleSelectPrinter } = useContext(PrinterContext);

    const [isQueueMaxed, setIsQueueMaxed] = useState(false);
    const handleQueueStatusChange = (isMaxed) => {
        setIsQueueMaxed(isMaxed);
    };

    return (
        <div onClick={() => handleSelectPrinter(number)} className={styles.container}>
            <div className={styles.imgContainer}>
                <img
                    className={styles.img}
                    src={getImageUrl("printer/prusamk4.png")}
                    alt="Printer Object"
                />
            </div>
            <div className={styles.printerDetailsContainer}>
                <div className={styles.printerDetailsBox}>
                    <h3 className={styles.printerTitle}> {`Printer ${number}`} </h3>
                    <li className={styles.printerDetail}> {`IP Address: ${ip}`} </li>
                    <li className={styles.printerDetail}> {`Key: ${key}`} </li>
                </div>
            </div>
            <div className={styles.queueContainer}>
                <QueueComponent 
                    maxQueueSize={2} 
                    onStatusChange={handleQueueStatusChange} 
                    collectionName={`printers/printer${number}/queue`} 
                />
            </div>
            {/* Color Palette */}
            <div className={styles.colorContainer}>
                <ColorPalette
                    printerNumber={number} 
                />
            </div>
            {/* Color Palette */}
            <div className={styles.statusContainer}>
                <div className={styles.statusBox} style={{ backgroundColor: isQueueMaxed ? 'red' : 'green' }}> </div>
            </div>
        </div>
    )
}
