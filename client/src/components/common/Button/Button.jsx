import clsx from "clsx";
import styles from "./Button.module.css";

function Button({ label, secondary, ...props }) {
  return (
    <button className={clsx(styles.btn, secondary && styles.secondary)} {...props}>
      {label}
    </button>
  );
}

export default Button;
