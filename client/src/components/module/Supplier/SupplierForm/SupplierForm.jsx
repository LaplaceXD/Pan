import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Field } from "@components/common";

import styles from "./SupplierForm.module.css";

function SupplierForm({
  name = "",
  building = "",
  streetNumber = "",
  streetName = "",
  city = "",
  zipCode = "",
  contactNumber = "",
  email = "",
  title,
  onCancel,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: { name, building, streetNumber, streetName, city, zipCode, contactNumber, email },
    validationSchema: Yup.object({
      name: Yup.string().label("Supplier Name").min(2).max(200).required(),
      building: Yup.string()
        .label("Building Name")
        .min(2)
        .max(100)
        .matches(
          /^[\w\s\-\&\']*$/,
          "Building Name must contain letters, digits, spaces, and special characters ('&-) only."
        ),
      streetNumber: Yup.string()
        .label("Street Number")
        .min(2)
        .max(10)
        .matches(/^[\d\-]*$/, "Street Number must contain digits and dashes only."),
      streetName: Yup.string()
        .label("Street Name")
        .min(2)
        .max(100)
        .matches(
          /^[\w\s\-\&\']*$/,
          "Street Name must contain letters, digits, spaces, and special characters ('&-) only."
        ),
      city: Yup.string()
        .label("City")
        .min(2)
        .max(100)
        .matches(
          /^[\w\s\-\&\']*$/,
          "City must contain letters, digits, spaces, and special characters ('&-) only."
        )
        .required(),
      zipCode: Yup.string()
        .label("Zip Code")
        .length(4)
        .matches(/^\d*$/, "Zip Code must contain digits only.")
        .required(),
      email: Yup.string().label("Email").email("Invalid email.").required(),
      contactNumber: Yup.string()
        .label("Contact Number")
        .matches(/^\d*$/, "Invalid contact number.")
        .length(11)
        .required(),
    }),
    onSubmit: (values) => {
      const formatted = {
        name: values.name,
        building: values.building,
        city: values.city,
        zip_code: values.zipCode,
        email: values.email,
        contact_no: values.contactNumber,
        street_name: values.streetName,
        street_no: values.streetNumber,
      };

      if (streetName === "") formatted.street_no = "";
      onSubmit(formatted, formik.setSubmitting);
    },
    enableReinitialize: true,
  });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <h3 className={styles.title}>{title}</h3>
      <Field
        type="text"
        label="Supplier Name"
        id="name"
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
        error={formik.touched.name && formik.errors.name}
      />
      <Field
        type="text"
        label="Building Name"
        id="building"
        name="building"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.building}
        error={formik.touched.building && formik.errors.building}
      />

      <fieldset>
        <Field
          type="text"
          label="Street Number"
          id="streetNumber"
          name="streetNumber"
          onChange={formik.handleChang}
          onBlur={formik.handleBlur}
          value={formik.values.streetNumber}
          error={formik.touched.streetNumber && formik.errors.streetNumber}
        />
        <Field
          type="text"
          label="Street Name"
          id="streetName"
          name="streetName"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.streetName}
          error={formik.touched.streetName && formik.errors.streetName}
        />
      </fieldset>

      <fieldset>
        <Field
          type="text"
          label="City"
          id="city"
          name="city"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.city}
          error={formik.touched.city && formik.errors.city}
        />
        <Field
          type="text"
          label="Zip Code"
          id="zipCode"
          name="zipCode"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.zipCode}
          error={formik.touched.zipCode && formik.errors.zipCode}
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

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" secondary onClick={onCancel} />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default SupplierForm;
