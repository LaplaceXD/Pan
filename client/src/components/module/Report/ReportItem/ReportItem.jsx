import { clsx } from "clsx";

import ReportForm from "../ReportForm";
import styles from "./ReportItem.module.css";

function ReportItem({ title, className, onDownload }) {
  return (
    <div className={clsx(styles.container, className)}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.footer}>
        <ReportForm className={styles.form} onDownload={onDownload} />
      </div>
    </div>
  );
}

export default ReportItem;
