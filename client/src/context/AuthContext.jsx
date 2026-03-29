import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  async function login(payload) {
    const response = await http.post("/auth/login", payload);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  async function signup(payload) {
    const response = await http.post("/auth/signup", payload);
    setToken(response.data.token);
    setUser(response.data.user);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return <AuthContext.Provider value={{ token, user, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
