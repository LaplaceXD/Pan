import { clsx } from "clsx";

import styles from "./OrderSummary.module.css";

function OrderSummary({ title, orders, total, DetailComponent, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.summary}>{DetailComponent ? DetailComponent(orders) : null}</ul>
      <div className={styles.total}>
        <p>Total</p>
        <p>Php {total ? total(orders) : 0}</p>
      </div>
    </div>
  );
}

export default OrderSummary;
