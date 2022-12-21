import { BoxImage, Button } from "@components/common";
import format from "@utils/format";

import styles from "./ProductDetail.module.css";

function ProductDetail({ img, name, category, description, quantity, price = 0 }) {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Product Details</h3>
        <BoxImage className={styles.img} src={img} alt={`${name}'s image.`} size={256} />
        <h4 className={styles.name}>Product Name</h4>
        <p className={styles.detail}>
          <span>Category:</span>
          <span>{category}</span>
        </p>
        <p className={styles.description}>{description}</p>
        <p className={styles.detail}>
          <span>Quantity in stock:</span>
          <span>{quantity}</span>
        </p>
        <p className={styles.detail}>
          <span>Unit Price:</span>
          <span>{format.currency(price)}</span>
        </p>
      </div>
      <div className={styles.buttons}>
        <Button label="View Stock" secondary />
        <Button label="Hide Listing" secondary />
        <Button label="Edit" />
      </div>
    </>
  );
}

export default ProductDetail;
