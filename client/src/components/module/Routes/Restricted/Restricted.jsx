import { useAuth } from "@hooks";
import { Navigate, Outlet } from "react-router-dom";

function Restricted({ for: allowedRole }) {
  const { user } = useAuth();

  return user?.role === allowedRole ? <Outlet /> : <Navigate to="/" replace />;
}

export default Restricted;
