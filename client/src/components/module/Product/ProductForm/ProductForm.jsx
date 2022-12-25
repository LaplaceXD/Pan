import { useFormik } from "formik";
import * as Yup from "yup";

import { BoxImage, Button, Field, TextAreaField } from "@components/common";
import { Category } from "@components/module";
import check from "@utils/check";

import styles from "./ProductForm.module.css";

function ProductForm({
  title,
  img,
  name = "",
  categoryId = 0,
  description = "",
  price = 0,
  onCancel,
  onSubmit,
}) {
  const formik = useFormik({
    initialValues: { name, category: categoryId, description, price: price },
    validationSchema: Yup.object({
      name: Yup.string()
        .label("Product Name")
        .min(2)
        .max(100)
        .matches(/^[\w\s\&]*$/, "Product Name must contain letters, digits, and spaces only.")
        .required(),
      category: Yup.number().integer().label("Category").min(0).nullable(),
      description: Yup.string().label("Description").min(2).max(300).required(),
      price: Yup.number().label("Unit Price").min(0.01).required(),
    }),
    onSubmit: ({ category, ...values }) => {
      onSubmit(
        {
          name: values.name,
          description: values.description,
          unit_price: values.price,
          category_id: category !== 0 ? category : null,
        },
        formik.setSubmitting
      );
    },
    enableReinitialize: true,
  });

  function handlePriceChange(e) {
    const checks = { maxIntLength: 5, maxFracLength: 2 };
    if (check.number(e.currentTarget.value, checks)) formik.handleChange(e);
  }

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <h3 className={styles.title}>{title}</h3>
      <BoxImage className={styles.img} src={img} alt={`${name}'s image.`} size={256} />
      <Field
        type="text"
        label="Product Name"
        id="name"
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.name}
        error={formik.touched.name && formik.errors.name}
      />
      <Category.Select
        error={formik.touched.category && formik.errors.category}
        onBlur={formik.handleBlur}
        onChange={(item) => formik.setFieldValue("category", item?.value ?? 0)}
        value={formik.values.category}
        isDisabled={formik.isSubmitting}
      />
      <TextAreaField
        className={styles.description}
        label="Description"
        id="description"
        name="description"
        value={formik.values.description}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.description && formik.errors.description}
      />
      <Field
        type="number"
        label="Unit Price"
        id="price"
        name="price"
        onChange={handlePriceChange}
        onBlur={formik.handleBlur}
        value={formik.values.price}
        error={formik.touched.price && formik.errors.price}
      />

      <div className={styles.buttons}>
        <Button type="button" label="Cancel" secondary onClick={onCancel} />
        <Button type="submit" label="Save" disabled={formik.isSubmitting} />
      </div>
    </form>
  );
}

export default ProductForm;
