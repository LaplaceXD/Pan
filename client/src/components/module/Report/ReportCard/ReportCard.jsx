import banner from "@assets/imgs/login_banner.jpg";
import styles from "./ReportCard.module.css";

function ReportCard({ title, href }) {
  return (
    <div className={styles.container}>
      <img src={banner} alt="Bread." className={styles.img} />
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.footer}>
          <a className={styles.btn} href={href} download>
            Download Report
          </a>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
