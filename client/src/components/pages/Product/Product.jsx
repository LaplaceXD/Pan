import { useState } from "react";

import placeholderImg from "@assets/imgs/placeholder-img.jpg";
import { Header, List, SearchBar } from "@components/common";
import { Category, Product as ProductModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter } from "@hooks";
import { useProducts } from "@hooks/services/product";

import styles from "./Product.module.css";
import ProductPreview from "./ProductPreview";

const category = {
  value: 0,
  filter: ({ category_id }, category) => category_id === category,
};

const search = {
  value: "",
  filter: ({ name, description, available_stock, is_available }, search) => {
    const searchLower = search.toLowerCase();
    const nameMatch = name.toLowerCase().includes(searchLower);
    const descMatch = description.toLowerCase().includes(searchLower);

    let statusMatch = false;
    if ("available".startsWith(searchLower)) statusMatch = is_available && available_stock > 0;
    else if ("out of stock".startsWith(searchLower)) statusMatch = is_available && available_stock <= 0;
    else if ("unavailable".startsWith(searchLower)) statusMatch = !is_available;

    return nameMatch || descMatch || statusMatch;
  },
};

function Product({
  showStockDeleteButton = false,
  showProductAddButton = false,
  showProductEditButton = false,
}) {
  const [productId, setProductId] = useState(null);
  const {
    payload: { data: products },
  } = useProducts();
  const { data: filteredProducts, filter } = useFilter(products, { search, category });

  const PreviewComponent = (
    <ProductPreview
      productId={productId}
      showStockDeleteButton={showStockDeleteButton}
      showProductAddButton={showProductAddButton}
      showProductEditButton={showProductEditButton}
    />
  );

  return (
    <PreviewLayout PreviewComponent={PreviewComponent} className={styles.container}>
      <Header title="Products" className={styles.header}>
        <SearchBar
          className={styles.search}
          value={filter.search}
          onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
        />
      </Header>

      <Category.Options
        className={styles.options}
        value={filter.category}
        onChange={filter.handleCategory}
      />

      <List
        column
        className={styles.productList}
        items={filteredProducts}
        itemKey={(product) => product.product_id}
        RenderComponent={({
          product_id,
          name,
          description,
          category_name,
          available_stock,
          is_available,
          unit_price,
        }) => (
          <ProductModule.Item
            img={placeholderImg}
            name={name}
            category={category_name}
            description={description}
            stock={available_stock}
            isAvailable={is_available}
            unitPrice={parseFloat(unit_price)}
            onClick={() => setProductId(productId === product_id ? null : product_id)}
            isSelected={productId === product_id}
          />
        )}
      />
    </PreviewLayout>
  );
}

export default Product;
