import { BoxImage, Button } from "@components/common";
import format from "@utils/format";

import styles from "./ProductDetail.module.css";

function ProductDetail({
  img,
  name,
  category,
  description,
  stock,
  isAvailable,
  price = 0,
  onViewStock,
  onHideListing,
  onEdit,
}) {
  return (
    <>
      <div className={styles.container}>
        <h3 className={styles.title}>Product Details</h3>
        <BoxImage className={styles.img} src={img} alt={`${name}'s image.`} size={256} />
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.detail}>
          <span>Category:</span>
          <span>{format.capitalize(category)}</span>
        </p>
        <p className={styles.description}>{description}</p>
        <p className={styles.detail}>
          <span>Quantity in stock:</span>
          <span>{stock}</span>
        </p>
        <p className={styles.detail}>
          <span>Unit Price:</span>
          <span>{format.currency(price)}</span>
        </p>
        <p className={styles.detail}>
          <span>Status</span>
          <span className={isAvailable && stock > 0 ? styles.available : styles.unavailable}>
            {isAvailable && stock > 0 ? "Available" : !isAvailable ? "Unavailable" : "Out of Stock"}
          </span>
        </p>
      </div>
      <div className={styles.buttons}>
        <Button type="button" label="View Stock" secondary onClick={onViewStock} />
        <Button type="button" label="Hide Listing" secondary onClick={onHideListing} />
        <Button type="button" label="Edit" onClick={onEdit} />
      </div>
    </>
  );
}

export default ProductDetail;
