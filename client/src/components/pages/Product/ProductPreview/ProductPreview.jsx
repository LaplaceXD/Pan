import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Product } from "@components/module";

import styles from "./ProductPreview.module.css";

const pages = {
  PRODUCT_FORM: Symbol(0),
  PRODUCT_DETAIL: Symbol(1),
};

function ProductPreview() {
  const [page, setPage] = useState(pages.PRODUCT_DETAIL);

  const pageDetails = {
    [pages.PRODUCT_DETAIL]: (
      <Product.Detail
        name="Product Name"
        description="Lorem Ipsum"
        category="category"
        img={empImg}
        quantity={20}
        price={123}
        onEdit={() => setPage(pages.PRODUCT_FORM)}
      />
    ),
    [pages.PRODUCT_FORM]: (
      <Product.Form
        name="Product Name"
        description="Lorem Ipsum"
        category="category"
        img={empImg}
        price={123}
        onCancel={() => setPage(pages.PRODUCT_DETAIL)}
      />
    ),
  };

  return <div className={styles.container}>{pageDetails[page]}</div>;
}

export default ProductPreview;
