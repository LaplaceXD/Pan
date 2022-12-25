import { List } from "@components/common";
import StockItem from "../StockItem";
import styles from "./StockItems.module.css";

function StockItems({
  items = [],
  onItemEdit,
  onItemDelete,
  showSupplier = false,
  showProduct = false,
  showStockDeleteButton = false,
  isLoading = false,
}) {
  return (
    <div className={styles.container}>
      <List
        column
        items={items}
        className={styles.list}
        isLoading={isLoading}
        itemKey={(stock) => stock.stock_id}
        emptyLabel={`This ${showSupplier ? "product" : "supplier"} has no stock in the database.`}
        RenderComponent={(stock) => (
          <StockItem
            key={stock.stock_id}
            unit={stock.unit}
            quantity={stock.quantity}
            notes={stock.notes}
            product={stock.product_name}
            supplier={stock.supplier_name}
            dateSupplied={stock.date_supplied}
            price={stock.unit_price}
            onEdit={() => onItemEdit(stock)}
            onDelete={() => onItemDelete(stock)}
            showNotes
            showStockDeleteButton={showStockDeleteButton}
            showSupplier={showSupplier}
            showProduct={showProduct}
          />
        )}
      />
    </div>
  );
}

export default StockItems;
