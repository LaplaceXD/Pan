import React from "react";
import styles from "./ReportCard.module.css";
import banner from "@assets/imgs/login_banner.jpg";
import logo from "@assets/Logo_128x128.svg";

import { Button } from "@components/common";

function ReportCard({title}) {
    return(
        <div className={styles.container}>
            <img src={banner} alt="Bread." className={styles.img} />
            <div className={styles.content}>
                <h1 className={styles.title}>{title}</h1>
                <div className={styles.footer}>
                    <Button label={"Download Latest Report"} className={styles.btn}></Button>
                    <Button label={"View Past Report"} className={styles.btn} secondary></Button>
                </div>
            </div>
        </div>
    );
}

export default ReportCard;