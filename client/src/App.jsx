import Login from "@components/pages/Login";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>LOGGED IN!</h1>} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
