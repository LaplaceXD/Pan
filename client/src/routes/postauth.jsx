import { Routes } from "@components/module";
import { NavLayout } from "@components/template";

import employee from "./employee";
import manager from "./manager";

const roles = Object.freeze({
  EMPLOYEE: "employee",
  MANAGER: "manager",
});

const postauth = [
  {
    path: "/",
    element: <Routes.Protected />,
    children: [
      {
        element: (
          <Routes.Redirect
            map={{
              [roles.EMPLOYEE]: employee.directory,
              [roles.MANAGER]: manager.directory,
            }}
          />
        ),
        index: true,
      },
      {
        element: <Routes.Restricted for={roles.EMPLOYEE} />,
        children: [
          {
            element: <NavLayout links={employee.links} useOutlet />,
            children: employee.routes,
          },
        ],
      },
      {
        element: <Routes.Restricted for={roles.MANAGER} />,
        children: [
          {
            element: <NavLayout links={manager.links} useOutlet />,
            children: manager.routes,
          },
        ],
      },
    ],
  },
];

export default postauth;
