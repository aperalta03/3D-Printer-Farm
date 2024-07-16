import React from 'react';
import { getImageUrl } from '../../utils.js'
import styles from './header.module.css';

export const Header = () => {
    //const backgroundImage = getImageUrl("images/background.png");
    return (
        <section className={styles.container}>
            <div className={styles.imgContainer}>
                <img
                    className={styles.img}
                    src={getImageUrl("images/openhub.png")}
                    alt="OpenHub Logo"
                />
            </div>
            <div className={styles.titleBox}>
                <h3 className={styles.title}> 3D Printers Hub </h3>
            </div>
            <div className={styles.leftBlur}/>
            <div className={styles.topRightBlur}/>
            <div className={styles.botRightBlur}/>
        </section>
    )
}