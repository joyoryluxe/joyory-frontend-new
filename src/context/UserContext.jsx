//=============================================================Finall-Code(One)End===================================================
import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie.split("; ");
      const isLoggedIn =
        cookies.some((c) => c.startsWith("token=")) ||
        cookies.some((c) => c.startsWith("session="));

      setUser(isLoggedIn ? { authenticated: true } : { guest: true });
      setLoading(false);
    };
    checkAuth();
  }, []);

  const loginUser = (data) => setUser(data || { guest: true });

  const logoutUser = async () => {
    try {
      await axiosInstance.post("/api/user/logout");
    } catch {}
    document.cookie.split(";").forEach(
      (c) =>
        (document.cookie = c.replace(/^ +/, "").replace(
          /=.*/,
          "=;expires=" + new Date().toUTCString() + ";path=/"
        ))
    );
    setUser({ guest: true });
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};





