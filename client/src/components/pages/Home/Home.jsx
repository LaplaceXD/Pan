import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import placeholderImg from "@assets/imgs/placeholder-img.jpg";
import { Button, Grid, Header, SearchBar } from "@components/common";
import { Category, Modal, Order, Product } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useCart, useFilter, useModal, useMutation, useQuery } from "@hooks";
import { createOrder as createOrderService } from "@services/order";
import { getAllProducts } from "@services/product";
import format from "@utils/format";

import styles from "./Home.module.css";

const category = {
  value: 0,
  filter: ({ category_id }, category) => category_id === category,
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
  const queryClient = useQueryClient();

  const createOrder = useMutation(createOrderService);
  const { data: products } = useQuery("products", getAllProducts);
  const { filter, data: filteredProducts } = useFilter(
    products?.filter(({ is_available, available_stock }) => is_available && available_stock > 0),
    { search, category }
  );

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

    const { error, isRedirect } = await createOrder.execute(
      cart.items.map(({ product_id, quantity }) => ({ product_id, quantity }))
    );

    setSubmitting(false);
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await queryClient.invalidateQueries("products");
    cartConfirmModal.close();
    cart.clear();
    toast.success("Order placed.");
  }

  const CheckoutPreview = (
    <>
      <Order.Details total={cart.total} className={styles.checkoutPreview}>
        <Order.Lines
          lines={cart.items}
          className={styles.checkoutSummary}
          onLineClick={({ product_id }) => handleLineClick(product_id)}
          onItemIncrement={({ product_id }) => {
            const product = cart.items.find((product) => product.product_id === product_id);
            const item = cart.get(product_id);

            item?.quantity < product?.available_stock && cart.increment(product_id);
          }}
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
        RenderComponent={({ product_id, name, unit_price, available_stock }) => (
          <Product.Card
            key={product_id}
            img={placeholderImg}
            name={name}
            price={unit_price}
            onClick={() => handleProductClick(product_id)}
            disabled={!!cart.get(product_id) || available_stock <= 0}
            disabledContent={available_stock <= 0 ? "Out of Stock" : "In Cart"}
            disabledColorPrimary={available_stock > 0}
          />
        )}
      />

      <Modal.CartItem
        value={cart.get(productId)?.quantity ?? 1}
        max={products.find(({ product_id }) => product_id === productId)?.available_stock}
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
