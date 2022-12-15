import React from "react";
import styles from "./Modal.module.css";

function Modal({ title, subtitle, leftBtn, rightBtn, leftOnClick }) {
  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.title}>{title}</div>
          <div className={styles.subtitle}>{subtitle}</div>
          <div className={styles.footer}>
            <button className={styles.leftButton} onClick={leftOnClick}>
              {leftBtn}
            </button>
            <button className={styles.rightButton}>{rightBtn}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
