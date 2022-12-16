import { ProtectedRoutes } from "@components/module";
import { NavLayout } from "@components/template";

import employee from "./employee";

const postauth = [
  {
    path: "/",
    element: <ProtectedRoutes />,
    children: [
      {
        element: <NavLayout links={employee.links} useOutlet />,
        children: employee.routes,
      },
    ],
  },
];

export default postauth;
