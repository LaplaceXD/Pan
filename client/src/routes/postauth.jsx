import { ProtectedRoutes, Routes } from "@components/module";
import { NavLayout } from "@components/template";

import employee from "./employee";
import manager from "./manager";

const postauth = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <Routes.Redirect />,
        index: true,
      },
      {
        element: <Routes.Restricted for="employee" />,
        children: [
          {
            element: <NavLayout links={employee.links} useOutlet />,
            children: employee.routes,
          },
        ],
      },
      {
        element: <Routes.Restricted for="manager" />,
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
