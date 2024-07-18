import React, { useContext } from 'react';
import styles from './printer.module.css';
import { getImageUrl } from '../../utils';
import { QueueComponent } from '../Nested/Queue/queue';
import PrinterContext from '../Nested/Context/printercontext';

export const Printer = ({
    printer: {number, ip, key}
}) => {
    const { handleSelectPrinter } = useContext(PrinterContext);

    {/* STATUS BOX LOGIC */}
    const [isQueueMaxed, setIsQueueMaxed] = React.useState(false);
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
                <QueueComponent 
                    maxQueueSize={2} 
                    onStatusChange={handleQueueStatusChange} 
                    collectionName={`printers/printer${number}/queue`} // Update collection name format here
                />
                {/* COLOR PALETTE */}

                {/* */}
            </div>
            <div className={styles.statusContainer}>
                <div className={styles.statusBox} style={{ backgroundColor: isQueueMaxed ? 'red' : 'green' }}> </div>
            </div>
        </div>
    )
}
