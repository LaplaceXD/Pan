import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Home from "@components/pages/Home";
import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import { appendPath, getLinkProps, getRouteProps } from "@utils/routes";

const directory = "/e";

const employeePages = [
  {
    path: "",
    label: "Home",
    icon: <FiHome />,
    element: <Home />,
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
    element: <h1>Supplier</h1>,
    navLink: true,
  },
];

export default {
  directory,
  links: getLinkProps(appendPath(directory, employeePages)),
  routes: getRouteProps(appendPath(directory, employeePages)),
};
