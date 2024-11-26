import axios from "axios";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Style.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserRegister = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("register api payloads", username, email, password, role);
    const payloads = { username, email, password, role };
    await axios
      .post(
        "https://tabletimesheetbackend.onrender.com/api/employee/register",
        payloads
      )
      .then((res) => toast.success(res.data.message))
      .catch((err) => {
        toast.error("Registration failed. Please try again.");
        console.log(err);
      });
    setEmail("");
    setPassword("");
    setUserName("");
    setRole("");
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="container">
        <div className="justify-content-center">
          <div className="col md-4">
            <div className="box  ">
              <div id="login-form" className="form-container active">
                <h3 className="text-center">Sign Up</h3>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>UserName </label> <br></br>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                      className="form-control"
                      style={{ textAlign: "left" }}
                    />
                  </div>
                  <br></br>
                  <div className="form-group">
                    <label>Email </label> <br></br>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>
                  <br></br>
                  <div className="form-group">
                    <label>Password</label> <br></br>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="form-control"
                    />
                  </div>
                  <br></br>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-3"
                  >
                    Register
                  </button>
                  <p className="mt-3 text-center">
                    Already have an account?{" "}
                    <a href="" onClick={handleLogin}>
                      Login
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default UserRegister;
