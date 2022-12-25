import styles from "./Report.module.css";

import { Header } from "@components/common";
import { Report as ReportModule, UserBanner } from "@components/module";
import { downloadEmployeeReport, downloadInventoryReport, downloadSalesReport } from "@services/report";

function Report() {
  function handle(cb) {
    return async (values, setDownloading) => {
      setDownloading(true);
      await cb(values.month);
      setDownloading(false);
    };
  }

  return (
    <div className={styles.container}>
      <Header title="Admin Dashboard" className={styles.header}>
        <UserBanner imgSize={56} />
      </Header>
      <div className={styles.content}>
        <ReportModule.ReportCard title="Inventory Report" onDownload={handle(downloadInventoryReport)} />
        <ReportModule.ReportCard title="Sales Report" onDownload={handle(downloadSalesReport)} />
        <ReportModule.ReportItem
          className={styles.fill}
          title="Employee Details"
          onDownload={handle(downloadEmployeeReport)}
        />
      </div>
    </div>
  );
}

export default Report;
