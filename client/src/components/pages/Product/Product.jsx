import { PreviewLayout } from "@components/template";
import styles from "./Product.module.css";
import ProductContent from "./ProductContent";

function Product({ withPreview = false }) {
  return withPreview ? (
    <PreviewLayout className={styles.previewContainer}>
      <ProductContent />
    </PreviewLayout>
  ) : (
    <main className={styles.mainContainer}>
      <ProductContent />
    </main>
  );
}

export default Product;
