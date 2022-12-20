import { Button } from "@components/common";
import styles from "./ProductPreview.module.css";

function ProductPreview() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>HELLO</div>
      <div className={styles.buttons}>
        <Button label="View Stock" secondary />
        <Button label="Hide Listing" secondary />
        <Button label="Edit" />
      </div>
    </div>
  );
}

export default ProductPreview;
