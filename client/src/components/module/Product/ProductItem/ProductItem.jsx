import { BoxImage } from "@components/common";
import styles from "./ProductItem.module.css";

function ProductItem({ img, name, category, description, availableStock = 0, unitPrice = 0 }) {
  return (
    <li className={styles.container}>
      <BoxImage src={img} alt={`${name} image.`} className={styles.img} />
      <article className={styles.details}>
        <h2 className={styles.name}>{name}</h2>
        <p className={styles.category}>
          Category: <span>{category}</span>
        </p>
        <p className={styles.description}>{description}</p>
      </article>
      <div className={styles.sideDetails}>
        <p className={styles.sideDetail}>
          Qty in stock: <span>{availableStock}</span>
        </p>
        <p className={styles.sideDetail}>
          Unit Price: <span>Php {unitPrice.toFixed(2)}</span>
        </p>
      </div>
    </li>
  );
}

export default ProductItem;
