import { Button, Field } from "@components/common";

import styles from "./ChangePasswordForm.module.css";

function EditForm({ onCancel }) {
  return (
    <form method="POST" className={styles.container}>
      <Field label="Current Password" type="password" id="currentPass" name="currentPass" />
      <Field label="New Password" type="password" id="newPass" name="newPass" />
      <Field label="Confirm Password" type="password" id="confirmPass" name="confirmPass" />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" />
      </div>
    </form>
  );
}

export default EditForm;
