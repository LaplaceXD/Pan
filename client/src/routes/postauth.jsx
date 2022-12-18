import { Routes } from "@components/module";
import { NavLayout } from "@components/template";
import { getDirectoryMap } from "@utils/routes";

import Account from "@components/pages/Account";

import employee from "./employee";
import manager from "./manager";

const roles = Object.freeze({
  EMPLOYEE: "employee",
  MANAGER: "manager",
});

const restrictedPages = [
  {
    name: roles.EMPLOYEE,
    ...employee,
  },
  {
    name: roles.MANAGER,
    ...manager,
  },
];

const postauth = [
  {
    path: "/",
    element: <Routes.Protected />,
    children: [
      {
        element: <Routes.Redirect map={getDirectoryMap(restrictedPages)} />,
        index: true,
      },
      {
        path: "/account",
        element: <Routes.Redirect map={getDirectoryMap(restrictedPages, "/account")} />,
        exact: true,
      },
      ...restrictedPages.map(({ name: role, links, routes, directory }) => ({
        element: <Routes.Restricted for={role} useOutlet />,
        children: [
          /* Actual page with the navlayout and its routes */
          {
            element: <NavLayout links={links} useOutlet />,
            children: [
              ...routes,
              {
                path: directory + "/account",
                element: <Account/>,
              },
            ],
          },
        ],
      })),
    ],
  },
];

export default postauth;
