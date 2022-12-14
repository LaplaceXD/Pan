import { FiLogOut, FiUser } from "react-icons/fi";
import React, { useState } from 'react';
import logo from "@assets/Logo_128x128.svg";
import styles from "./Nav.module.css";
import NavLink from "./NavLink";
import LogoutModal from "../../Modals/LogoutModal.jsx";

function NavBar({ children }) {
    const [openModal, setOpenModal] = useState(false)

  return (
    <aside className={styles.container}>
      <img src={logo} className={styles.logo} alt="Pan logo." />
      <nav className={styles.nav}>
        <ul className={styles.navList}>{children}</ul>
        <ul className={styles.navList}>
            <NavLink to="/account" label="Account" Icon={<FiUser />} />
            <button className={styles.navButton} onClick={() => setOpenModal(true)}><FiLogOut className={styles.navIcon}/>Logout</button>
            <LogoutModal open={openModal} onClose={() => setOpenModal(false)}/>
        </ul>
      </nav>
    </aside>
  );
}

export default NavBar;
