import React, { useEffect } from 'react';
import { useQueue } from "@uidotdev/usehooks";
import { getImageUrl } from '../../../utils';
import styles from './queue.module.css';

export const QueueComponent = ({maxQueueSize, onStatusChange}) => {

    /* QUEUE LOGIC */
    const { add, remove, last, size, queue } = useQueue([]);

    useEffect(() => {
      if (onStatusChange) {
        onStatusChange(size >= maxQueueSize);
      }
    }, [size, maxQueueSize, onStatusChange]); 

    const handleAdd = () => {
        if (size < maxQueueSize) {
            add((last || 0) + 1);
        }
    };

    const handleRemove = () => {
        if (size > 0) {
            remove();
        }
    };
    
    const isQueueMaxed = size >= maxQueueSize;

    return (
        <div className={styles.container}>
            <div className={styles.queue}>
                <Queue queue={queue} size={size} />
            </div>
            <div className={styles.controls}>
                <button className={styles.btn} onClick={handleAdd} disabled={isQueueMaxed}>
                    Add
                </button>
                <button className={styles.btn} onClick={handleRemove} disabled={size === 0}>
                    Remove
                </button>
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
            {queue.map((item, i) => {
              return (
                <div key={i} className={styles.queueItem}>
                    {/* TODO */}
                  <img src={getImageUrl(`queue/item${item}.png`)} alt={`Item ${item}`} />
                  <div className={styles.itemText}>
                    <p>{`Time`}</p>
                  </div>
                </div>
              )
            })}
          </ul>
        </article>
      </figure>
    );
}