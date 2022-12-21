import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Field, Modal } from "@components/common";
import styles from "./CategoryEditModal.module.css";

function CategoryEditModal({ open, onClose, value = "", validationSchema, onSubmit }) {
  const formik = useFormik({
    initialValues: { category: value },
    validationSchema: Yup.object({
      category: validationSchema,
    }),
    onSubmit: (values) => {
      onSubmit(values, formik.setSubmitting);
    },
    enableReinitialize: true,
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} withCloseBtn>
      <form method="dialog" onSubmit={formik.handleSubmit} className={styles.content}>
        <Field
          type="text"
          id="category"
          label="Category"
          name="category"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.category}
          error={formik.touched.category && formik.errors.category}
        />
        <Button label="Save" type="submit" disabled={formik.isSubmitting} />
      </form>
    </Modal>
  );
}

export default CategoryEditModal;
