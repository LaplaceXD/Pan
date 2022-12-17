import { clsx } from "clsx";

import format from "@utils/format";
import styles from "./OrderItem.module.css";

function OrderItem({ id, orderDate, employeeName, total, onClick, isSelected = false }) {
  return (
    <div className={clsx(styles.item, isSelected && styles.isSelected)} onClick={onClick}>
      <p>
        Order ID <span>{"ID-" + String(id).padStart(4, "0")}</span>
      </p>
      <p>
        Order Date<span>{format.date(orderDate)}</span>
      </p>
      <p>
        Employee<span>{employeeName}</span>
      </p>
      <p>
        Total
        <span>{format.currency(total)}</span>
      </p>
    </div>
  );
}

export default OrderItem;
