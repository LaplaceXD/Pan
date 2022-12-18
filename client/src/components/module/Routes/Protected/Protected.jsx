import { useAuth } from "@hooks";
import { Navigate, Outlet } from "react-router-dom";

function Protected() {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default Protected;
