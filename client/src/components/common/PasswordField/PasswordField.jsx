import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

import Field from "../Field";
import styles from "./PasswordField.module.css";

function PasswordField({ label, id, error, className, type, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} id={id} error={error} className={className}>
      <div className={styles.container}>
        <input type={visible ? "text" : "password"} id={id} {...props} />
        <button type="button" onClick={() => setVisible(!visible)}>
          {visible ? <FiEye className={styles.icon} size={24} /> : <FiEyeOff className={styles.icon} size={24} />}
        </button>
      </div>
    </Field>
  );
}

export default PasswordField;
