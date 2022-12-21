import { Button, Modal } from "@components/common";
import styles from "./CategoryDeleteModal.module.css";

function CategoryDeleteModal({ open, onClose, category = "", deleteDisabled, onDelete }) {
  return (
    <Modal open={open} onClose={onClose} withCloseBtn>
      <div className={styles.content}>
        <h2>Delete?</h2>
        <p>Are you sure you want to delete the category{category ? <span> {category}</span> : null}?</p>
        <Button label="Delete" onClick={onDelete} disabled={deleteDisabled} error />
      </div>
    </Modal>
  );
}

export default CategoryDeleteModal;
