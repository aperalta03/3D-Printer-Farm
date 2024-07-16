import React from 'react';
import printers from '../../data/printers.json';
import styles from './printerList.module.css';

import { Printer } from './printer'

export const PrinterList = () => {
    return (
        <section className={styles.container} id="printerList">
            <h2 className={styles.title}> Printer Hub </h2>
            <div className={styles.printerContainer}> 
                {printers.map((printer, id) => {
                    return (
                        <Printer 
                            id = {id}
                            printer = {printer}
                        />
                    )
                })}
            </div>
        </section>
    )
}