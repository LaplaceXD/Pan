import { useFormik } from "formik";
import * as Yup from "yup";

import { Button, Field, Modal } from "@components/common";
import format from "@utils/format";

import styles from "./NumberInputModal.module.css";

function NumberInputModal({
  open,
  onClose,
  onSubmit,
  name,
  buttonLabel = "Confirm",
  min = 0,
  max = Infinity,
  maxLength = 5,
  maxDecimalLength = 2,
  initialValue = 0,
  isInteger = false,
  children,
}) {
  const capitalized = format.capitalize(name);
  let schema = Yup.number().label(capitalized).min(min).max(max).required();
  if (isInteger) schema = schema.integer(capitalized + " must be a whole number.");

  const formik = useFormik({
    initialValues: {
      [name]: initialValue,
    },
    validationSchema: Yup.object({
      [name]: schema,
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

  function handleChange(e) {
    const [int, frac] = e.currentTarget.value.split(".");
    const intIsWithinMaxLength = int.length <= maxLength;
    const fracIsWithinMaxLength = frac ? frac.length <= maxDecimalLength : true;

    if (intIsWithinMaxLength && fracIsWithinMaxLength) {
      formik.handleChange(e);
    }
  }

  return (
    <Modal open={open} onClose={handleClose} fadeIn withCloseBtn>
      <div className={styles.container}>
        <form method="POST" className={styles.content} onSubmit={formik.handleSubmit}>
          <Field
            type="number"
            label={capitalized}
            id={name}
            name={name}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[name]}
            error={formik.errors[name]}
          />
          {children ? children(formik.values) : null}
          <Button type="submit" label={buttonLabel} disabled={formik.errors[name] || formik.isSubmitting} />
        </form>
      </div>
    </Modal>
  );
}

export default NumberInputModal;
