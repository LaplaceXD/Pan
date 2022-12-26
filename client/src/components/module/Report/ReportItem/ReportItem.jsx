import { clsx } from "clsx";
import { useState } from "react";

import { Button } from "@components/common";
import styles from "./ReportItem.module.css";

function ReportItem({ title, className, onDownload }) {
  const [isDownloading, setIsDownloading] = useState(false);

  return (
    <div className={clsx(styles.container, className)}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.footer}>
        <Button
          type="button"
          label="Download Report"
          onClick={async () => {
            setIsDownloading(true);
            await onDownload();
            setIsDownloading(false);
          }}
          disabled={isDownloading}
        />
      </div>
    </div>
  );
}

export default ReportItem;
