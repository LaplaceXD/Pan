import { clsx } from "clsx";
import { cloneElement } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./NavBar.module.css";

function NavLink({ to, Icon, label }) {
  const { pathname } = useLocation();

  return (
    <li className={clsx(styles.navLink, pathname === to && styles.isSelected)}>
      <Link to={to}>
        {cloneElement(Icon, { className: styles.navIcon })}
        {label}
      </Link>
    </li>
  );
}

export default NavLink;
