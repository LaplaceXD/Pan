import styles from "./ReportItem.module.css";

import { Button } from "@components/common";

function ReportItem({ title }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.footer}>
          <Button label="Download" className={styles.btn} />
        </div>
      </div>
    </div>
  );
}

export default ReportItem;
