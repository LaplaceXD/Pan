import { clsx } from "clsx";

import styles from "./OrderSummary.module.css";

function OrderSummary({ title, orders, total, defaultTotal = 0, RenderComponent, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>
      <ul className={styles.summary}>
        {orders?.map((order) => (RenderComponent ? RenderComponent(order) : null)) ?? null}
      </ul>
      <div className={styles.total}>
        <p>Total</p>
        <p>Php {orders?.reduce(total, defaultTotal) ?? defaultTotal}</p>
      </div>
    </div>
  );
}

export default OrderSummary;
