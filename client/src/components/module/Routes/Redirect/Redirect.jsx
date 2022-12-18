import { useAuth } from "@hooks";
import { Navigate } from "react-router-dom";

function Redirect({ map }) {
  const { user } = useAuth();

  if (user?.role in map) {
    const path = map[user.role];
    return <Navigate to={path} replace />;
  }

  return <Navigate to="/login" replace />;
}

export default Redirect;
