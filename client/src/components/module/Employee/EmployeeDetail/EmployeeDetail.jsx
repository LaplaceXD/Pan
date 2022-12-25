import { clsx } from "clsx";

import { BoxImage, Button } from "@components/common";
import format from "@utils/format";

import styles from "./EmployeeDetail.module.css";

function EmployeeDetail({
  img,
  id = 0,
  name = "Employee Name",
  email = "employee@email.com",
  contactNumber = "09999999999",
  dateEmployed = "1970-01-01",
  isActive = false,
  onResetPassword,
  onStatusChange,
  onEdit,
  resetPasswordDisabled = false,
  statusChangeDisabled = false,
}) {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Employee Details</h3>
        <BoxImage className={styles.img} src={img} alt={`${name}'s image.`} size={256} />
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.detail}>
          <span>ID number</span>
          <span>{format.id(id)}</span>
        </p>
        <p className={clsx(styles.detail, styles.email)}>
          <span>Email</span>
          <span>{email}</span>
        </p>
        <p className={styles.detail}>
          <span>Contact Number</span>
          <span>{contactNumber}</span>
        </p>
        <p className={styles.detail}>
          <span>Date Employed</span>
          <span>{format.date(dateEmployed)}</span>
        </p>
        <p className={styles.detail}>
          <span>Status</span>
          <span className={isActive ? styles.active : styles.inactive}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </p>
      </div>
      <div className={styles.buttons}>
        <Button
          type="button"
          label="Reset Password"
          onClick={onResetPassword}
          disabled={resetPasswordDisabled}
          secondary
        />
        <Button
          type="button"
          label={isActive ? "Deactivate" : "Activate"}
          onClick={onStatusChange}
          disabled={statusChangeDisabled}
          secondary
        />
        <Button type="button" label="Edit" onClick={onEdit} />
      </div>
    </>
  );
}

export default EmployeeDetail;
