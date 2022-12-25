import { clsx } from "clsx";
import styles from "./Empty.module.css";

function Empty({ label = "There are no items to show. 😅", className }) {
  return <p className={clsx(styles.empty, className)}>{label}</p>;
}

export default Empty;
