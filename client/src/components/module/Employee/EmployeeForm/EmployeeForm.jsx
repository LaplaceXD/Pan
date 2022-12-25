import { useFormik } from "formik";
import * as Yup from "yup";

import { BoxImage, Button, Field } from "@components/common";

import styles from "./EmployeeForm.module.css";

function EmployeeForm({
  title,
  img,
  firstName = "",
  lastName = "",
  contactNumber = "",
  email = "",
  dateEmployed = "",
  onCancel,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: { firstName, lastName, email, contactNumber, dateEmployed },
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
      contactNumber: Yup.string()
        .label("Contact Number")
        .matches(/^\d*$/, "Invalid contact number.")
        .length(11)
        .required(),
      dateEmployed: Yup.date().label("Date Employed").max(new Date()).required(),
    }),
    onSubmit: async (values) => {
      onSubmit(
        {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          contact_no: values.contactNumber,
          date_employed: values.dateEmployed,
        },
        formik.setSubmitting
      );
    },
  });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <h3 className={styles.title}>{title}</h3>
      <BoxImage className={styles.img} src={img} alt={`${firstName} ${lastName}'s image.`} size={256} />
      <fieldset>
        <Field
          type="text"
          label="First Name"
          id="firstName"
          name="firstName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
          error={formik.touched.firstName && formik.errors.firstName}
        />
        <Field
          type="text"
          label="Last Name"
          id="lastName"
          name="lastName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
          error={formik.touched.lastName && formik.errors.lastName}
        />
      </fieldset>

      <Field
        type="email"
        label="Email"
        id="email"
        name="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
        error={formik.touched.email && formik.errors.email}
      />
      <Field
        type="text"
        label="Contact Number"
        id="contactNumber"
        name="contactNumber"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.contactNumber}
        error={formik.touched.contactNumber && formik.errors.contactNumber}
      />
      <Field
        type="date"
        label="Date Employed"
        name="dateEmployed"
        id="dateEmployed"
        max={new Date().toISOString().split("T")[0]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.dateEmployed?.split("T")[0]}
        error={formik.touched.dateEmployed && formik.errors.dateEmployed}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" secondary onClick={onCancel} />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default EmployeeForm;
