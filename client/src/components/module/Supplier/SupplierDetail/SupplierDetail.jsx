import { clsx } from "clsx";

import { Button } from "@components/common";
import format from "@utils/format";

import styles from "./SupplierDetail.module.css";

function SupplierDetail({
  id = 0,
  name = "Supplier Name",
  building = "Supplier Building",
  streetNumber = "00",
  streetName = "Street Name",
  city = "City",
  zipCode = "9999",
  contactNumber = "09999999999",
  email = "supplier@email.com",
  isActive = false,
  onViewStock,
  onStatusChange,
  onEdit,
  showSupplierEditButton = false,
  statusChangeDisabled = false,
}) {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Supplier Details</h3>
        <header>
          <p>{format.id(id, "SupplierID")}</p>
          <h4 className={styles.name}>{name}</h4>
        </header>
        <p className={styles.detail}>
          <span>Building</span>
          <span>{building || "N/A"}</span>
        </p>
        <p className={styles.detail}>
          <span>Street Number</span>
          <span>{streetNumber || "N/A"}</span>
        </p>
        <p className={styles.detail}>
          <span>Street Name</span>
          <span>{streetName || "N/A"}</span>
        </p>
        <p className={styles.detail}>
          <span>City</span>
          <span>{city}</span>
        </p>
        <p className={styles.detail}>
          <span>Zip Code</span>
          <span>{zipCode}</span>
        </p>
        <p className={clsx(styles.detail, styles.col)}>
          <span>Contact Number</span>
          <span>{contactNumber}</span>
        </p>
        <p className={clsx(styles.detail, styles.col)}>
          <span>Email</span>
          <span>{email}</span>
        </p>
        <p className={styles.detail}>
          <span>Status</span>
          <span className={isActive ? styles.active : styles.inactive}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>
      <div className={styles.buttons}>
        <Button type="button" label="View Stock" secondary onClick={onViewStock} />
        {showSupplierEditButton ? (
          <>
            <Button
              type="button"
              label={isActive ? "Deactivate" : "Activate"}
              onClick={onStatusChange}
              disabled={statusChangeDisabled}
              secondary
            />
            <Button type="button" label="Edit" onClick={onEdit} />
          </>
        ) : null}
      </div>
    </>
  );
}

export default SupplierDetail;
