import empImg from "@assets/imgs/emp-img.jpg";
import { Product } from "@components/module";

import styles from "./ProductPreview.module.css";

function ProductPreview() {
  return (
    <div className={styles.container}>
      <Product.Detail
        name="Product Name"
        description="Lorem Ipsum"
        category="category"
        img={empImg}
        quantity={20}
        price={123}
      />
    </div>
  );
}

export default ProductPreview;
