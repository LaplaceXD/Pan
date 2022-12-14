import { clsx } from "clsx";
import { cloneElement } from "react";

import styles from "./ProductList.module.css";

function ProductList({ products, itemKey, RenderComponent, className }) {
  return (
    <div className={clsx(styles.container, className)}>
      {products?.map((product) =>
        RenderComponent ? cloneElement(RenderComponent(product), { key: itemKey(product) }) : null
      ) ?? null}
    </div>
  );
}

export default ProductList;
