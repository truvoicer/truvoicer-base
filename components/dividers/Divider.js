import React from 'react';
import styles from './divider.module.css';
function Divider({children, classes = ''}) {
    return (
        <div className={`${styles.separator} ${classes}`}>
            {children}
        </div>
    );
}

export default Divider;
