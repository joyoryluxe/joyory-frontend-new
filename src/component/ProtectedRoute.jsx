// // src/component/ProtectedRoute.js
// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const isLoggedIn = !!localStorage.getItem("token"); // or however you store login state
//   if (!isLoggedIn) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

// export default ProtectedRoute;










// // src/component/ProtectedRoute.jsx
// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(UserContext);

//   if (loading) return null; // Wait until user is loaded

//   // Only redirect if user is NOT logged in
//   if (!user || (!user.guest && !user.id)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;











// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(UserContext);

//   if (loading) return null; // wait until user is loaded

//   // ✅ Allow guest users for all pages
//   // if (user && user.guest) {
//   //   return children;
//   // }

//   if (!user || user.guest) {
//     return children;
//   }

//   // ✅ Allow logged-in users
//   if (user && !user.guest) {
//     return children;
//   }

//   // ❌ Otherwise, redirect to login
//   return <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;








// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(UserContext);
//   const location = useLocation();

//   // ⏳ Wait for user data to load before making a decision
//   if (loading) return null;

//   // ✅ Allow all users (logged-in or guest) to access every page
//   if (user && (user.guest || user.authenticated)) {
//     return children;
//   }


  
//   // ❌ If somehow user is null or undefined, redirect to login
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;



















// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children, allowGuest = true }) => {
//   const { user, loading } = useContext(UserContext);
//   const location = useLocation();

//   // ⏳ Wait for user data to load before making a decision
//   if (loading) return null;

//   // ❌ If no user info found, redirect to login
//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   // 🟢 Allow guest users if allowed for this page
//   if (allowGuest && user.guest) {
//     return children;
//   }

//   // 🟢 Allow authenticated (logged-in) users
//   if (user.authenticated) {
//     return children;
//   }

//   // 🔴 Otherwise (guest not allowed on this route)
//   return <Navigate to="/login" state={{ from: location }} replace />;
// };

// export default ProtectedRoute;





// import React, { useContext } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children, allowGuest = true }) => {
//   const { user, loading } = useContext(UserContext);
//   const location = useLocation();

//   // ⏳ Wait until user context finishes loading
//   if (loading) return null;

//   // 🟢 Allow guest or authenticated users
//   if (user?.guest && allowGuest) {
//     return children;
//   }

//   if (user?.authenticated) {
//     return children;
//   }

//   // 🔴 If no valid user, redirect to login
//   return <Navigate to="/login" state={{ from: location }} replace />;
// };

// export default ProtectedRoute;

















import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
// import { UserContext } from "../Context/UserContext";
import { UserContext } from "./UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <div>Checking session...</div>;
  if (!user?.authenticated) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;









// ProtectedRoute.js

// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { UserContext } from "./UserContext";

// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useContext(UserContext);

//   if (loading) return <div>Checking session...</div>;

//   if (!user?.authenticated) return <Navigate to="/login" replace />;

//   return children;
// };

// export default ProtectedRoute;
















