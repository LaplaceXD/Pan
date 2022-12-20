import { BiNotepad } from "react-icons/bi";
import { BsBoxSeam } from "react-icons/bs";
import { FiHome, FiTruck } from "react-icons/fi";

import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import { appendPath, getLinkProps, getRouteProps } from "@utils/routes";

const directory = "/m";

const managerPages = [
  {
    path: "",
    label: "Home",
    icon: <FiHome />,
    element: <h1>Home</h1>,
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
    element: <Product withPreview />,
    navLink: true,
  },
  {
    path: "/suppliers",
    label: "Supplier",
    icon: <FiTruck />,
    element: <h1>Suppliers</h1>,
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
