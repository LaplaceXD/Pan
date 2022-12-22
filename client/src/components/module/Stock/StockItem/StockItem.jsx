import { BsCalendarDate, BsTrash, BsTruck } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { MdProductionQuantityLimits } from "react-icons/md";

import format from "@utils/format";
import styles from "./StockItem.module.css";

function StockItem({
  quantity = 0,
  unit = "unit",
  price = 0,
  supplier = "supplier",
  dateSupplied = new Date(),
  notes = "",
  onEdit,
  onDelete,
  showSupplier = false,
  showProduct = false,
}) {
  return (
    <li className={styles.container}>
      <article className={styles.content}>
        <h4 className={styles.header}>
          {quantity} {unit} <span className={styles.price}>@ {price} each</span>
        </h4>
        {showProduct ? (
          <p>
            <MdProductionQuantityLimits /> {product_id}
          </p>
        ) : null}
        {showSupplier ? (
          <p>
            <BsTruck /> {supplier}
          </p>
        ) : null}
        <p>
          <BsCalendarDate /> {format.date(dateSupplied)}
        </p>
      </article>
      <div className={styles.buttons}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <FaEdit size={24} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <BsTrash size={24} />
        </button>
      </div>
      <p className={styles.notes}>{notes}</p>
    </li>
  );
}

export default StockItem;
