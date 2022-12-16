import Login from "@components/pages/Login";

const preauth = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "*",
    element: <h1>404</h1>,
  },
];

export default preauth;
