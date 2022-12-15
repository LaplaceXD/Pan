import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProtectedRoutes } from "@components/module";
import Login from "@components/pages/Login";
import NavLayout from "@components/template/NavLayout";

import { AuthProvider } from "@hooks/auth";
import employee from "@routes/employee";
import { parseRoutes } from "@utils/routes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoutes />}>
            <Route element={<NavLayout links={employee.links} useOutlet />}>
              {parseRoutes(employee.routes)}
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
