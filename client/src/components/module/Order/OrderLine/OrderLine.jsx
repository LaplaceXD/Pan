import { clsx } from "clsx";

import format from "@utils/format";
import styles from "./OrderLine.module.css";

function OrderLine({
  name,
  price = 0,
  onClick,
  onIncrement,
  onDecrement,
  quantity = 0,
  withCounter = true,
  disabled = false,
}) {
  const Counter = (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        className={styles.counterBtn}
      >
        -
      </button>
      <p className={styles.counterQty}>{quantity}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        className={styles.counterBtn}
      >
        +
      </button>
    </>
  );

  return (
    <li
      className={clsx(styles.container, disabled && styles.isDisabled)}
      onClick={(e) => !disabled && onClick()}
    >
      <div className={styles.rightContainer}>
        <p className={styles.productName}>{name}</p>
        <div className={styles.counter}>
          {withCounter ? Counter : <p className={styles.counterQty}>Quantity: {quantity}</p>}
        </div>
      </div>
      <p className={styles.productTotal}>{format.currency(price)}</p>
    </li>
  );
}

export default OrderLine;
