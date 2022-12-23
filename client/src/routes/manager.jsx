import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import Report from "@components/pages/Report";
import Supplier from "@components/pages/Supplier";
import { appendPath, getLinkProps, getRouteProps } from "@utils/routes";

const directory = "/m";

const managerPages = [
  {
    path: "",
    label: "Home",
    icon: <FiHome />,
    element: <Report />,
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
    element: <Supplier />,
    navLink: true,
  },
  // {
  //   path: "/employees",
  //   label: "Employees",
  //   icon: <BsPeople />,
  //   element: <h1>Employees</h1>,
  //   navLink: true,
  // },
];

export default {
  directory,
  links: getLinkProps(appendPath(directory, managerPages)),
  routes: getRouteProps(appendPath(directory, managerPages)),
};
