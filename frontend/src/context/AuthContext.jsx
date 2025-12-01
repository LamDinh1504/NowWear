import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    role: null,
    loading: true,
  });

  // Decode token an toàn
  const decodeToken = (token) => {
    if (!token || typeof token !== "string") return null;
    try {
      const payload = token.split(".")[1];
      if (!payload) throw new Error("Token không hợp lệ");
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = JSON.parse(atob(base64));
      return decoded;
    } catch (error) {
      console.error("Không thể decode token:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token")?.trim();
    const decodedToken = decodeToken(token);
    if (decodedToken) {
      const roles = decodedToken.roles || [];
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        setAuthState({ isAuthenticated: false, user: null, role: null, loading: false });
      } else {
        setAuthState({ isAuthenticated: true, user: decodedToken.username, role: roles, loading: false });
      }
    } else {
      localStorage.removeItem("token");
      setAuthState({ isAuthenticated: false, user: null, role: null, loading: false });
    }
  }, []);

  const login = (username, token) => {
    if (!token) {
      toast.error("Token không hợp lệ");
      return;
    }
    localStorage.setItem("token", token);
    const decodedToken = decodeToken(token);
    const roles = decodedToken?.roles || [];
    setAuthState({ isAuthenticated: true, user: decodedToken.username || username, role: roles, loading: false });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({ isAuthenticated: false, user: null, role: null, loading: false });
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {authState.loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
