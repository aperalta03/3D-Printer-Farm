import React from 'react';
import { getImageUrl } from '../../utils.js'
import styles from './header.module.css';
import { useAuth } from '../Nested/Context/authentication';

export const Header = () => {
    //Log Out Authentication
    const { logout } = useAuth();

    return (
        <section className={styles.container}>
            <div className={styles.imgContainer}>
                {/* OpenHub Logo */}
                <img
                    className={styles.img}
                    src={getImageUrl("images/openhub.png")}
                    alt="OpenHub Logo"
                />
            </div>
            <div className={styles.titleBox}>
                <h3 className={styles.title}> 3D Printers Hub </h3>
            </div>
            {/* Blur Effects */}
            <div className={styles.leftBlur}/>
            <div className={styles.topRightBlur}/>
            <div className={styles.botRightBlur}/>
            {/* Logout Button*/}
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
        </section>
    )
}