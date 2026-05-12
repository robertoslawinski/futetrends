import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";
import { trackEvent } from "../api/analytics.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("futetrends_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/verify")
      .then(({ data }) => setUser(data.user))
      .catch(() => localStorage.removeItem("futetrends_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("futetrends_token", data.token);
    setUser(data.user);
    trackEvent("login_completed");
  }

  async function signup(payload) {
    const { data } = await api.post("/auth/signup", payload);
    localStorage.setItem("futetrends_token", data.token);
    setUser(data.user);
    trackEvent("sign_up_completed");
  }

  function logout() {
    localStorage.removeItem("futetrends_token");
    setUser(null);
  }

  const value = useMemo(() => ({ user, setUser, loading, login, signup, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
