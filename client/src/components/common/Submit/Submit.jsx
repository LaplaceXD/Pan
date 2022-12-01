import styles from "./Submit.module.css";

function Submit({ label, ...props }) {
  return <input className={styles.submit} type="submit" value={label} {...props} />;
}

export default Submit;
