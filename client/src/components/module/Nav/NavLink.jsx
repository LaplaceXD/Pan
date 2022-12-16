import { clsx } from "clsx";
import { cloneElement } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./Nav.module.css";

function NavLink({ to, Icon, label }) {
  const { pathname } = useLocation();

  return (
    <li className={clsx(styles.navItem, pathname === to && styles.isSelected)}>
      <Link to={to}>
        {cloneElement(Icon, { className: styles.navIcon })}
        {label}
      </Link>
    </li>
  );
}

export default NavLink;
