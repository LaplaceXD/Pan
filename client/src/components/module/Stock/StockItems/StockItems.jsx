import { List } from "@components/common";
import StockItem from "../StockItem";
import styles from "./StockItems.module.css";

function StockItems({ items = [], onItemEdit, onItemDelete, showSupplier = false, showProduct = false }) {
  return (
    <div className={styles.container}>
      <List
        column
        items={items}
        className={styles.list}
        itemKey={(stock) => stock.stock_id}
        RenderComponent={({
          stock_id,
          unit,
          notes,
          unit_price,
          product_id,
          supplier_id,
          date_supplied,
          quantity,
        }) => (
          <StockItem
            unit={unit}
            quantity={quantity}
            notes={notes}
            product={product_id}
            supplier={supplier_id}
            dateSupplied={date_supplied}
            price={unit_price}
            onEdit={() => onItemEdit(stock_id)}
            onDelete={() => onItemDelete(stock_id)}
            showNotes
            showSupplier={showSupplier}
            showProduct={showProduct}
          />
        )}
      />
    </div>
  );
}

export default StockItems;
