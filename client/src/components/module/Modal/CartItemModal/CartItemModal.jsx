import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Field, Modal } from "@components/common";
import styles from "./CartItemModal.module.css";

function CartItemModal({ open, onClose, onSubmit, min, max }) {
  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validationSchema: Yup.object({
      quantity: Yup.number().label("Quantity").min(min).max(max).required("Quantity is required."),
    }),
    onSubmit: (values) => {
      onSubmit(values, formik.setSubmitting);
    },
  });

  return (
    <Modal open={open} onClose={onClose} fadeIn withCloseBtn>
      <form method="POST" className={styles.content} onSubmit={formik.handleSubmit}>
        <Field
          type="number"
          label="Quantity"
          id="quantity"
          name="quantity"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.quantity}
          error={formik.touched.quantity && formik.errors.quantity}
        />
        <Button type="submit" label="Add to Cart" disabled={formik.isSubmitting} />
      </form>
    </Modal>
  );
}

export default CartItemModal;
