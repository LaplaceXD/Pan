import format from "@utils/format";

import NumberInputModal from "../NumberInputModal";
import styles from "./CartConfirmModal.module.css";

function CartConfirmModal({ open, total, onClose, onSubmit }) {
  return (
    <NumberInputModal
      name="amount"
      min={parseFloat(format.decimal(total))}
      initialValue={parseFloat(format.decimal(total))}
      buttonLabel="Place Order"
      onSubmit={onSubmit}
      onClose={onClose}
      open={open}
    >
      {({ amount }) => (
        <div className={styles.details}>
          <p>Amount</p>
          <p>{format.currency(Math.max(amount, total))}</p>
          <p>Total</p>
          <p>{format.currency(total)}</p>
          <p>Change</p>
          <p>{format.currency(Math.max(amount, total) - total)}</p>
        </div>
      )}
    </NumberInputModal>
  );
}

export default CartConfirmModal;
