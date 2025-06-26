import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await axios.post("http://localhost:8000/register/", form); // Adjust if needed
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data || "Registration failed";
      setError(typeof msg === "string" ? msg : "Check your input.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark px-3 form-page-wrapper">
      <div className="row w-100" style={{ maxWidth: 1000 }}>
        {/* Left: Register Form */}
        <div className="col-md-6 bg-white p-4 p-md-5 rounded-start shadow">
          <h2 className="mb-4 text-dark text-center">Register</h2>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Registered successfully!</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn search-button w-100 p-3" type="submit">
              Register
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="mb-0">
              Already have an account?{" "}
              <a href="/login" className="text-decoration-none text-dark">
                Login here
              </a>
            </p>
            </div>
        </div>

        {/* Right: Image Placeholder */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light rounded-end shadow">
          <div className="text-muted text-center">
            <p className="mb-0">[ Image Placeholder ]</p>
            <small className="text-secondary">Upload an image here later</small>
          </div>
        </div>
      </div>
    </div>
  );
}
