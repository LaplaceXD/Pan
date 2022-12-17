import format from "@utils/format";
import styles from "./OrderLine.module.css";

function OrderLine({ name, price = 0, onIncrement, onDecrement, quantity = 0, withCounter = true }) {
  const Counter = (
    <>
      <button onClick={onDecrement} className={styles.counterBtn}>
        -
      </button>
      <p className={styles.counterQty}>{quantity}</p>
      <button onClick={onIncrement} className={styles.counterBtn}>
        +
      </button>
    </>
  );
  return (
    <li className={styles.container}>
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
