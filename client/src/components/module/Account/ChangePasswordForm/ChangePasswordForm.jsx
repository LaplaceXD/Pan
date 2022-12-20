import { Button, PasswordField } from "@components/common";

import styles from "./ChangePasswordForm.module.css";

function EditForm({ onCancel }) {
  return (
    <form method="POST" className={styles.container}>
      <PasswordField label="Current Password" id="currentPass" name="currentPass" />
      <PasswordField label="New Password" id="newPass" name="newPass" />
      <PasswordField label="Confirm Password" id="confirmPass" name="confirmPass" />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" />
      </div>
    </form>
  );
}

export default EditForm;
