import React from "react";
import styles from "./Report.module.css";

import { UserBanner, Report as ReportModule } from "@components/module";
import { Header } from "@components/common";

function Report() {
    return (
        <div className={styles.container}>
            <Header title="Admin Dashboard" className={styles.header}>
                <UserBanner imgSize={56} />
            </Header>
            <div className={styles.content}>
                <div className={styles.cards}>
                    <ReportModule.ReportCard title={'Inventory Report'}/>
                    <ReportModule.ReportCard title={'Sales Report'}/>
                    <ReportModule.ReportCard title={'Transaction List'}/>
                </div>
                <div className={styles.item}>
                    <ReportModule.ReportItem title={"Employee Details"}/>
                </div>
            </div>
        </div>
    );
}

export default Report;