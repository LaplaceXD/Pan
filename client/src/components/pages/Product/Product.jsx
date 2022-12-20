import empImg from "@assets/imgs/emp-img.jpg";
import { Header, List, SearchBar } from "@components/common";
import { Category, Product as ProductModule, UserBanner } from "@components/module";
import { useFilter, useQuery } from "@hooks";
import { getAllProducts } from "@services/product";

import styles from "./Product.module.css";

const category = {
  value: 0,
  filter: ({ category_id }, category) => category_id === category,
};

const search = {
  value: "",
  filter: ({ name, description }, search) => {
    const searchLower = search.toLowerCase();
    const nameMatch = name.toLowerCase().includes(searchLower);
    const descMatch = description.toLowerCase().includes(searchLower);

    return nameMatch || descMatch;
  },
};

function Product() {
  const { data: products } = useQuery("products", getAllProducts);
  const { data: filteredProducts, filter } = useFilter(products, { search, category });

  return (
    <main className={styles.container}>
      <Header title="Products Available" className={styles.header}>
        <SearchBar
          className={styles.search}
          value={filter.search}
          onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
        />
        <UserBanner imgSize={56} />
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
          name,
          description,
          category_name,
          available_stock,
          is_available,
          unit_price,
        }) => (
          <ProductModule.Item
            img={empImg}
            name={name}
            category={category_name}
            description={description}
            stock={available_stock}
            isAvailable={is_available}
            unitPrice={parseFloat(unit_price)}
          />
        )}
      />
    </main>
  );
}

export default Product;
