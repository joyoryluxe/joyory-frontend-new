import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get("/api/user/profile", {
          withCredentials: true,
        });
        if (isMounted) setUser(res.data?.profile || null);
      } catch (err) {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoadingUser(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginUser = (profile) => setUser(profile);
  const logoutUser = () => setUser(null);

  return (
    <AuthContext.Provider
      value={{ user, loginUser, logoutUser, loadingUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
