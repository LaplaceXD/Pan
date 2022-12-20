import { clsx } from "clsx";

import { List } from "@components/common";
import OrderLine from "./../OrderLine";

import styles from "./OrderLines.module.css";

function OrderSummary({
  lines,
  onLineClick,
  className,
  disabledLines = false,
  showCount = false,
  withCounter = false,
  onItemIncrement,
  onItemDecrement,
}) {
  return (
    <div className={clsx(styles.container, className)}>
      <List
        column
        className={styles.lines}
        items={lines}
        itemKey={(line) => line.product_id}
        RenderComponent={(line) => (
          <OrderLine
            name={line.name}
            price={line.quantity * (line.unit_price || line.selling_price)}
            quantity={line.quantity}
            onClick={() => onLineClick(line)}
            onIncrement={() => onItemIncrement(line)}
            onDecrement={() => onItemDecrement(line)}
            disabled={disabledLines}
            withCounter={withCounter}
          />
        )}
      />
      {showCount && lines ? <p className={styles.count}>Item Count: {lines.length}</p> : null}
    </div>
  );
}

export default OrderSummary;
