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
    <List
      column
      className={clsx(styles.summary, className)}
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
  );
}

export default OrderSummary;
