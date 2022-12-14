import empImg from "@assets/imgs/emp-img.jpg";
import { List, Options, SearchBar } from "@components/common";
import { Product as Prod, UserBanner } from "@components/module";
import useQuery from "@hooks/query";
import { getAllProducts } from "@services/product";

import styles from "./Product.module.css";

function Product() {
  const { data: products } = useQuery(getAllProducts);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Products Available</h1>
        <SearchBar className={styles.search} />

        <UserBanner imgSize={56} />
      </header>

      <Options
        className={styles.options}
        options={[
          { label: "All", value: 1 },
          { label: "Bread", value: 2 },
          { label: "Cake", value: 3 },
          { label: "Donuts", value: 4 },
          { label: "Cookies", value: 5 },
          { label: "Drinks", value: 6 },
        ]}
        value={1}
        onChange={(value) => console.log(value)}
      />

      <List
        column
        className={styles.productList}
        items={products}
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
