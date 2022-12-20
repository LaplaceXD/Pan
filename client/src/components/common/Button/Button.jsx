import clsx from "clsx";
import styles from "./Button.module.css";

function Button({ label, secondary, error, className, ...props }) {
  return (
    <button
      className={clsx(styles.btn, secondary && styles.secondary, error && styles.error, className)}
      {...props}
    >
      {label}
    </button>
  );
}

export default Button;
