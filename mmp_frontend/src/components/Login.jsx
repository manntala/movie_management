import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import "../css/MovieForm.css";
import "../css/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await apiLogin(username, password);
      login({ username, token });
      navigate("/");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark px-3 form-page-wrapper">
      <div className="row w-100 py-4" style={{ maxWidth: 1000 }}>
        {/* Left: Login Form */}
        <div className="col-md-6 bg-white p-4 p-md-5 rounded-start shadow">
          <h2 className="mb-4 text-dark text-center">Login</h2>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                className="form-control"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn search-button w-100 p-3" type="submit">
              Login
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="mb-0">
              Don't have an account?{" "}
              <a href="/register" className="text-decoration-none text-dark">
                Register here
              </a>
            </p>
            </div>
          
        </div>

        {/* Right: Image Placeholder */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light rounded-end shadow">
          <div className="text-muted text-center">
            <p className="mb-0">[ Image Placeholder ]</p>
            <small className="text-secondary">Login to access your dashboard</small>
          </div>
        </div>
      </div>
    </div>
  );
}
