import { PreviewLayout } from "@components/template";
import styles from "./Product.module.css";
import ProductContent from "./ProductContent";
import ProductPreview from "./ProductPreview";

function Product({ withPreview = false }) {
  return withPreview ? (
    <PreviewLayout PreviewComponent={<ProductPreview />} className={styles.previewContainer}>
      <ProductContent />
    </PreviewLayout>
  ) : (
    <main className={styles.mainContainer}>
      <ProductContent />
    </main>
  );
}

export default Product;
