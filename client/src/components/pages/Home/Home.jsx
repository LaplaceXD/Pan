import { useState } from "react";
import { toast } from "react-toastify";

import empImg from "@assets/imgs/emp-img.jpg";
import { Button, Grid, Header, SearchBar } from "@components/common";
import { Category, Modal, Order, Product } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useCart, useFilter, useModal, useMutation, useQuery } from "@hooks";
import { createOrder as createOrderService } from "@services/order";
import { getAllProducts } from "@services/product";

import styles from "./Home.module.css";

const category = {
  value: 0,
  filter: ({ category_id }, category) => {
    return category_id === category;
  },
};

const search = {
  value: "",
  filter: ({ name }, search) => {
    const searchLower = search.toLowerCase();
    const nameMatch = name.toLowerCase().includes(searchLower);

    return nameMatch;
  },
};

function Home() {
  const quantityModal = useModal();
  const cartConfirmModal = useModal();

  const createOrder = useMutation(createOrderService);
  const { data: products } = useQuery("products", getAllProducts);
  const { filter, data: filteredProducts } = useFilter(products, { search, category });

  const [productId, setProductId] = useState(null);
  const [editingLine, setEditingLine] = useState(false);
  const cart = useCart(products);

  function handleProductClick(id) {
    setProductId(id);
    quantityModal.open();
  }

  function handleLineClick(id) {
    setEditingLine(true);
    setProductId(id);
    quantityModal.open();
  }

  function handleQuantityModalClose() {
    editingLine && setEditingLine(false);
    quantityModal.close();
  }

  function handleCartItemAdd(values, setSubmitting) {
    setSubmitting(true);

    cart.add({ ...values, id: productId });
    setProductId(null);
    quantityModal.close();

    setSubmitting(false);
  }

  function handleCartItemEdit(values, setSubmitting) {
    setSubmitting(true);

    cart.edit({ ...values, id: productId });
    setProductId(null);
    quantityModal.close();

    setSubmitting(false);
  }

  function handleCartItemRemove() {
    cart.remove(productId);
    setProductId(null);
    quantityModal.close();
  }

  async function handleCartSubmit(_, setSubmitting) {
    setSubmitting(true);
    await createOrder.execute(cart.items.map(({ product_id, quantity }) => ({ product_id, quantity })));
    if (createOrder.isError) toast.error(createOrder.error.message);

    cartConfirmModal.close();
    cart.clear();
    toast.success("Order placed.");

    setSubmitting(false);
  }

  const CheckoutPreview = (
    <>
      <Order.Details total={cart.total} className={styles.checkoutPreview}>
        <Order.Lines
          lines={cart.items}
          className={styles.checkoutSummary}
          onLineClick={({ product_id }) => handleLineClick(product_id)}
          onItemIncrement={({ product_id }) => cart.increment(product_id)}
          onItemDecrement={({ product_id }) => cart.decrement(product_id)}
          withCounter
        />
      </Order.Details>

      <div className={styles.checkoutBtns}>
        <Button label="Clear Cart" onClick={cart.clear} secondary />
        <Button
          label="Confirm Order"
          onClick={cartConfirmModal.open}
          disabled={cartConfirmModal.isOpen || cart.isEmpty}
        />
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
            disabled={!!cart.get(product_id)}
            disabledContent="In Cart"
            disabledColorPrimary
          />
        )}
      />

      <Modal.CartItem
        value={cart.get(productId)?.quantity ?? 1}
        max={100}
        onAdd={handleCartItemAdd}
        onEdit={handleCartItemEdit}
        onSubmit={editingLine ? handleCartItemAdd : handleCartItemEdit}
        onRemove={handleCartItemRemove}
        onClose={handleQuantityModalClose}
        open={quantityModal.isOpen}
        editing={editingLine}
      />

      <Modal.CartConfirm
        onSubmit={handleCartSubmit}
        onClose={cartConfirmModal.close}
        open={cartConfirmModal.isOpen}
        total={cart.total}
      />
    </PreviewLayout>
  );
}

export default Home;
