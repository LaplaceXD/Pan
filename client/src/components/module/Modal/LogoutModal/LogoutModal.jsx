import { useState } from "react";
import { redirect } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "@hooks";
import ConfirmModal from "../ConfirmModal";

function LogoutModal({ open, onClose }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const auth = useAuth();

  async function handleLogout() {
    setIsLoggingOut(true);
    await auth.logout();

    toast.success("Logged out!");
    redirect("/login");
  }

  return (
    <ConfirmModal
      title="Logout?"
      description="Are you sure you want to logout?"
      open={open}
      onClose={onClose}
      confirmLabel="Logout"
      onConfirm={handleLogout}
      confirmDisabled={isLoggingOut}
    />
  );
}

export default LogoutModal;
