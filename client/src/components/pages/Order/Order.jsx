import { useState } from "react";

import { Button, Header, SearchBar } from "@components/common";
import { Modal, Order as OrderModule } from "@components/module";
import { PreviewLayout } from "@components/template";
import { useFilter, useModal, useQuery } from "@hooks";
import { getAllOrders, getOrderById } from "@services/order";
import format from "@utils/format";

import styles from "./Order.module.css";

const FILTERS = {
  search: {
    value: "",
    filter({ employee_name, order_id }, search) {
      const searchLower = search.toLowerCase();
      const nameMatch = employee_name.toLowerCase().includes(searchLower);
      const idMatch = format.id(order_id).toLowerCase().includes(searchLower);

      return nameMatch || idMatch;
    },
  },
};

function Order() {
  const deleteModal = useModal();

  const { data: orders } = useQuery("orders", getAllOrders);
  const { filter, data: filteredOrders } = useFilter(orders, FILTERS);

  const [orderId, setOrderId] = useState(null);
  const { data: order } = useQuery(["order", orderId], ({ signal }) =>
    orderId ? getOrderById(orderId, { signal }) : null
  );

  const OrderPreview = (
    <>
      <OrderModule.Details total={order?.total} className={styles.orderPreview}>
        <OrderModule.Header order={order} className={styles.orderHeader} />
        <OrderModule.Lines lines={order?.details} className={styles.orderSummary} showCount />
      </OrderModule.Details>

      <Button
        label="Delete Order Record"
        className={styles.orderDelete}
        onClick={deleteModal.open}
        disabled={orderId === null}
      />
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

      <Modal.Confirm
        title="Delete?"
        description="Are you sure you want to delete this record?"
        open={deleteModal.isOpen}
        onClose={deleteModal.close}
        confirmLabel="Delete"
        onConfirm={() => {
          alert(orderId);
          deleteModal.close();
        }}
      />
    </PreviewLayout>
  );
}

export default Order;
