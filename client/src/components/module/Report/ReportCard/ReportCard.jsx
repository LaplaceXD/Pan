import banner from "@assets/imgs/login_banner.jpg";
import styles from "./ReportCard.module.css";

import { Button } from "@components/common";

function ReportCard({ title }) {
  return (
    <div className={styles.container}>
      <img src={banner} alt="Bread." className={styles.img} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.footer}>
          <Button label="Download Latest Report" className={styles.btn} />
          <Button label="View Past Report" className={styles.btn} secondary />
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
