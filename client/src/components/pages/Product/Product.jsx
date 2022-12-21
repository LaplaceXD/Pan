import { useState } from "react";

import { PreviewLayout } from "@components/template";
import styles from "./Product.module.css";
import ProductContent from "./ProductContent";
import ProductPreview from "./ProductPreview";

function Product({ showProductEditButtons = false }) {
  const [productId, setProductId] = useState(null);

  return (
    <PreviewLayout
      PreviewComponent={
        <ProductPreview productId={productId} showProductEditButtons={showProductEditButtons} />
      }
      className={styles.previewContainer}
    >
      <ProductContent
        selectedProductId={productId}
        onProductClick={(id) => setProductId(productId === id ? null : id)}
      />
    </PreviewLayout>
  );
}

export default Product;
