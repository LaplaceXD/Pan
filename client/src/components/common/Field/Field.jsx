import { clsx } from "clsx";
import styles from "./Field.module.css";

function Field({ label, id, error, className, ...props }) {
  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input className={styles.input} {...props} />
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export default Field;
