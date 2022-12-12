import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import NavBar from "@components/module/NavBar";
import styles from "./MainLayout.module.css";

const routes = [
  {
    path: "/",
    label: "Home",
    Icon: <FiHome />,
  },
  {
    path: "/order",
    label: "Orders",
    Icon: <BiNotepad />,
  },
  {
    path: "/product",
    label: "Products",
    Icon: <BsBoxSeam />,
  },
  {
    path: "/supplier",
    label: "Suppliers",
    Icon: <FiTruck />,
  },
];

function MainLayout({ children }) {
  return (
    <div className={styles.layout}>
      <NavBar routes={routes} />
      <main>
        <div>{children}</div>
      </main>
    </div>
  );
}

export default MainLayout;
