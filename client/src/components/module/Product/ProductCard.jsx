import styles from "./Product.module.css";

function ProductCard({ img, name, price, onClick }) {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.cardImg}>
        <img src={img} />
      </div>
      <h3 className={styles.cardName}>{name}</h3>
      <p className={styles.cardPrice}>Php {price}</p>
    </article>
  );
}

export default ProductCard;
