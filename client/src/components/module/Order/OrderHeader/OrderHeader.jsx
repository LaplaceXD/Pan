import { clsx } from "clsx";

import format from "@utils/format";
import styles from "./OrderHeader.module.css";

function OrderHeader({ order, className }) {
  return order ? (
    <header className={clsx(styles.header, className)}>
      <p>Employee: {order.employee_name}</p>
      <p>Order: {format.id(order.order_id)}</p>
      <p>{format.datetime(order.date_placed)}</p>
    </header>
  ) : null;
}

export default OrderHeader;
