import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Home from "@components/pages/Home";
import Product from "@components/pages/Product";
import { getLinkProps, getRouteProps } from "@utils/routes";

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
    element: <h1>Order</h1>,
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
    element: <h1>Supplier</h1>,
    navLink: true,
  },
];

export default {
  links: getLinkProps(employeePages),
  routes: getRouteProps(employeePages),
};
