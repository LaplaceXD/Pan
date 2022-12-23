import { Field } from "@components/common";
import styles from "./TextAreaField.module.css";

function TextAreaField({ label, id, error, className, ...props }) {
  return (
    <Field label={label} id={id} className={className} error={error}>
      <textarea className={styles.textarea} id={id} {...props} />
    </Field>
  );
}

export default TextAreaField;
