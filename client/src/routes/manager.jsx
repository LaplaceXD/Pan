import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam, BsPeople } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Employee from "@components/pages/Employee";
import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import Report from "@components/pages/Report";
import Supplier from "@components/pages/Supplier";

import {
  downloadDailySalesReport,
  downloadEmployeeReport,
  downloadInventoryReport,
  downloadSalesReport,
  downloadSupplierStocksReport,
} from "@services/report";
import { appendPath, getLinkProps, getRouteProps } from "@utils/routes";

const directory = "/m";

const managerPages = [
  {
    path: "",
    label: "Home",
    icon: <FiHome />,
    element: (
      <Report
        reports={[
          { title: "Inventory Report", onDownload: downloadInventoryReport },
          { title: "Sales Report", onDownload: downloadSalesReport },
          { title: "Supplier Report", onDownload: downloadSupplierStocksReport },
          { title: "Employee Details", onDownload: downloadEmployeeReport, isItem: true },
          { title: "Daily Sales Report", onDownload: downloadDailySalesReport, isItem: true },
        ]}
      />
    ),
    index: true,
    navLink: true,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: <BiNotepad />,
    element: <Order showDelete />,
    navLink: true,
  },
  {
    path: "/products",
    label: "Products",
    icon: <BsBoxSeam />,
    element: <Product showStockDeleteButton showProductEditButton showProductAddButton />,
    navLink: true,
  },
  {
    path: "/suppliers",
    label: "Supplier",
    icon: <FiTruck />,
    element: <Supplier showStockDeleteButton showSupplierAddButton showSupplierEditButton />,
    navLink: true,
  },
  {
    path: "/employees",
    label: "Employees",
    icon: <BsPeople />,
    element: <Employee />,
    navLink: true,
  },
];

export default {
  directory,
  links: getLinkProps(appendPath(directory, managerPages)),
  routes: getRouteProps(appendPath(directory, managerPages)),
};
