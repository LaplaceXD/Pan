import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { Button } from "@components/common";
import { Modal } from "@components/module";
import { useModal, useMutation, useQuery } from "@hooks";
import {
  createStock as createStockService,
  deleteStockById,
  editStockById,
  getStockById,
} from "@services/stock";
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
  onBack,
}) {
  const queryClient = useQueryClient();
  const deleteModal = useModal();
  const [view, setView] = useState(views.STOCK_ITEMS);
  const [stockId, setStockId] = useState(null);

  const { data: stock } = useQuery(["stock", stockId], async ({ signal }) => {
    return stockId ? await getStockById(stockId, { signal }) : null;
  });
  const editStock = useMutation(async (body) => await editStockById(stockId, body));
  const createStock = useMutation(createStockService);
  const deleteStock = useMutation(deleteStockById);

  async function handleStockEdit(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await editStock.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      queryClient.invalidateQueries("products"),
      queryClient.invalidateQueries(["product", values.product_id, "stocks"]),
      queryClient.invalidateQueries(["supplier", values.supplier_id, "stocks"]),
      queryClient.invalidateQueries(["product", values.product_id]),
      queryClient.invalidateQueries(["stock", stockId]),
    ]);

    setView(views.STOCK_ITEMS);
    setStockId(null);
    toast.success("Stock edited successfully.");
  }

  async function handleStockAdd(values, setSubmitting) {
    setSubmitting(true);
    const { error, isRedirect } = await createStock.execute(values);
    setSubmitting(false);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      queryClient.invalidateQueries("products"),
      queryClient.invalidateQueries(["product", values.product_id, "stocks"]),
      queryClient.invalidateQueries(["supplier", values.supplier_id, "stocks"]),
      queryClient.invalidateQueries(["product", values.product_id]),
    ]);

    setView(views.STOCK_ITEMS);
    setStockId(null);
    toast.success("Stock added successfully.");
  }

  async function handleStockDelete() {
    const { error, isRedirect } = await deleteStock.execute(stockId);

    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([
      queryClient.invalidateQueries("products"),
      queryClient.invalidateQueries(["product", product?.product_id, "stocks"]),
      queryClient.invalidateQueries(["supplier", supplier?.supplier_id, "stocks"]),
      queryClient.invalidateQueries(["product", product?.product_id]),
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
          />
          <div className={styles.buttons}>
            <Button label="Go Back" onClick={onBack} secondary />
            <Button label="Add Stock" onClick={() => setView(views.STOCK_ADD)} />
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
          supplier={supplier?.supplier_id}
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
          confirmDisabled={deleteStock.isLoading}
          onConfirm={handleStockDelete}
        />
      ) : null}
    </div>
  );
}

export default StockPreview;
