import React, { useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styles from './queue.module.css';
import { db } from '../../../firebaseConfig.mjs';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const QueueComponent = ({ maxQueueSize, onStatusChange, collectionName }) => {
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const q = query(collection(db, collectionName));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newQueue = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                <TransitionGroup component="ul" className={styles.queueContainer}>
                    {queue.map((item) => (
                        <CSSTransition
                            key={item.id}
                            timeout={500}
                            classNames={{
                                enter: styles.queueItemEnter,
                                enterActive: styles.queueItemEnterActive,
                                exit: styles.queueItemExit,
                                exitActive: styles.queueItemExitActive,
                            }}
                        >
                            <div className={styles.queueItem}>
                                <img
                                    src={`data:image/png;base64,${item.thumbnail}`}
                                    alt={`Item ${item.title}`}
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
                        </CSSTransition>
                    ))}
                </TransitionGroup>
            </article>
        </figure>
    );
}
