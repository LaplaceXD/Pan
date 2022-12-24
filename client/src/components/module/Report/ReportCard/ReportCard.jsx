import banner from "@assets/imgs/login_banner.jpg";

import ReportForm from "../ReportForm";
import styles from "./ReportCard.module.css";

function ReportCard({ title, onDownload }) {
  return (
    <div className={styles.container}>
      <img src={banner} alt="Bread." className={styles.img} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <ReportForm className={styles.form} onDownload={onDownload} />
      </div>
    </div>
  );
}

export default ReportCard;
