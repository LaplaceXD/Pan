import { useState } from "react";

import { PreviewLayout } from "@components/template";
import styles from "./Product.module.css";
import ProductContent from "./ProductContent";
import ProductPreview from "./ProductPreview";

function Product({ withPreview = false }) {
  const [productId, setProductId] = useState(null);

  return withPreview ? (
    <PreviewLayout
      PreviewComponent={<ProductPreview productId={productId} />}
      className={styles.previewContainer}
    >
      <ProductContent
        selectedProductId={productId}
        onProductClick={(id) => setProductId(productId === id ? null : id)}
      />
    </PreviewLayout>
  ) : (
    <main className={styles.mainContainer}>
      <ProductContent />
    </main>
  );
}

export default Product;
