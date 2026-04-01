import { createContext, useEffect, useState } from "react";

import { fetchProfile, login, signup } from "../services/auth.services";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sflow_token");
    if (!token) {
      setBootstrapping(false);
      return;
    }

    fetchProfile()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("sflow_token");
        setUser(null);
      })
      .finally(() => setBootstrapping(false));
  }, []);

  async function handleSignup(payload) {
    const data = await signup(payload);
    localStorage.setItem("sflow_token", data.access_token);
    setUser(data.user);
    return data;
  }

  async function handleLogin(payload) {
    const data = await login(payload);
    localStorage.setItem("sflow_token", data.access_token);
    setUser(data.user);
    return data;
  }

  function logout() {
    localStorage.removeItem("sflow_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        bootstrapping,
        isAuthenticated: Boolean(user),
        login: handleLogin,
        signup: handleSignup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
