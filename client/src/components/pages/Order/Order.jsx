import { useState } from "react";
import { useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { Button, Header, SearchBar } from "@components/common";
import { Modal, Order as OrderModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter, useModal, useMutation, useQuery } from "@hooks";
import { deleteOrderById, getAllOrders, getOrderById } from "@services/order";
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
  const queryClient = useQueryClient();

  const deleteOrder = useMutation(deleteOrderById);
  const { data: orders } = useQuery("orders", getAllOrders);
  const { filter, data: filteredOrders } = useFilter(orders, { search });

  const [orderId, setOrderId] = useState(null);
  const { data: order } = useQuery(["order", orderId], ({ signal }) =>
    orderId ? getOrderById(orderId, { signal }) : null
  );

  async function handleDeleteOrder() {
    const { error, isRedirect } = await deleteOrder.execute(orderId);
    if (isRedirect) return;
    if (error) toast.error(error);

    await queryClient.invalidateQueries("orders");
    setOrderId(null);
    deleteModal.close();
    toast.success("Order deleted successfully.");
  }

  const OrderPreview = (
    <>
      <OrderModule.Details total={order?.total} className={styles.orderPreview}>
        <OrderModule.Header order={order} className={styles.orderHeader} />
        <OrderModule.Lines lines={order?.details} className={styles.orderSummary} disabledLines showCount />
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
      />

      {showDelete ? (
        <Modal.Confirm
          title="Delete?"
          description="Are you sure you want to delete this record?"
          open={deleteModal.isOpen}
          onClose={deleteModal.close}
          confirmLabel="Delete"
          confirmDisabled={deleteOrder.isLoading}
          onConfirm={handleDeleteOrder}
        />
      ) : null}
    </PreviewLayout>
  );
}

export default Order;
