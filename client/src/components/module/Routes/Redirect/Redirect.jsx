import { useAuth } from "@hooks";
import { Navigate } from "react-router-dom";

function Redirect() {
  const { user } = useAuth();

  switch (user?.role) {
    case "employee":
      return <Navigate to="/e" replace />;
    case "manager":
      return <Navigate to="/m" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

export default Redirect;
