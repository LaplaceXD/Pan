import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Button, Modal } from "@components/common";
import { useAuth } from "@hooks/auth";
import styles from "./LogoutModal.module.css";

function LogoutModal({ open, onClose }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleLogout() {
    setIsLoggingOut(true);
    const error = await auth.logout();

    if (error) {
      toast.error(error);
    } else {
      toast.success("Logged out!");
      navigate("/login");
    }

    setIsLoggingOut(false);
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.content}>
        <div className={styles.title}>Logout?</div>
        <div className={styles.subtitle}>Are you sure you want to logout?</div>
        <div className={styles.footer}>
          <Button label="Cancel" onClick={onClose} secondary />
          <Button label="Logout" onClick={handleLogout} disabled={isLoggingOut} />
        </div>
      </div>
    </Modal>
  );
}

export default LogoutModal;
