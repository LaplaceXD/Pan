import styles from "./EmployeeItem.module.css";

import format from "@utils/format";
import { clsx } from "clsx";

function EmployeeItem({ id, name, contact_no, date, img, onClick, isSelected = false, disabled = false }) {
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
          <p className={styles.data}>{format.id(id)}</p>
        </div>
        <div className={styles.line}>
          <p className={styles.label}>Contact Number:</p>
          <p className={styles.data}>{contact_no}</p>
        </div>
        <div className={styles.line}>
          <p className={styles.label}>Employee Since:</p>
          <p className={styles.data}>{format.date(date)}</p>
        </div>
      </div>
    </li>
  );
}

export default EmployeeItem;
