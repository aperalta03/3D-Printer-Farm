import React, { useEffect, useState } from 'react';
import styles from './queue.module.css';
import { db } from '../../../firebaseConfig.mjs';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const QueueComponent = ({ maxQueueSize, onStatusChange, collectionName }) => {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const q = query(collection(db, collectionName));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newQueue = snapshot.docs.map(doc => doc.data());
            setQueue(newQueue);
            if (onStatusChange) {
                onStatusChange(newQueue.length >= maxQueueSize);
            }
        });
        return unsubscribe;
    }, [maxQueueSize, onStatusChange, collectionName]);

    return (
        <div className={styles.container}>
            <div className={styles.queue}>
                <Queue queue={queue} />
            </div>
        </div>
    );
}

function Queue({ queue }) {
    return (
        <figure>
            <article>
                <ul className={styles.queueContainer}>
                    {queue.map((item, i) => (
                        <div key={i} className={styles.queueItem}>
                            <img
                                src={`data:image/png;base64,${item.thumbnail}`}
                                alt={`Item ${i}`}
                                className={styles.thumbnail}
                            />
                            <div className={styles.itemText}>
                                <div className={styles.itemTitleBox}>
                                  <h1>{item.title.replace('.gcode', '')}</h1>
                                </div>
                                <div className={styles.itemDetailsBox}>
                                  <p>{item.duration}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </ul>
            </article>
        </figure>
    );
}
