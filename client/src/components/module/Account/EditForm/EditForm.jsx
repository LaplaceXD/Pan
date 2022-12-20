import { Button, Field } from "@components/common";
import { useFormik } from "formik";

import styles from "./EditForm.module.css";

function EditForm({ firstName, lastName, email, contact, onCancel }) {
    const formik = useFormik({
        initialValues: {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${email}`,
            contact: `${contact}`,
        }
    });

  return (
    <form method="POST" className={styles.container}>
      <Field
        label="First Name"
        type="text"
        id="firstName"
        name="firstName"
        className={styles.field}
        value={formik.values.firstName}
        onChange={formik.handleChange}
      />
      <Field
        label="Last Name"
        type="text"
        id="lastName"
        name="lastName"
        className={styles.field}
        value={formik.values.lastName}
        onChange={formik.handleChange}
      />
      <Field
        label="Email address"
        type="text"
        id="email"
        name="email"
        className={styles.field}
        value={formik.values.email}
        onChange={formik.handleChange}
      />
      <Field
        label="Contact Number"
        type="text"
        id="contact"
        name="contact"
        className={styles.field}
        value={formik.values.contact}
        onChange={formik.handleChange}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" />
      </div>
    </form>
  );
}

export default EditForm;
