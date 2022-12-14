import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProtectedRoutes } from "@components/module";
import Home from "@components/pages/Home";
import Login from "@components/pages/Login";
import EmployeeLayout from "@components/template/EmployeeLayout";
import { AuthProvider } from "@hooks/auth";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route element={<EmployeeLayout />}>
              <Route index element={<Home />} />
              <Route path="/order" element={<h1>Order</h1>} />
              <Route path="/product" element={<h1>Products</h1>} />
              <Route path="/supplier" element={<h1>Supplier</h1>} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </Router>

      <ToastContainer autoClose={2000} limit={5} theme="colored" />
    </AuthProvider>
  );
}

export default App;
