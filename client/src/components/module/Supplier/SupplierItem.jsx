import styles from "./SupplierItem/SupplierItem.module.css";

function  SupplierItem({ id, name, contactNumber, address }) {
    return (
        <li className={styles.container}>
            <div>
                <p className={styles.label}>Supplier {id}</p>
                <h2 className={styles.supplierName}>{name}</h2>
            </div>
            <div className={styles.details}>
                <div className={styles.contactContainer}>
                    <p className={styles.label}>Contact:</p>
                    <h2 className={styles.supplierContact}>{contactNumber}</h2>
                </div>
                <div className={styles.addressContainer}>
                    <p className={styles.label}>Address:</p>
                    <h2 className={styles.supplierAddress}>{address}</h2>
                </div>
            </div>
        </li>
    );
}

export default SupplierItem;