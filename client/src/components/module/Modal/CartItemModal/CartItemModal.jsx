import NumberInputModal from "../NumberInputModal";

function CartItemModal({ open, max, onClose, onSubmit }) {
  return (
    <NumberInputModal
      name="quantity"
      min={1}
      max={max}
      initialValue={1}
      buttonLabel="Add to Cart"
      onSubmit={onSubmit}
      onClose={onClose}
      open={open}
      isInteger
    />
  );
}

export default CartItemModal;
