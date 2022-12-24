import styles from "./Report.module.css";

import { Header } from "@components/common";
import { Report as ReportModule, UserBanner } from "@components/module";

const baseUrl = import.meta.env.VITE_SERVER_URL;

function Report() {
  return (
    <div className={styles.container}>
      <Header title="Admin Dashboard" className={styles.header}>
        <UserBanner imgSize={56} />
      </Header>
      <div className={styles.content}>
        <div className={styles.cards}>
          <ReportModule.ReportCard title="Inventory Report" href={`${baseUrl}/reports/inventory`} />
          <ReportModule.ReportCard title="Sales Report" href={`${baseUrl}/reports/sales`} />
          <ReportModule.ReportCard title="Employee Details" href={`${baseUrl}/reports/employee`} />
        </div>
      </div>
    </div>
  );
}

export default Report;
