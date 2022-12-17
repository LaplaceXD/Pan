import { useState } from "react";
import { toast } from "react-toastify";

import empImg from "@assets/imgs/emp-img.jpg";
import { Button, Grid, Header, SearchBar } from "@components/common";
import { Category, Modal, Order, Product } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter, useMutation, useQuery } from "@hooks";
import { createOrder } from "@services/orders";
import { getAllProducts } from "@services/product";

import styles from "./Home.module.css";

const categoryFilter = ({ category_id }, category) => category_id === category;
const searchFilter = ({ name }, search) => {
  const searchLower = search.toLowerCase();
  const nameMatch = name.toLowerCase().includes(searchLower);

  return nameMatch;
};

function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [cart, setCart] = useState([]);

  const createOrderMutation = useMutation(createOrder);
  const { data: products } = useQuery("products", getAllProducts);
  const { filter, data: filteredProducts } = useFilter(products, {
    search: {
      value: "",
      filter: searchFilter,
    },
    category: {
      value: 0,
      filter: categoryFilter,
    },
  });

  function handleProductClick(id) {
    setOpenModal(true);
    setProductId(id);
  }

  function handleCloseModal() {
    setOpenModal(false);
  }

  function handleItemIncrement(id) {
    const incrementedItem = cart.map((item) => {
      if (id !== item.product_id) return item;
      return { ...item, quantity: item.quantity + 1 };
    });

    setCart(incrementedItem);
  }

  function handleItemDecrement(id) {
    const decrementedItem = cart.map((item) => {
      if (id !== item.product_id) return item;
      return { ...item, quantity: item.quantity - 1 };
    });

    setCart(decrementedItem.filter(({ quantity }) => quantity !== 0));
  }

  function handleCartClear() {
    setCart([]);
  }

  function handleCartItemAdd(values, setSubmitting) {
    setSubmitting(true);

    if (!cart.find(({ product_id }) => product_id === productId)) {
      setCart([...cart, { ...values, product_id: productId }]);
    }

    setProductId(null);
    setOpenModal(false);

    setSubmitting(false);
  }

  async function handleCartSubmit() {
    await createOrderMutation.execute(cart);
    setCart([]);
    toast.success("Order placed.");
  }

  const mappedCart = cart.map(({ quantity, product_id }) => ({
    quantity,
    ...products.find(({ product_id: id }) => id === product_id),
  }));

  const CheckoutPreview = (
    <>
      <Order.Details
        total={mappedCart.reduce((total, { unit_price, quantity }) => total + unit_price * quantity, 0)}
        className={styles.checkoutPreview}
      >
        <Order.Lines
          lines={mappedCart}
          className={styles.checkoutSummary}
          onItemIncrement={({ product_id }) => handleItemIncrement(product_id)}
          onItemDecrement={({ product_id }) => handleItemDecrement(product_id)}
          withCounter
        />
      </Order.Details>

      <div className={styles.checkoutBtns}>
        <Button label="Clear Cart" onClick={handleCartClear} secondary />
        <Button label="Confirm Order" onClick={handleCartSubmit} disabled={createOrderMutation.isLoading} />
      </div>
    </>
  );

  return (
    <PreviewLayout PreviewComponent={CheckoutPreview} className={styles.container}>
      <Header title="Select Category" className={styles.productHeader}>
        <SearchBar value={filter.search} onSearch={(e) => filter.handleSearch(e.currentTarget.value)} />
      </Header>

      <Category.Options
        className={styles.productCategories}
        value={filter.category}
        onChange={filter.handleCategory}
      />

      <Grid
        className={styles.productGrid}
        items={filteredProducts}
        itemKey={(product) => product.product_id}
        RenderComponent={({ product_id, name, unit_price }) => (
          <Product.Card
            key={product_id}
            img={empImg}
            name={name}
            price={unit_price}
            onClick={() => handleProductClick(product_id)}
          />
        )}
      />

      <Modal.CartItem
        open={openModal}
        onClose={handleCloseModal}
        min={1}
        max={100}
        onSubmit={handleCartItemAdd}
      />
    </PreviewLayout>
  );
}

export default Home;
