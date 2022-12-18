import format from "@utils/format";
import styles from "./SupplierItem.module.css";

function SupplierItem({ id, name, contactNumber, address }) {
  return (
    <li className={styles.container}>
      <div>
        <p className={styles.label}>{format.id(id, "SupplierID")}</p>
        <p className={styles.supplierName}>{name}</p>
      </div>
      <div className={styles.details}>
        <div className={styles.contactContainer}>
          <p className={styles.label}>Contact:</p>
          <p className={styles.supplierContact}>{contactNumber}</p>
        </div>
        <div className={styles.addressContainer}>
          <p className={styles.label}>Address:</p>
          <p className={styles.supplierAddress}>{address}</p>
        </div>
      </div>
    </li>
  );
}

export default SupplierItem;
