import styles from "./Report.module.css";

import { Header } from "@components/common";
import { Report as ReportModule, UserBanner } from "@components/module";

function Report() {
  return (
    <div className={styles.container}>
      <Header title="Admin Dashboard" className={styles.header}>
        <UserBanner imgSize={56} />
      </Header>
      <div className={styles.content}>
        <ReportModule.ReportCard title={"Inventory Report"} />
        <ReportModule.ReportCard title={"Sales Report"} />
        <ReportModule.ReportCard title={"Transaction List"} />
        <ReportModule.ReportItem className={styles.fill} title={"Employee Details"} />
      </div>
    </div>
  );
}

export default Report;
