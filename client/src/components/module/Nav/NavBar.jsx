import { FiLogOut, FiUser } from "react-icons/fi";

import logo from "@assets/Logo_128x128.svg";
import { List } from "@components/common";
import { Modal } from "@components/module";
import { useModal } from "@hooks";

import styles from "./Nav.module.css";
import NavButton from "./NavButton";
import NavLink from "./NavLink";

function NavBar({ links }) {
  const logoutModal = useModal();

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
          <NavButton onClick={logoutModal.open} label="Logout" Icon={<FiLogOut />} />
          <Modal.Logout open={logoutModal.isOpen} onClose={logoutModal.close} />
        </ul>
      </nav>
    </aside>
  );
}

export default NavBar;
