import format from "@utils/format";
import styles from "./ProductCard.module.css";

function ProductCard({ img, name, price, onClick }) {
  return (
    <article className={styles.container} onClick={onClick}>
      <div className={styles.img}>
        <img src={img} />
      </div>
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.price}>{format.currency(price)}</p>
    </article>
  );
}

export default ProductCard;
