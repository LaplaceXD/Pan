import React from "react";
import styles from "./EmployeeCard.module.css";

import { clsx } from "clsx";

function EmployeeCard({ id, name, contact_no, date, img, onClick, isSelected = false, disabled = false }) {
  return (
    <li
      className={clsx(
        styles.item,
        disabled && styles.disabled,
        !disabled && isSelected && styles.isSelected
      )}
      onClick={onClick}
    >
      <div className={styles.img}>
        <img src={img} className={styles.img} />
      </div>
      <div className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <div className={styles.line}>
          <p className={styles.label}>ID:</p>
          <p className={styles.data}>{id}</p>
        </div>
        <div className={styles.line}>
          <p className={styles.label}>Contact Number:</p>
          <p className={styles.data}>{contact_no}</p>
        </div>
        <div className={styles.line}>
          <p className={styles.label}>Employee Since:</p>
          <p className={styles.data}>{date}</p>
        </div>
      </div>
    </li>
  );
}

export default EmployeeCard;
