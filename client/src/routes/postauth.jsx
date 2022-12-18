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
        element: <NavLayout links={employee.links} useOutlet />,
        children: employee.routes,
      },
      {
        element: <NavLayout links={manager.links} useOutlet />,
        children: manager.routes,
      },
    ],
  },
];

export default postauth;
