import { Outlet } from "react-router-dom";

import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import { Nav } from "@components/module";
import styles from "./EmployeeLayout.module.css";

function EmployeeLayout() {
  return (
    <div className={styles.container}>
      <Nav.Bar>
        <Nav.Link to="/" label="Home" Icon={<FiHome />} />
        <Nav.Link to="/order" label="Orders" Icon={<BiNotepad />} />
        <Nav.Link to="/product" label="Products" Icon={<BsBoxSeam />} />
        <Nav.Link to="/supplier" label="Suppliers" Icon={<FiTruck />} />
      </Nav.Bar>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default EmployeeLayout;
