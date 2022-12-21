import { useFormik } from "formik";
import React from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";
import * as Yup from "yup";

import { Button, Field } from "@components/common";
import { useMutation } from "@hooks";
import { editEmployeeById } from "@services/employee";
import format from "@utils/format";

import styles from "./EditForm.module.css";

function EditForm({ id = 0, firstName = "", lastName = "", email = "", contact = "", onCancel, onSubmit }) {
  const queryClient = useQueryClient();
  const editEmployee = useMutation(
    async ({ employee_id, ...body }) => await editEmployeeById(employee_id, body)
  );

  const formik = useFormik({
    initialValues: { firstName, lastName, email, contact },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .label("First Name")
        .min(2)
        .max(100)
        .matches(/^[A-Za-z\s]*$/, "First Name must contain letters and spaces only.")
        .required(),
      lastName: Yup.string()
        .label("Last Name")
        .min(2)
        .max(100)
        .matches(/^[A-Za-z\s]*$/, "First Name must contain letters and spaces only.")
        .required(),
      email: Yup.string().label("Email").email("Invalid email.").required(),
      contact: Yup.string()
        .label("Contact Number")
        .matches(/^\d*$/, "Invalid contact number.")
        .length(11)
        .required(),
    }),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const { error, isRedirect } = await editEmployee.execute({
        employee_id: id,
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        contact_no: values.contact,
      });
      formik.setSubmitting(false);

      if (isRedirect) return;
      if (error) return toast.error(format.error(error));

      queryClient.invalidateQueries(["account", id]);
      toast.success("Account details edited successfully.");
      onSubmit();
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
        error={formik.touched.firstName && formik.errors.firstName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Field
        label="Last Name"
        type="text"
        id="lastName"
        name="lastName"
        className={styles.field}
        value={formik.values.lastName}
        error={formik.touched.lastName && formik.errors.lastName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Field
        label="Email address"
        type="text"
        id="email"
        name="email"
        className={styles.field}
        value={formik.values.email}
        error={formik.touched.email && formik.errors.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <Field
        label="Contact Number"
        type="text"
        id="contact"
        name="contact"
        className={styles.field}
        value={formik.values.contact}
        error={formik.touched.contact && formik.errors.contact}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" onClick={onCancel} secondary />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default EditForm;
