import { Button } from "@components/common";
import NumberInputModal from "../NumberInputModal";
import styles from "./CartItemModal.module.css";

function CartItemModal({ open, max, value, onClose, onRemove, onAdd, onEdit, editing }) {
  return (
    <NumberInputModal
      name="quantity"
      min={1}
      max={max}
      initialValue={editing ? value : 1}
      buttonLabel={editing ? "Edit" : "Add to Cart"}
      onSubmit={editing ? onEdit : onAdd}
      onClose={onClose}
      open={open}
      className={editing && styles.editing}
      isInteger
    >
      {() => (editing ? <Button type="button" label="Remove" onClick={onRemove} error /> : null)}
    </NumberInputModal>
  );
}

export default CartItemModal;
