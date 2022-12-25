import { useState } from "react";
import { toast } from "react-toastify";

import { Button } from "@components/common";
import { Modal } from "@components/module";
import { useModal } from "@hooks";
import { useProduct, useProducts } from "@hooks/services/product";
import { useStock } from "@hooks/services/stock";
import { useSupplier } from "@hooks/services/supplier";
import format from "@utils/format";

import StockForm from "../StockForm";
import StockItems from "../StockItems";
import styles from "./StockPreview.module.css";

const views = {
  STOCK_ITEMS: Symbol(0),
  STOCK_EDIT: Symbol(1),
  STOCK_ADD: Symbol(2),
};

function StockPreview({
  stocks = [],
  product = null,
  supplier = null,
  disableSupplierField = false,
  disableProductField = false,
  showStockDeleteButton = false,
  isLoading = false,
  onBack,
}) {
  const deleteModal = useModal();
  const [view, setView] = useState(views.STOCK_ITEMS);
  const [stockId, setStockId] = useState(null);

  const productsQuery = useProducts();
  const supplierQuery = useSupplier(supplier?.supplier_id);
  const productQuery = useProduct(product?.product_id);

  const stockQuery = useStock(stockId);
  const {
    payload: { data: stock },
  } = stockQuery;

  async function handleStockEdit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await stockQuery.update.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      productsQuery.invalidate(),
      // if user changes product_id that query gets invalidated
      productQuery.invalidate(values.product_id),
      // the previous product also gets invalidated on change
      productQuery.invalidate(stock?.product_id),
      supplierQuery.invalidate(values.supplier_id),
      supplierQuery.invalidate(stock?.supplier_id),
      stockQuery.invalidate(),
    ]);

    setView(views.STOCK_ITEMS);
    setStockId(null);
    toast.success("Stock edited successfully.");
  }

  async function handleStockAdd(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await stockQuery.create.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      productsQuery.invalidate(),
      productQuery.invalidate(values.product_id),
      supplierQuery.invalidate(values.supplier_id),
    ]);

    setView(views.STOCK_ITEMS);
    toast.success("Stock added successfully.");
  }

  async function handleStockDelete() {
    const { error, isRedirect } = await stockQuery.delete.execute(stockId);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      productsQuery.invalidate(),
      productQuery.invalidate(stock?.product_id),
      supplierQuery.invalidate(stock?.supplier_id),
    ]);

    setStockId(null);
    deleteModal.close();
    toast.success("Stock deleted successfully.");
  }

  function handleStockItemEdit({ stock_id }) {
    setStockId(stock_id);
    setView(views.STOCK_EDIT);
  }

  function handleStockItemDelete({ stock_id }) {
    setStockId(stock_id);
    deleteModal.open();
  }

  function handleStockAddClick() {
    if (product && !product.is_available) return toast.error("Can't add stock to an unavailable product.");
    if (supplier && !supplier.is_active) return toast.error("Can't add stock to an inactive supplier.");

    setView(views.STOCK_ADD);
  }

  const viewDetails = {
    [views.STOCK_ITEMS]: {
      header: "Product Stock",
      content: (
        <>
          <StockItems
            items={stocks}
            onItemEdit={handleStockItemEdit}
            onItemDelete={handleStockItemDelete}
            showSupplier={disableProductField}
            showProduct={disableSupplierField}
            showStockDeleteButton={showStockDeleteButton}
            isLoading={isLoading}
          />
          <div className={styles.buttons}>
            <Button label="Go Back" onClick={onBack} secondary />
            <Button label="Add Stock" onClick={handleStockAddClick} />
          </div>
        </>
      ),
    },
    [views.STOCK_EDIT]: {
      header: "Product Stock Edit",
      content: (
        <StockForm
          productId={stock?.product_id}
          supplierId={stock?.supplier_id}
          quantity={stock?.quantity}
          unit={stock?.unit}
          price={stock?.unit_price}
          notes={stock?.notes}
          dateSupplied={stock?.date_supplied}
          onCancel={() => setView(views.STOCK_ITEMS)}
          onSubmit={handleStockEdit}
          disableProductField={disableProductField}
          disableSupplierField={disableSupplierField}
        />
      ),
    },
    [views.STOCK_ADD]: {
      header: "Product Stock Create",
      content: (
        <StockForm
          onCancel={() => setView(views.STOCK_ITEMS)}
          onSubmit={handleStockAdd}
          productId={product?.product_id}
          supplierId={supplier?.supplier_id}
          disableProductField={disableProductField}
          disableSupplierField={disableSupplierField}
        />
      ),
    },
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{viewDetails[view].header}</h3>
      {viewDetails[view].content}

      {showStockDeleteButton ? (
        <Modal.Confirm
          title="Delete?"
          description="Are you sure you want to delete this stock?"
          open={deleteModal.isOpen}
          onClose={deleteModal.close}
          confirmLabel="Delete"
          confirmDisabled={stockQuery.delete.isLoading}
          onConfirm={handleStockDelete}
        />
      ) : null}
    </div>
  );
}

export default StockPreview;
