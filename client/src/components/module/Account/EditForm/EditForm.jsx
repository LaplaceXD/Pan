import React from "react";
import { Button, Field } from "@components/common";
import { useFormik } from "formik";
import { useMutation } from "@hooks";
import { editEmployee as editEmployeeService } from "@services/employee";
import { toast } from "react-toastify";
import styles from "./EditForm.module.css";
import { pages } from "@utils";

function EditForm({ id, first_name, last_name, email, contact_no, setPage, setAccount }) {
    const editEmployee = useMutation(editEmployeeService);

    const formik = useFormik({
        initialValues: {
            first_name: `${first_name}`,
            last_name: `${last_name}`,
            email: `${email}`,
            contact_no: `${contact_no}`,
        },
        onSubmit: (values) => {
            formik.setSubmitting(true);
            editEmployee.execute({ ...values, id }).then(({ error, isRedirect, data: account } ) => {
                formik.setSubmitting(false);
                if (isRedirect) return;
                if (error) return toast.error(error);

                toast.success("Employee updated successfully!");

                setAccount(account);
                setPage(pages.DETAILS);
            });
        },
    });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <Field
        label="First Name"
        type="text"
        id="first_name"
        name="first_name"
        className={styles.field}
        value={formik.values.first_name}
        onChange={formik.handleChange}
      />
      <Field
        label="Last Name"
        type="text"
        id="last_name"
        name="last_name"
        className={styles.field}
        value={formik.values.last_name}
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
        name="contact_no"
        className={styles.field}
        value={formik.values.contact_no}
        onChange={formik.handleChange}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={() => setPage(pages.DETAILS)} secondary />
        <Button type="submit" label="Save" />
      </div>
    </form>
  );
}

export default EditForm;
