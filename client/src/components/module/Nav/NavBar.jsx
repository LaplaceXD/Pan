import { useState } from "react";
import { FiLogOut, FiUser } from "react-icons/fi";

import logo from "@assets/Logo_128x128.svg";
import { List } from "@components/common";
import { Modal } from "@components/module";

import styles from "./Nav.module.css";
import NavButton from "./NavButton";
import NavLink from "./NavLink";

function NavBar({ links }) {
  const [openModal, setOpenModal] = useState(false);

  const handleModalClose = () => setOpenModal(false);
  const handleModalOpen = () => setOpenModal(true);

  return (
    <aside className={styles.container}>
      <img src={logo} className={styles.logo} alt="Pan logo." />
      <nav className={styles.nav}>
        <List
          className={styles.navList}
          items={links}
          itemKey={({ to }) => to}
          RenderComponent={(prop) => <NavLink {...prop} />}
        />
        <ul className={styles.navList}>
          <NavLink to="/account" label="Account" Icon={<FiUser />} />
          <NavButton onClick={handleModalOpen} label="Logout" Icon={<FiLogOut />} />
          <Modal.Logout open={openModal} onClose={handleModalClose} />
        </ul>
      </nav>
    </aside>
  );
}

export default NavBar;
