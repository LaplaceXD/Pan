import { clsx } from "clsx";

import { Button } from "@components/common";
import styles from "./ReportItem.module.css";

function ReportItem({ title, className, onDownload }) {
  return (
    <div className={clsx(styles.container, className)}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.footer}>
        <Button type="button" label="Download Report" onClick={onDownload} />
      </div>
    </div>
  );
}

export default ReportItem;
