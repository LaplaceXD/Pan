import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@hooks/auth";
import routes from "@routes";

const router = createBrowserRouter(routes);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <ToastContainer autoClose={2000} limit={5} theme="colored" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
