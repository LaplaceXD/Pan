import { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";

import logo from "@assets/Logo_128x128.svg";
import { Modal } from "@components/module";
import NavLink from "./NavLink";

import styles from "./Nav.module.css";

function NavBar({ children }) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <aside className={styles.pseudoContainer}>
      <div className={styles.container}>
        <img src={logo} className={styles.logo} alt="Pan logo." />
        <nav className={styles.nav}>
          <ul className={styles.navList}>{children}</ul>
          <ul className={styles.navList}>
            <NavLink to="/account" label="Account" Icon={<FiUser />} />
            <button className={styles.navButton} onClick={() => setOpenModal(true)}>
              <FiLogOut className={styles.navIcon} />
              Logout
            </button>
            <Modal.Logout open={openModal} onClose={() => setOpenModal(false)} />
          </ul>
        </nav>
      </div>
    </aside>
  );
}

export default NavBar;
