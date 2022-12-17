import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Home from "@components/pages/Home";
import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import { getLinkProps, getRouteProps } from "@utils/routes";
import Supplier from "@components/pages/Supplier";

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
    path: "/order",
    label: "Orders",
    icon: <BiNotepad />,
    element: <Order />,
    navLink: true,
  },
  {
    path: "/product",
    label: "Products",
    icon: <BsBoxSeam />,
    element: <Product />,
    navLink: true,
  },
  {
    path: "/supplier",
    label: "Supplier",
    icon: <FiTruck />,
    element: <Supplier />,
    navLink: true,
  },
];

export default {
  links: getLinkProps(employeePages),
  routes: getRouteProps(employeePages),
};
