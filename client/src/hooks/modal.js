import { useState } from "react";

function useModal() {
  const [open, setOpen] = useState(false);

  return {
    isOpen: open,
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen(!open),
  };
}

export default useModal;
