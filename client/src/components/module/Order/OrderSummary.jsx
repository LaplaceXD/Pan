import { clsx } from "clsx";

import { List } from "@components/common";
import OrderDetail from "./OrderDetail";
import styles from "./OrderSummary.module.css";

const DEFAULT_TOTAL = 0;

function OrderSummary({ title = "Order Details", details, onItemIncrement, onItemDecrement, className }) {
  const total =
    details?.reduce((total, { unit_price, quantity }) => total + unit_price * quantity, DEFAULT_TOTAL) ??
    DEFAULT_TOTAL;

  return (
    <div className={clsx(styles.container, className)}>
      <h2 className={styles.title}>{title}</h2>

      <List
        column
        className={styles.summary}
        items={details}
        itemKey={(detail) => detail.id}
        total={(total, { unit_price, quantity }) => total + unit_price * quantity}
        RenderComponent={(detail) => (
          <OrderDetail
            name={detail.name}
            price={detail.quantity * detail.unit_price}
            quantity={detail.quantity}
            onIncrement={() => onItemIncrement(detail)}
            onDecrement={() => onItemDecrement(detail)}
          />
        )}
      />

      <div className={styles.total}>
        <p>Total</p>
        <p>Php {total.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default OrderSummary;
