import { clsx } from "clsx";
import styles from "./Loader.module.css";

function Loader({ label = "Loading...", fill = false, className }) {
  return (
    <div className={clsx(styles.loader, fill && styles.fill, className)}>
      <p>{label}</p>
    </div>
  );
}

export default Loader;
