import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "@components/pages/Login";
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
          <Route path="/" element={<LoggedIn />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
