import { clsx } from "clsx";

import format from "@utils/format";
import styles from "./ProductCard.module.css";

function ProductCard({
  img,
  name,
  price,
  onClick,
  disabledContent = "",
  disabledColorPrimary = false,
  disabled = false,
}) {
  return (
    <article
      className={clsx(
        styles.container,
        disabled && styles.isDisabled,
        disabled && disabledColorPrimary && styles.colorPrimary
      )}
      onClick={() => !disabled && onClick()}
      data-overlay={disabledContent}
    >
      <div className={styles.img}>
        <img src={img} />
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.price}>{format.currency(price)}</p>
    </article>
  );
}

export default ProductCard;
