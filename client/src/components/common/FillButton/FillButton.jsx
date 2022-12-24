import { clsx } from "clsx";
import { BsPlusCircle } from "react-icons/bs";

import styles from "./FillButton.module.css";

function FillButton({ label, className, ...props }) {
  return (
    <button className={clsx(styles.btn, className)} {...props}>
      <BsPlusCircle size={128} />
      {label}
    </button>
  );
}

export default FillButton;
