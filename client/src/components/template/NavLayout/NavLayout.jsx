import { Outlet } from "react-router-dom";

import { Nav } from "@components/module";
import styles from "./NavLayout.module.css";

function EmployeeLayout({ links, useOutlet = false, children }) {
  return (
    <div className={styles.container}>
      <Nav.Bar links={links} />
      {useOutlet ? <Outlet /> : children}
    </div>
  );
}

export default EmployeeLayout;
