import React from 'react'
import styles from './CSS/Background.module.css';

////////////////////////BackGround  Settings//////////////////////////////////////////////////

export default function Background() {

    return (
        <div className={styles.backgroundImg}>
            <div className={styles.stars}></div>
            <div className={styles.clouds}></div>
        </div>
    )
}
