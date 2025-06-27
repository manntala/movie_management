import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/NavBar.css";
import { RiMovie2AiLine } from "react-icons/ri";

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // ✅ only call once
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand d-flex align-items-center gap-2">
        <RiMovie2AiLine size={28} style={{ verticalAlign: "middle" }} />
        <Link to="/" className="brand-link">Movie Management Platform</Link>
      </div>

      <div className="navbar-links">
        {user ? (
          <div className="nav-dropdown" ref={dropdownRef}>
            <span
              className="greeting clickable text-capitalize"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Hi, {user.username}
            </span>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/create" className="nav-link text-dark">Add Movie</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="nav-link text-light">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
