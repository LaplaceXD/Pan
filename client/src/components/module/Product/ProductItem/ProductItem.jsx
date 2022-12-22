import { clsx } from "clsx";

import { BoxImage } from "@components/common";
import format from "@utils/format";

import styles from "./ProductItem.module.css";

function ProductItem({
  img,
  name,
  category,
  description,
  isAvailable = true,
  stock = 0,
  unitPrice = 0,
  onClick,
  isSelected = false,
  disabled = false,
}) {
  return (
    <li
      className={clsx(
        styles.container,
        disabled && styles.disabled,
        !disabled && isSelected && styles.isSelected
      )}
      onClick={() => !disabled && onClick()}
    >
      <BoxImage src={img} alt={`${name} image.`} className={styles.img} />
      <article className={styles.details}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.category}>
          Category: <span>{format.capitalize(category)}</span>
        </p>
        <p className={styles.description}>{description}</p>
      </article>
      <div className={styles.sideDetails}>
        <p className={styles.sideDetail}>
          Status:{" "}
          <span className={clsx(isAvailable && stock > 0 ? styles.available : styles.unavailable)}>
            {isAvailable && stock > 0 ? "Available" : !isAvailable ? "Unavailable" : "Out of Stock"}
          </span>
        </p>
        <p className={styles.sideDetail}>
          Qty in stock: <span>{stock > 0 ? `${stock}` : "0"}</span>
        </p>
        <p className={styles.sideDetail}>
          Unit Price: <span>{format.currency(unitPrice)}</span>
        </p>
      </div>
    </li>
  );
}

export default ProductItem;
