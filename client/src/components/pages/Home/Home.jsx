import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Button, Grid, Options, SearchBar } from "@components/common";
import { Order, Product, UserBanner } from "@components/module";
import useQuery from "@hooks/query";
import { getAllProducts } from "@services/product";

import styles from "./Home.module.css";

function Home() {
  const { data: products } = useQuery(getAllProducts);
  const [cart, setCart] = useState([
    {
      id: 1,
      name: "Belgian Chocolate Chip Cookie",
      unit_price: 50,
      quantity: 0,
    },
    {
      id: 2,
      name: "Crack Pandesal",
      unit_price: 50,
      quantity: 0,
    },
    {
      id: 3,
      name: "Giant Loaf",
      unit_price: 50,
      quantity: 0,
    },
  ]);

  function handleItemIncrement(id) {
    setCart((cart) =>
      cart.map((item) => {
        if (id !== item.id) return item;
        return { ...item, quantity: item.quantity++ };
      })
    );
  }

  function handleItemDecrement(id) {
    setCart((cart) =>
      cart.map((item) => {
        if (id !== item.id) return item;
        return { ...item, quantity: item.quantity-- };
      })
    );
  }

  return (
    <main className={styles.home}>
      <div className={styles.productContainer}>
        <header className={styles.productHeader}>
          <h2 className={styles.title}>Select Category</h2>
          <SearchBar />
        </header>

        <Options
          className={styles.productCategories}
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

        <Grid
          className={styles.productGrid}
          items={products}
          itemKey={(product) => product.product_id}
          RenderComponent={({ product_id, name, unit_price }) => (
            <Product.Card
              key={product_id}
              img={empImg}
              name={name}
              price={unit_price}
              onClick={() => console.log(name)}
            />
          )}
        />
      </div>

      <aside className={styles.checkoutContainer}>
        <UserBanner />

        <Order.Summary
          className={styles.orderSummary}
          cart={cart}
          onItemIncrement={(item) => handleItemIncrement(item.id)}
          onItemDecrement={(item) => handleItemDecrement(item.id)}
        />

        <div className={styles.checkoutBtns}>
          <Button label="Cancel" secondary />
          <Button label="Confirm Order" />
        </div>
      </aside>
    </main>
  );
}

export default Home;
