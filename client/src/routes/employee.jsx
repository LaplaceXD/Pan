import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Cashier from "@components/pages/Cashier";
import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import Supplier from "@components/pages/Supplier";
import { appendPath, getLinkProps, getRouteProps } from "@utils/routes";

const directory = "/e";

const employeePages = [
  {
    path: "",
    label: "Home",
    icon: <FiHome />,
    element: <Cashier />,
    index: true,
    navLink: true,
  },
  {
    path: "/orders",
    label: "Orders",
    icon: <BiNotepad />,
    element: <Order />,
    navLink: true,
  },
  {
    path: "/products",
    label: "Products",
    icon: <BsBoxSeam />,
    element: <Product />,
    navLink: true,
  },
  {
    path: "/suppliers",
    label: "Supplier",
    icon: <FiTruck />,
    element: <Supplier />,
    navLink: true,
  },
];

export default {
  directory,
  links: getLinkProps(appendPath(directory, employeePages)),
  routes: getRouteProps(appendPath(directory, employeePages)),
};
