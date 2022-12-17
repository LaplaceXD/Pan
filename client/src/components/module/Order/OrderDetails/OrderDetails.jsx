import format from "@utils/format";
import { clsx } from "clsx";

import styles from "./OrderDetails.module.css";

function OrderPreview({ className, title = "Order Details", total, children }) {
  return (
    <section className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      {children}
      <div className={styles.total}>
        <p>Total</p>
        <p>{format.currency(total || 0)}</p>
      </div>
    </section>
  );
}

export default OrderPreview;
