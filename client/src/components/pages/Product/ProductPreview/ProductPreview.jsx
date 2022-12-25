import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import placeholderImg from "@assets/imgs/placeholder-img.jpg";
import { FillButton } from "@components/common";
import { Product, Stock } from "@components/module";
import { useProduct, useProducts } from "@hooks/services/product";
import format from "@utils/format";

import styles from "./ProductPreview.module.css";

const views = {
  PRODUCT_STOCK: Symbol(4),
  PRODUCT_EDIT_FORM: Symbol(3),
  PRODUCT_ADD_FORM: Symbol(2),
  PRODUCT_DETAIL: Symbol(1),
  DEFAULT: Symbol(0),
};

function ProductPreview({
  productId,
  showStockDeleteButton = false,
  showProductAddButton = false,
  showProductEditButton = false,
}) {
  const [view, setView] = useState(views.DEFAULT);
  const productsQuery = useProducts();
  const productQuery = useProduct(productId);
  const {
    stocks: { data: stocks },
    payload: { data: product },
  } = productQuery;

  useEffect(() => setView(productId ? views.PRODUCT_DETAIL : views.DEFAULT), [productId]);

  async function handleProductEdit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await productQuery.update.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([productsQuery.invalidate(), productQuery.invalidate()]);
    setView(views.PRODUCT_DETAIL);
    toast.success("Product edited successfully.");
  }

  async function handleProductAdd(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await productsQuery.create.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([productsQuery.invalidate(), productQuery.invalidate()]);
    setView(views.DEFAULT);
    toast.success("Product added successfully.");
  }

  async function handleProductStatusChange() {
    const { error, isRedirect } = await productQuery.toggleStatus.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([productsQuery.invalidate(), productQuery.invalidate()]);
    toast.success("Product status toggled successfully.");
  }

  const viewDetails = {
    [views.PRODUCT_STOCK]: (
      <Stock.Preview
        stocks={stocks}
        product={product}
        onBack={() => setView(views.PRODUCT_DETAIL)}
        showStockDeleteButton={showStockDeleteButton}
        disableProductField
      />
    ),
    [views.PRODUCT_DETAIL]: (
      <Product.Detail
        name={product?.name}
        description={product?.description}
        category={product?.category_name}
        img={placeholderImg}
        stock={product?.available_stock}
        isAvailable={product?.is_available}
        price={product?.unit_price}
        onEdit={() => setView(views.PRODUCT_EDIT_FORM)}
        onViewStock={() => setView(views.PRODUCT_STOCK)}
        onStatusChange={handleProductStatusChange}
        statusChangeDisabled={productQuery.toggleStatus.isLoading}
        showProductEditButton={showProductEditButton}
      />
    ),
    [views.PRODUCT_EDIT_FORM]: (
      <Product.Form
        title="Product Edit Details"
        name={product?.name}
        description={product?.description}
        categoryId={product?.category_id}
        img={placeholderImg}
        price={product?.unit_price}
        onCancel={() => setView(views.PRODUCT_DETAIL)}
        onSubmit={handleProductEdit}
      />
    ),
    [views.PRODUCT_ADD_FORM]: (
      <Product.Form
        title="Add New Product"
        img={placeholderImg}
        onCancel={() => setView(views.DEFAULT)}
        onSubmit={handleProductAdd}
      />
    ),
    [views.DEFAULT]: showProductAddButton ? (
      <FillButton
        className={styles.addBtn}
        label="Add new Product"
        onClick={() => setView(views.PRODUCT_ADD_FORM)}
      />
    ) : null,
  };

  return <div className={styles.container}>{viewDetails[view]}</div>;
}

export default ProductPreview;
