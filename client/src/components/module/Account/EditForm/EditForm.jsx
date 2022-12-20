import { Button, Field } from "@components/common";

import styles from "./EditForm.module.css";

function EditForm({ firstName, lastName, email, contact, onCancel }) {
  return (
    <form method="POST" className={styles.container}>
      <Field
        label="First Name"
        type="text"
        id="firstName"
        name="firstName"
        className={styles.field}
        value={firstName}
      />
      <Field
        label="Last Name"
        type="text"
        id="lastName"
        name="lastName"
        className={styles.field}
        value={lastName}
      />
      <Field
        label="Email address"
        type="text"
        id="email"
        name="email"
        className={styles.field}
        value={email}
      />
      <Field
        label="Contact Number"
        type="text"
        id="contact"
        name="contact"
        className={styles.field}
        value={contact}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" />
      </div>
    </form>
  );
}

export default EditForm;
