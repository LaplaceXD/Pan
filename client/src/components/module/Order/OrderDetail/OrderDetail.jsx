import styles from "./OrderDetail.module.css";

function OrderDetail({ name, price, onIncrement, onDecrement, quantity = 0 }) {
  return (
    <li className={styles.container}>
      <div className={styles.rightContainer}>
        <p className={styles.productName}>{name}</p>
        <div className={styles.counter}>
          <button onClick={onDecrement} className={styles.counterBtn}>
            -
          </button>
          <p className={styles.counterQty}>{quantity}</p>
          <button onClick={onIncrement} className={styles.counterBtn}>
            +
          </button>
        </div>
      </div>
      <p className={styles.productTotal}>Php {price}</p>
    </li>
  );
}

export default OrderDetail;
