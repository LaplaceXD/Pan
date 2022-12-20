import React from "react";
import { Button, Field } from "@components/common";
import { useFormik } from "formik";
import { useMutation } from "@hooks";
import { editEmployee as editEmployeeService } from "@services/employee";

import styles from "./EditForm.module.css";

function EditForm({ id, firstName, lastName, email, contact, onCancel }) {
    const editEmployee = useMutation(editEmployeeService);

    const formik = useFormik({
        initialValues: {
            firstName: `${firstName}`,
            lastName: `${lastName}`,
            email: `${email}`,
            contact: `${contact}`,
        },
        onSubmit: async (values) => {
            const { error, isRedirect } = await editEmployee.execute(id);

            alert(JSON.stringify(values, null, 2));

            console.log(error, isRedirect);

            // setSubmitting(false);
            // if (isRedirect) return;
            // if (error) return toast.error(error);
            //
            // cartConfirmModal.close();
            // cart.clear();
            // toast.success("Order placed.");
        },
    });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
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
