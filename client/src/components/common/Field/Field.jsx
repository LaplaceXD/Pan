import styles from "./Field.module.css";

function Field({ label, id, ...props }) {
  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input className={styles.input} {...props} />
    </div>
  );
}

export default Field;
