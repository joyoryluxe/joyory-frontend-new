import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { UserContext } from "../../Context/UserContext";
import { UserContext } from "../../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Checking session...</div>;
  if (!user?.authenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;


