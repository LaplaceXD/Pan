import { FiLogOut, FiUser } from "react-icons/fi";

import logo from "@assets/Logo_128x128.svg";
import styles from "./Nav.module.css";
import NavLink from "./NavLink";

function NavBar({ children }) {
  return (
    <aside className={styles.container}>
      <img src={logo} className={styles.logo} alt="Pan logo." />
      <nav className={styles.nav}>
        <ul className={styles.navList}>{children}</ul>
        <ul className={styles.navList}>
          <NavLink to="/account" label="Account" Icon={<FiUser />} />
          {/* Change this to button since you'll have to delete tokens */}
          <NavLink to="/login" label="Logout" Icon={<FiLogOut />} />
        </ul>
      </nav>
    </aside>
  );
}

export default NavBar;
