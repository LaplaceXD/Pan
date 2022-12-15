import { cloneElement } from "react";

import styles from "./Nav.module.css";

function NavButton({ label, Icon, onClick }) {
  return (
    <li className={styles.navItem}>
      <button className={styles.navButton} onClick={onClick}>
        {cloneElement(Icon, { className: styles.navIcon })}
        {label}
      </button>
    </li>
  );
}

export default NavButton;
