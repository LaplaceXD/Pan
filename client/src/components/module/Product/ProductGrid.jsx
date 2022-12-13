import { clsx } from "clsx";

import styles from "./Product.module.css";

function ProductGrid({ products, RenderComponent, className }) {
  return (
    <div className={clsx(styles.grid, className)}>
      {products.map((product) => (RenderComponent ? RenderComponent(product) : null))}
    </div>
  );
}

export default ProductGrid;
