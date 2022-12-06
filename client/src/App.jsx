import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ProtectedRoutes } from "@components/module";
import Login from "@components/pages/Login";
import Home from "@components/pages/Home";
import Order from "@components/pages/Order";
import Product from "@components/pages/Product";
import Supplier from "@components/pages/Supplier";
import Account from "@components/pages/Account/Account.jsx";
import { AuthProvider, useAuth } from "@hooks/Auth";

function LoggedIn() {
  const [auth] = useAuth();
  return <h1>{`LOGGED IN! ${auth.first_name} ${auth.last_name}`}</h1>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/*<Route path="/" element={<ProtectedRoutes />}>*/}
          {/*  <Route index element={<LoggedIn />} />*/}
          {/*</Route>*/}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home/>} />
            <Route path="/order" element={<Order/>} />
            <Route path="/product" element={<Product/>} />
            <Route path="/supplier" element={<Supplier/>} />
            <Route path="/account" element={<Account/>} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={5}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </AuthProvider>
  );
}

export default App;
