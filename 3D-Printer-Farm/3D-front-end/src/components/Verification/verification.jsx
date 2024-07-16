// Verification.jsx
import React from 'react';
import styles from './verification.module.css';
import { QueueComponent } from '../Nested/Queue/queue';

export const Verification = () => {
    return (
        <section className={styles.container}>
            <h3 className={styles.title}>Verification Queue</h3>
            <div className={styles.queueBackgroundBox}>
                <QueueComponent maxQueueSize={8} />
            </div>
        </section>
    )
}