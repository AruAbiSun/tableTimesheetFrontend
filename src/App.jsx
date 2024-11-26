import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import { useState } from "react";
import Timesheet from "./components/Timesheet";

const App = () => {
  const [token, setToken] = useState("");
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/timesheet" element={<Timesheet token={token} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
