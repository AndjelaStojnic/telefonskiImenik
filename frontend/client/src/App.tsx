import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./components/Register";
import Dashboard from "./Dashboard";
import VerifyEmail from "./VerifyEmail";


export default function App() {
  return (
    <Router>
      <div style={{ fontFamily: "sans-serif" }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </div>
    </Router>
  );
}
