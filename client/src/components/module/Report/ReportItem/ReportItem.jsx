import { clsx } from "clsx";

import ReportForm from "../ReportForm";
import styles from "./ReportItem.module.css";

function ReportItem({ title, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.footer}>
        <ReportForm className={styles.form} />
      </div>
    </div>
  );
}

export default ReportItem;
