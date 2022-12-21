import { BoxImage, Button, Field } from "@components/common";
import { Category } from "@components/module";
import { useFormik } from "formik";
import * as Yup from "yup";

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
      name: Yup.string().label("Product Name").min(2).max(100).required(),
      category: Yup.number().integer().label("Category").required(),
      description: Yup.string().label("Description").min(2).max(300).required(),
      price: Yup.number().label("Unit Price").min(0.01).required(),
    }),
    onSubmit: ({ category, ...values }) => {
      if (category !== 0) values["category"] = category;
      onSubmit(values, formik.setSubmitting);
    },
  });

  function handlePriceChange(e) {
    const INT_MAX_LENGTH = 5;
    const FRAC_MAX_LENGTH = 2;

    const [int, frac] = e.currentTarget.value.split(".");
    const intIsWithinMaxLength = int.length <= INT_MAX_LENGTH;
    const fracIsWithinMaxLength = frac ? frac.length <= FRAC_MAX_LENGTH : true;

    if (intIsWithinMaxLength && fracIsWithinMaxLength) {
      formik.handleChange(e);
    }
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
