import { useState } from "react";
import { toast } from "react-toastify";

import { Button, Header, SearchBar } from "@components/common";
import { Modal, Order as OrderModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter, useModal } from "@hooks";
import { useOrder, useOrders } from "@hooks/services/order";
import { useProducts } from "@hooks/services/product";
import format from "@utils/format";

import styles from "./Order.module.css";

const search = {
  value: "",
  filter: ({ employee_name, order_id }, search) => {
    const searchLower = search.toLowerCase();
    const nameMatch = employee_name.toLowerCase().includes(searchLower);
    const idMatch = format.id(order_id).toLowerCase().includes(searchLower);

    return nameMatch || idMatch;
  },
};

function Order({ showDelete = false }) {
  const deleteModal = useModal();

  const productsQuery = useProducts();
  const ordersQuery = useOrders();
  const { filter, data: filteredOrders } = useFilter(ordersQuery.payload.data, { search });

  const [orderId, setOrderId] = useState(null);
  const orderQuery = useOrder(orderId);
  const {
    payload: { data: order },
  } = orderQuery;

  async function handleDeleteOrder() {
    const { error, isRedirect } = await orderQuery.delete.execute();
    if (isRedirect) return;
    if (error) return toast.error(format.error(error));

    await Promise.all([ordersQuery.invalidate(), productsQuery.invalidate()]);
    setOrderId(null);
    deleteModal.close();
    toast.success("Order deleted successfully.");
  }

  const OrderPreview = (
    <>
      <OrderModule.Details total={order?.total} className={styles.orderPreview}>
        <OrderModule.Header order={order} className={styles.orderHeader} />
        <OrderModule.Lines
          lines={order?.details}
          className={styles.orderSummary}
          isLoading={orderQuery.payload.isLoading}
          disabledLines
          showCount
        />
      </OrderModule.Details>

      {showDelete ? (
        <Button
          label="Delete Order Record"
          className={styles.orderDelete}
          onClick={deleteModal.open}
          disabled={orderId === null}
        />
      ) : null}
    </>
  );

  return (
    <PreviewLayout PreviewComponent={OrderPreview} className={styles.container}>
      <Header title="Order History" className={styles.header}>
        <SearchBar
          className={styles.search}
          value={filter.search}
          onSearch={(e) => filter.handleSearch(e.currentTarget.value)}
        />
      </Header>

      <OrderModule.History
        className={styles.historyList}
        history={filteredOrders}
        itemIsSelected={(id) => id === orderId}
        onItemSelect={(id) => setOrderId(id === orderId ? null : id)}
        isLoading={ordersQuery.payload.isLoading}
      />

      {showDelete ? (
        <Modal.Confirm
          title="Delete?"
          description="Are you sure you want to delete this record?"
          open={deleteModal.isOpen}
          onClose={deleteModal.close}
          confirmLabel="Delete"
          confirmDisabled={orderQuery.delete.isLoading}
          onConfirm={handleDeleteOrder}
        />
      ) : null}
    </PreviewLayout>
  );
}

export default Order;
