import styles from "./Report.module.css";

import { Header } from "@components/common";
import { Report as ReportModule, UserBanner } from "@components/module";

function Report({ reports }) {
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
        {reports?.map(({ title, onDownload, isItem = false }, idx) =>
          isItem ? (
            <ReportModule.ReportItem
              key={idx}
              className={styles.fill}
              title={title}
              onDownload={onDownload}
            />
          ) : (
            <ReportModule.ReportCard key={idx} title={title} onDownload={handle(onDownload)} />
          )
        ) ?? null}
      </div>
    </div>
  );
}

export default Report;
