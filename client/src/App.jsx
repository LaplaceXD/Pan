import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@hooks/auth";
import routes from "@routes";

const router = createBrowserRouter(routes);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer autoClose={2000} limit={5} theme="colored" />
    </AuthProvider>
  );
}

export default App;
