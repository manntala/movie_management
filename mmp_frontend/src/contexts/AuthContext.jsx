import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({ username: decoded.username || "User", id: decoded.user_id });
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
  }, []);

  const login = ({ token }) => {
    localStorage.setItem("access", token.access);
    localStorage.setItem("refresh", token.refresh);

    try {
      const decoded = jwtDecode(token.access);
      setUser({
        username: decoded.username,
        id: decoded.user_id,
      });
    } catch (err) {
      console.error("Failed to decode token at login", err);
    }
  };


  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
