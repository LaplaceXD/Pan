import { clsx } from "clsx";

import { BoxImage } from "@components/common";
import format from "@utils/format";
import styles from "./EmployeeItem.module.css";

function EmployeeItem({
  id = 0,
  name = "Employee Name",
  contactNumber = "09999999999",
  date = "1970-01-01",
  img,
  onClick,
  isSelected = false,
}) {
  return (
    <li className={clsx(styles.item, isSelected && styles.isSelected)} onClick={onClick}>
      <BoxImage src={img} alt={`${name} image.`} className={styles.img} />
      <article className={styles.content}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.detail}>
          <span>ID:</span>
          <span>{format.id(id)}</span>
        </p>
        <p className={styles.detail}>
          <span>Contact Number:</span>
          <span>{contactNumber}</span>
        </p>
        <p className={styles.detail}>
          <span>Employee Since:</span>
          <span>{format.date(date)}</span>
        </p>
      </article>
    </li>
  );
}

export default EmployeeItem;
