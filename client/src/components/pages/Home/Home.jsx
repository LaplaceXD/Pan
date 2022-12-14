import { useState } from "react";

import empImg from "@assets/imgs/emp-img.jpg";
import { Button, Options, SearchBar } from "@components/common";
import { Order, Product, UserBanner } from "@components/module";

import styles from "./Home.module.css";

function Home() {
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

        <Product.Grid
          className={styles.productGrid}
          products={[
            { img: empImg, name: "Chocolate Chips Muffin", price: 105 },
            { img: empImg, name: "Chocolate Chips Muffin", price: 105 },
            { img: empImg, name: "Chocolate Chips Muffin", price: 105 },
          ]}
          RenderComponent={({ img, name, price }) => (
            <Product.Card img={img} name={name} price={price} onClick={() => console.log(name)} />
          )}
        />
      </div>

      <aside className={styles.checkoutContainer}>
        <UserBanner />

        <Order.Summary
          className={styles.orderSummary}
          title="Order Details"
          orders={cart}
          total={(total, { unit_price, quantity }) => total + unit_price * quantity}
          RenderComponent={({ id, name, unit_price, quantity }) => (
            <Order.Detail
              name={name}
              price={quantity * unit_price}
              quantity={quantity}
              key={id}
              onIncrement={() => handleItemIncrement(id)}
              onDecrement={() => handleItemDecrement(id)}
            />
          )}
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
