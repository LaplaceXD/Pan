import styles from "./SupplierItem.module.css";

function  SupplierItem({ id, name, number, str_no, str_name, bldg, city, zip_code }) {
    return (
        <li className={styles.container}>
            <div>
                <p className={styles.label}>Supplier-ID# {id}</p>
                <h2 className={styles.supplierName}>{name}</h2>
            </div>
            <div className={styles.details}>
                <div className={styles.contactContainer}>
                    <p className={styles.label}>Contact:</p>
                    <h2 className={styles.supplierContact}>{number}</h2>
                </div>
                <div className={styles.addressContainer}>
                    <p className={styles.label}>Address:</p>
                    <h2 className={styles.supplierAddress}>{str_no} {str_name}, {bldg}, {city} {zip_code}</h2>
                </div>
            </div>
        </li>
    );
}

export default SupplierItem;