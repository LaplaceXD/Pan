import { BoxImage, Button } from "@components/common";
import format from "@utils/format";

import styles from "./ProductDetail.module.css";

function ProductDetail({
  img,
  name = "Product Name",
  category = "Category Name",
  description = "Description",
  stock = 0,
  isAvailable = false,
  price = 0,
  onViewStock,
  onStatusChange,
  onEdit,
  showProductEditButton = false,
  statusChangeDisabled = false,
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
          <span>{stock > 0 ? stock : 0}</span>
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
        {showProductEditButton ? (
          <>
            <Button
              type="button"
              label={isAvailable ? "Hide Listing" : "Show Listing"}
              onClick={onStatusChange}
              disabled={statusChangeDisabled}
              secondary
            />
            <Button type="button" label="Edit" onClick={onEdit} />
          </>
        ) : null}
      </div>
    </>
  );
}

export default ProductDetail;
