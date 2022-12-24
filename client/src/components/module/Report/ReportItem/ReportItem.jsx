import styles from "./ReportItem.module.css";

function ReportItem({ title, href }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.footer}>
          <a className={styles.btn} href={href} download>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default ReportItem;
