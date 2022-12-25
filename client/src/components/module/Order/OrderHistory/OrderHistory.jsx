import { clsx } from "clsx";

import { List } from "@components/common";
import OrderHistoryItem from "../OrderHistoryItem";
import styles from "./OrderHistory.module.css";

function OrderHistory({ history, className, onItemSelect, itemIsSelected, isLoading = false }) {
  return (
    <List
      column
      className={clsx(styles.history, className)}
      items={history}
      itemKey={({ order_id }) => order_id}
      isLoading={isLoading}
      emptyLabel="There are no orders to display."
      RenderComponent={({ order_id, employee_name, date_placed, total }) => (
        <OrderHistoryItem
          id={order_id}
          orderDate={date_placed}
          employeeName={employee_name}
          total={total}
          onClick={() => onItemSelect(order_id)}
          isSelected={itemIsSelected(order_id)}
        />
      )}
    />
  );
}

export default OrderHistory;
