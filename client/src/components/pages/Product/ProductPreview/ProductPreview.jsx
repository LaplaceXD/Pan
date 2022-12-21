import { useEffect, useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Product } from "@components/module";
import { useQuery } from "@hooks";
import { getProductById } from "@services/product";

import styles from "./ProductPreview.module.css";

const pages = {
  PRODUCT_FORM: Symbol(0),
  PRODUCT_DETAIL: Symbol(1),
};

function ProductPreview({ productId }) {
  const [page, setPage] = useState(pages.PRODUCT_DETAIL);
  const { data: product } = useQuery(["product", productId], ({ signal }) =>
    productId ? getProductById(productId, { signal }) : null
  );

  useEffect(() => setPage(pages.PRODUCT_DETAIL), [productId]);

  const pageDetails = {
    [pages.PRODUCT_DETAIL]: (
      <Product.Detail
        name={product?.name}
        description={product?.description}
        category={product?.category_name}
        img={empImg}
        stock={product?.available_stock}
        isAvailable={product?.is_available}
        price={product?.unit_price}
        onEdit={() => setPage(pages.PRODUCT_FORM)}
      />
    ),
    [pages.PRODUCT_FORM]: (
      <Product.Form
        name={product?.name}
        description={product?.description}
        category={product?.category_name}
        img={empImg}
        price={product?.unit_price}
        onCancel={() => setPage(pages.PRODUCT_DETAIL)}
      />
    ),
  };

  return <div className={styles.container}>{product ? pageDetails[page] : null}</div>;
}

export default ProductPreview;
