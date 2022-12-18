import { Routes } from "@components/module";
import { NavLayout } from "@components/template";
import { getDirectoryMap } from "@utils/routes";

import employee from "./employee";
import manager from "./manager";

const roles = Object.freeze({
  EMPLOYEE: "employee",
  MANAGER: "manager",
});

const pages = [
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
        element: <Routes.Redirect map={getDirectoryMap(pages)} />,
        index: true,
      },
      {
        path: "/account",
        element: <Routes.Redirect map={getDirectoryMap(pages, "/account")} />,
        exact: true,
      },
      ...pages.map((page) => ({
        element: <Routes.Restricted for={page.name} useOutlet />,
        children: [
          {
            element: <NavLayout links={page.links} useOutlet />,
            children: [
              ...page.routes,
              {
                path: page.directory + "/account",
                element: <h1>Account</h1>,
              },
            ],
          },
        ],
      })),
    ],
  },
];

export default postauth;
