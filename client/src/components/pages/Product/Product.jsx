import empImg from "@assets/imgs/emp-img.jpg";
import { List, Options, SearchBar } from "@components/common";
import { Product as Prod, UserBanner } from "@components/module";
import useFilter from "@hooks/filter";
import useQuery from "@hooks/query";
import { getAllProducts } from "@services/product";

import styles from "./Product.module.css";

const categoryFilter = ({ category_id }, category) => category_id === category;
const searchFilter = ({ name, description }, search) => {
  const searchLower = search.toLowerCase();
  const nameMatch = name.toLowerCase().includes(searchLower);
  const descMatch = description.toLowerCase().includes(searchLower);

  return nameMatch || descMatch;
};

function Product() {
  const { data: products } = useQuery(getAllProducts);
  const { data, filter, setFilter } = useFilter(products, {
    search: { value: "", filter: searchFilter },
    category: { value: 0, filter: categoryFilter },
  });

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products Available</h1>
        <SearchBar
          className={styles.search}
          value={filter.search}
          onSearch={(e) => setFilter({ search: e.currentTarget.value })}
        />
        <UserBanner imgSize={56} />
      </header>

      <Options
        className={styles.options}
        options={[
          { label: "All", value: 0 },
          { label: "Bread", value: 1 },
          { label: "Cake", value: 2 },
          { label: "Donuts", value: 3 },
          { label: "Cookies", value: 4 },
          { label: "Drinks", value: 5 },
        ]}
        value={filter.category}
        onChange={(value) => setFilter({ category: value })}
      />

      <List
        column
        className={styles.productList}
        items={data}
        itemKey={(product) => product.product_id}
        RenderComponent={({ name, description, unit_price }) => (
          <Prod.Item
            img={empImg}
            name={name}
            category="Bread"
            description={description}
            availableStock={50}
            unitPrice={parseFloat(unit_price)}
          />
        )}
      />
    </main>
  );
}

export default Product;