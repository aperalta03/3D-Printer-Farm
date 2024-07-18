import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../../../utils';
import styles from './queue.module.css';
import { db } from '../../../firebaseConfig.mjs';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const QueueComponent = ({maxQueueSize, onStatusChange, collectionName }) => {
    const [queue, setQueue] = useState([]);

    /* QUEUE LOGIC */
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

{/* TODO ADD G CODE PREVIEW FOR IMAGE */}
function Queue({ queue }) {
  return (
    <figure>
      <article>
        <ul className={styles.queueContainer}>
          {queue.map((item, i) => (
            <div key={i} className={styles.queueItem}>
              <img src={getImageUrl(`queue/item${item.fileURL}.png`)} alt={`Item ${i}`} />
              <div className={styles.itemText}>
                <p>{item.title}</p>
                <p>{item.duration}</p>
              </div>
            </div>
          ))}
        </ul>
      </article>
    </figure>
  );
}