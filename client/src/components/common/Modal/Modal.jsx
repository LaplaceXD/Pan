import { clsx } from "clsx";
import { useEffect, useRef, useState } from "react";
import { GrFormClose } from "react-icons/gr";

import Portal from "@components/common/Portal";
import styles from "./Modal.module.css";

const RIGHT_CLICK = 0;
const ESCAPE_KEY = "Escape";
const DIALOG_TAG_NAME = "DIALOG";

function Modal({
  open,
  children,
  onClose,
  className,
  slideIn = false,
  fadeIn = false,
  withCloseBtn = false,
}) {
  const ref = useRef(null);
  const [target, setTarget] = useState(null);

  /* Handle general open/close behavior of modal */
  useEffect(() => {
    if (open) ref.current?.showModal();
    else handleClose();

    return () => ref.current?.close();
  }, [ref, open]);

  const handleClose = () => {
    onClose();
    ref.current?.close();
  };

  /* Handle closing of modal when escape key is pressed. */
  const handleEscape = (e) => e.key === ESCAPE_KEY && handleClose();

  /* Handle closing of modal when backdrop is clicked */
  const handleMouseDown = (e) => e.button === RIGHT_CLICK && setTarget(e.target.tagName);
  const handleMouseUp = (e) => {
    const isDialogOnMouseDown = target === DIALOG_TAG_NAME;
    const isDialogOnMouseUp = e.target.tagName === DIALOG_TAG_NAME;

    if (isDialogOnMouseDown && isDialogOnMouseUp) {
      handleClose();
    }

    setTarget(null);
  };

  return (
    <Portal id="modal-container">
      <dialog
        className={clsx(styles.dialog, fadeIn && styles.fadeIn, slideIn && styles.slideIn, className)}
        ref={ref}
        onKeyDown={handleEscape}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {withCloseBtn ? (
          <button className={styles.closeBtn} onClick={handleClose}>
            <GrFormClose className={styles.closeIcon} />
          </button>
        ) : null}
        {open ? children : null}
      </dialog>
    </Portal>
  );
}

export default Modal;
