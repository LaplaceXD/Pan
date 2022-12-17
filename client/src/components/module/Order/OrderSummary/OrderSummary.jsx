import { clsx } from "clsx";

import { List } from "@components/common";
import OrderDetail from "./../OrderDetail";

import styles from "./OrderSummary.module.css";

function OrderSummary({
  details,
  itemKey,
  className,
  withCounter = false,
  onItemIncrement,
  onItemDecrement,
}) {
  return (
    <div className={clsx(styles.container, className)}>
      <List
        column
        className={styles.details}
        items={details}
        itemKey={itemKey}
        RenderComponent={(detail) => (
          <OrderDetail
            name={detail.name}
            price={detail.quantity * detail.unit_price}
            quantity={detail.quantity}
            onIncrement={() => onItemIncrement(detail)}
            onDecrement={() => onItemDecrement(detail)}
            withCounter={withCounter}
          />
        )}
      />
      <p>COUNTER</p>
    </div>
  );
}

export default OrderSummary;
