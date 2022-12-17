import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Button, Grid, Options, SearchBar } from "@components/common";
import { Order, Product } from "@components/module";
import { PreviewLayout } from "@components/template";
import useQuery from "@hooks/query";
import { getAllProducts } from "@services/product";

import styles from "./Home.module.css";

function Home() {
  const { data: products } = useQuery("products", getAllProducts);
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

  const CheckoutPreview = (
    <>
      <Order.Details
        total={cart.reduce((total, { unit_price, quantity }) => total + unit_price * quantity, 0)}
        className={styles.checkoutPreview}
      >
        <Order.Lines
          lines={cart}
          className={styles.checkoutSummary}
          onItemIncrement={(item) => handleItemIncrement(item.id)}
          onItemDecrement={(item) => handleItemDecrement(item.id)}
          withCounter
        />
      </Order.Details>

      <div className={styles.checkoutBtns}>
        <Button label="Clear Cart" onClick={() => setCart(null)} secondary />
        <Button label="Confirm Order" />
      </div>
    </>
  );

  return (
    <PreviewLayout PreviewComponent={CheckoutPreview} className={styles.container}>
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
        items={products && [...products, ...products, ...products]}
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
    </PreviewLayout>
  );
}

export default Home;
