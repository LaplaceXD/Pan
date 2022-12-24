import styles from "./SupplierPreview.module.css";

import { clsx } from "clsx";

function SupplierPreview({ children, className, title = "Supplier Details" }) {
  return (
    <section className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}

export default SupplierPreview;
