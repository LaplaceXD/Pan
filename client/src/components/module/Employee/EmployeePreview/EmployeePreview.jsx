import { clsx } from "clsx";
import styles from "./EmployeePreview.module.css";

function EmployeePreview({ className, title = "Employee Details", children }) {
  return (
    <section className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}

export default EmployeePreview;
