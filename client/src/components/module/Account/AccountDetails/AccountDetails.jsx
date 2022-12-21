import { Button } from "@components/common";

import format from "@utils/format";
import styles from "./AccountDetails.module.css";

function AccountDetails({
  name = "Account Name",
  id = 0,
  email = "email@email.com",
  contact = "09999999999",
  onEditClick,
  onChangePassClick,
}) {
  return (
    <article className={styles.container}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.detail}>
        <span className={styles.label}>ID number</span>
        <span className={styles.value}>{format.id(id)}</span>
      </p>
      <p className={styles.detail}>
        <span className={styles.label}>Email Address</span>
        <span className={styles.value}>{email}</span>
      </p>
      <p className={styles.detail}>
        <span className={styles.label}>Contact Number</span>
        <span className={styles.value}>{contact}</span>
      </p>
      <div className={styles.buttons}>
        <Button type="button" label="Edit Profile" onClick={onEditClick} secondary />
        <Button type="button" label="Change Password" onClick={onChangePassClick} secondary />
      </div>
    </article>
  );
}

export default AccountDetails;
