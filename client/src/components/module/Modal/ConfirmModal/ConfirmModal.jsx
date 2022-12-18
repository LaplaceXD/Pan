import { Button, Modal } from "@components/common";
import styles from "./ConfirmModal.module.css";

function ConfirmModal({ open, onClose, onConfirm, confirmDisabled, confirmLabel, title, description }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
        <div className={styles.footer}>
          <Button label="Cancel" onClick={onClose} secondary />
          <Button label={confirmLabel} onClick={onConfirm} disabled={confirmDisabled} />
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
