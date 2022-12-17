import clsx from "clsx";
import styles from "./Button.module.css";

function Button({ label, secondary, className, ...props }) {
  return (
    <button className={clsx(styles.btn, secondary && styles.secondary, className)} {...props}>
      {label}
    </button>
  );
}

export default Button;
