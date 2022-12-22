import React from "react";
import styles from "./EmployeePreview.module.css";
import { clsx } from "clsx";
import { Button } from "@components/common";

function EmployeePreview({ className, title = "Employee Details", children }) {
    return (
        <section className={clsx(styles.container, className)}>
            <h2 className={styles.title}>{title}</h2>
            {children}
        </section>
    );
}

export default EmployeePreview;