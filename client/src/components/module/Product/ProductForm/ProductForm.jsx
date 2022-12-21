import { BoxImage, Button, Field, Select } from "@components/common";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useQuery } from "@hooks";
import { getAllCategories } from "@services/category";
import styles from "./ProductForm.module.css";

function ProductForm({ img, name = "", categoryId = 0, description = "", price = 0, onCancel, onSubmit }) {
  const { data: categories } = useQuery("categories", getAllCategories);

  const formik = useFormik({
    initialValues: { name, category: categoryId, description, price: price },
    validateYupSchema: Yup.object({
      name: Yup.string().label("Product Name").required(),
      category: Yup.number().integer().label("Category").required(),
      description: Yup.string().label("Description").required(),
      price: Yup.number().label("Unit Price").required(),
    }),
    onSubmit: (values) => {
      onSubmit(values, formik.setSubmitting);
    },
  });

  return (
    <form method="POST" className={styles.container} onSubmit={formik.handleSubmit}>
      <h3 className={styles.title}>Product Details</h3>
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
      <Select
        label="Category"
        id="category"
        error={formik.touched.category && formik.errors.category}
        onBlur={formik.handleBlur}
        onChange={(item) => formik.setFieldValue("category", item?.value ?? formik.initialValues.category)}
        onCreateOption={(value) => console.log(value)}
        options={categories.map(({ category_id, name }) => ({ label: name, value: category_id }))}
        value={formik.values.category}
        isClearable
      />
      <Field
        label="Description"
        id="description"
        className={styles.description}
        error={formik.touched.description && formik.errors.description}
      >
        <textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
      </Field>
      <Field
        type="text"
        label="Unit Price"
        id="price"
        name="price"
        onChange={formik.handleChange}
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
