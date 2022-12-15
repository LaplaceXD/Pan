import { Button, Modal } from "@components/common";
import styles from "./LogoutModal.module.css";

function LogoutModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.title}>Logout?</div>
        <div className={styles.subtitle}>Are you sure you want to logout?</div>
        <div className={styles.footer}>
          <Button label="Cancel" onClick={onClose} secondary />
          <Button label="Logout" />
        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;
