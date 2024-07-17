import React, { useEffect, useState } from 'react';
// import { useQueue } from "@uidotdev/usehooks";
import { getImageUrl } from '../../../utils';
import styles from './queue.module.css';

import { db } from '../../../firebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';

export const QueueComponent = ({maxQueueSize, onStatusChange}) => {
    const [queue, setQueue] = useState([]);

    /* QUEUE LOGIC */
    useEffect(() => {
      const q = query(collection(db, 'verificationQueue'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const newQueue = snapshot.docs.map(doc => doc.data());
        setQueue(newQueue);
        if (onStatusChange) {
          onStatusChange(newQueue.length >= maxQueueSize);
        }
      });
      return unsubscribe;
    }, [maxQueueSize, onStatusChange]);

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