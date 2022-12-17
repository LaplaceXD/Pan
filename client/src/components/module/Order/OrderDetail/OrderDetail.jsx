import format from "@utils/format";
import styles from "./OrderDetail.module.css";

function OrderDetail({ name, price = 0, onIncrement, onDecrement, quantity = 0, withCounter = true }) {
  return (
    <li className={styles.container}>
      <div className={styles.rightContainer}>
        <p className={styles.productName}>{name}</p>
        <div className={styles.counter}>
          {withCounter ? (
            <>
              <button onClick={onDecrement} className={styles.counterBtn}>
                -
              </button>
              <p className={styles.counterQty}>{quantity}</p>
              <button onClick={onIncrement} className={styles.counterBtn}>
                +
              </button>{" "}
            </>
          ) : (
            <p className={styles.counterQty}>Quantity: {quantity}</p>
          )}
        </div>
      </div>
      <p className={styles.productTotal}>{format.currency(price)}</p>
    </li>
  );
}

export default OrderDetail;
