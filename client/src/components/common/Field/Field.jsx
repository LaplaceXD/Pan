import { clsx } from "clsx";
import styles from "./Field.module.css";

function Field({ label, id, error, className, children, ...props }) {
  return (
    <div className={clsx(styles.container, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {children || <input className={styles.input} id={id} {...props} />}
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  );
}

export default Field;
