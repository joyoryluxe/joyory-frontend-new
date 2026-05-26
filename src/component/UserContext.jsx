// // src/context/UserContext.jsx
// import { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from localStorage on app start
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     } else {
//       guestLogin();
//     }
//   }, []);

//   const guestLogin = () => {
//     const guestUser = { guest: true, id: null };
//     setUser(guestUser);
//     localStorage.setItem("user", JSON.stringify(guestUser));
//   };

//   const loginUser = (data) => {
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//   };

//   const logoutUser = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <UserContext.Provider value={{ user, guestLogin, loginUser, logoutUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };










// // src/component/UserContext.jsx
// import { createContext, useState, useEffect, useCallback } from "react";
// import Cookies from "js-cookie";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Guest login
//   const guestLogin = useCallback(() => {
//     const guestUser = { guest: true, id: null };
//     setUser(guestUser);
//     Cookies.set("user", JSON.stringify(guestUser), { expires: 1 });
//     setLoading(false);
//   }, []);

//   // Login real user
//   const loginUser = (data) => {
//     setUser(data);
//     Cookies.set("user", JSON.stringify(data), { expires: 7 });
//     setLoading(false);
//   };

//   const logoutUser = () => {
//     setUser(null);
//     Cookies.remove("user");
//     setLoading(false);
//   };

//   // Load user from cookies on app start
//   useEffect(() => {
//     const cookieUser = Cookies.get("user");
//     if (cookieUser) {
//       setUser(JSON.parse(cookieUser));
//       setLoading(false);
//     } else {
//       guestLogin();
//     }
//   }, [guestLogin]);

//   return (
//     <UserContext.Provider value={{ user, guestLogin, loginUser, logoutUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };









// src/component/UserContext.jsx
// import React, { createContext, useState, useEffect, useCallback } from "react";
// import Cookies from "js-cookie";
// import axios from "axios";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Guest login (for unauthenticated users)
//   const guestLogin = useCallback(() => {
//     const guestUser = { guest: true, id: null, name: "Guest User", role: "guest" };
//     setUser(guestUser);
//     Cookies.set("user", JSON.stringify(guestUser), { expires: 1 });
//     setLoading(false);
//   }, []);

//   // ✅ Real user login
//   const loginUser = useCallback((data) => {
//     const loggedUser = { ...data, guest: false };
//     setUser(loggedUser);
//     Cookies.set("user", JSON.stringify(loggedUser), { expires: 7 });
//     setLoading(false);
//   }, []);

//   // ✅ Logout
//   const logoutUser = useCallback(async () => {
//     try {
//       await axios.post(
//         "https://beauty.joyory.com/api/user/logout",
//         {},
//         { withCredentials: true }
//       );
//     } catch (err) {
//       console.warn("Logout request failed:", err.message);
//     }
//     Cookies.remove("user");
//     setUser(null);
//     setLoading(false);
//     guestLogin(); // fallback to guest immediately
//   }, [guestLogin]);

//   // ✅ Load user from cookies or fetch from API
//   useEffect(() => {
//     const initUser = async () => {
//       try {
//         const cookieUser = Cookies.get("user");

//         if (cookieUser) {
//           try {
//             const parsedUser = JSON.parse(cookieUser);
//             setUser(parsedUser);
//             setLoading(false);
//             return;
//           } catch {
//             Cookies.remove("user");
//           }
//         }

//         // ✅ Try backend verification if logged-in cookie exists (server-side)
//         const res = await axios.get(
//           "https://beauty.joyory.com/api/user/profile",
//           { withCredentials: true }
//         );
//         if (res.data?.user) {
//           loginUser(res.data.user);
//         } else {
//           guestLogin();
//         }
//       } catch (err) {
//         console.warn("User init failed:", err.message);
//         guestLogin();
//       }
//     };

//     initUser();
//   }, [guestLogin, loginUser]);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         setUser,
//         guestLogin,
//         loginUser,
//         logoutUser,
//         loading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };









// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance.js";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({ guest: true });

//   useEffect(() => {
//     axiosInstance
//       .get("/api/user/me", { withCredentials: true })
//       .then((res) => setUser(res.data.user || { guest: true }))
//       .catch(() => setUser({ guest: true }));
//   }, []);

//   const loginUser = (userData) => {
//     setUser(userData);
//   };

//   const logoutUser = () => {
//     setUser({ guest: true });
//   };

//   const guestLogin = () => {
//     setUser({ guest: true });
//   };

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser, guestLogin }}>
//       {children}
//     </UserContext.Provider>
//   );
// };












// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance.js";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Always check current user using cookies
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/me", 
//           {withCredentials: true}
//         );
//         if (res.data && res.data.user) {
//           setUser(res.data.user);
//         } else {
//           setUser({ guest: true });
//         }
//       } catch (err) {
//         console.error("❌ /api/user/me failed:", err);
//         setUser({ guest: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   const loginUser = (userData) => {
//     setUser(userData);
//   };

//   const logoutUser = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });
//     } catch {}
//     setUser({ guest: true });
//   };

//   const guestLogin = () => {
//     setUser({ guest: true });
//   };

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser, guestLogin, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };













// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance.js";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Always check current user using HTTP-only cookies
//   useEffect(() => {
//     if (user) return; // Skip if already logged in (prevents duplicate calls)

//     const fetchUser = async () => {
//       try {
//         const res = await axiosInstance.get("/api/user/me");
//         if (res.data?.user) {
//           setUser(res.data.user);
//         } else {
//           setUser({ guest: true });
//         }
//       } catch (err) {
//         console.error("❌ /api/user/me failed:", err.response?.data || err.message);
//         setUser({ guest: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [user]);

//   const loginUser = (userData) => {
//     setUser(userData);
//   };

//   const logoutUser = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout");
//     } catch (err) {
//       console.error("Logout failed:", err.response?.data || err.message);
//     }
//     setUser({ guest: true });
//   };

//   const guestLogin = () => {
//     setUser({ guest: true });
//   };

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser, guestLogin, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };






















//=============================================================Finall-Code(One)Start===================================================






// import React, { createContext, useState, useEffect } from "react";
// import axiosInstance from "../utils/axiosInstance.js";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ On mount: detect user from cookie presence (without /api/user/me)
//   useEffect(() => {
//     const checkUserFromCookie = () => {
//       try {
//         // If backend sets an HTTP-only cookie (e.g. "token" or "session"),
//         // we cannot read it directly — we only trust that cookie is valid.
//         // So we treat user as "authenticated" once they login via backend.
//         const hasSession =
//           document.cookie.split("; ").some((c) => c.startsWith("token=")) ||
//           document.cookie.split("; ").some((c) => c.startsWith("session="));

//         if (hasSession) {
//           // ✅ Assume logged-in user session exists
//           setUser({ authenticated: true });
//         } else {
//           setUser({ guest: true });
//         }
//       } catch (err) {
//         console.error("Cookie check failed:", err);
//         setUser({ guest: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkUserFromCookie();
//   }, []);

//   // ✅ On successful login (set user from API response)
//   const loginUser = (userData) => {
//     if (userData) {
//       // backend sets HTTP-only cookie automatically
//       setUser(userData);
//     } else {
//       setUser({ guest: true });
//     }
//   };

//   // ✅ Logout user via backend + clear session state
//   const logoutUser = async () => {
//     try {
//       await axiosInstance.post("/api/user/logout", {}, { withCredentials: true });

//       // Remove cookies client-side (only if non-HTTP-only cookies exist)
//       document.cookie
//         .split(";")
//         .forEach(
//           (c) =>
//             (document.cookie = c
//               .replace(/^ +/, "")
//               .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"))
//         );
//     } catch (err) {
//       console.error("Logout failed:", err.response?.data || err.message);
//     }
//     setUser({ guest: true });
//   };

//   // ✅ Guest login fallback (temporary, non-persistent)
//   const guestLogin = () => {
//     setUser({ guest: true });
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         loginUser,
//         logoutUser,
//         guestLogin,
//         loading,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };



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









// UserContext.js

// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ CHECK AUTH USING API (WORKS ON iOS)
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await fetch(
//           "https://beauty.joyory.com/api/user/profile",
//           {
//             method: "GET",
//             credentials: "include",
//           }
//         );

//         if (res.ok) {
//           const data = await res.json();
//           setUser({ authenticated: true, profile: data.profile });
//         } else {
//           setUser({ guest: true });
//         }
//       } catch (error) {
//         setUser({ guest: true });
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAuth();
//   }, []);

//   const loginUser = (data) => {
//     setUser({ authenticated: true, profile: data });
//   };

//   // ✅ LOGOUT — LET SERVER CLEAR COOKIE (HTTP-ONLY)
//   const logoutUser = async () => {
//     try {
//       await fetch("https://beauty.joyory.com/api/user/logout", {
//         method: "POST",
//         credentials: "include",
//       });
//     } catch {}

//     setUser({ guest: true });
//   };

//   return (
//     <UserContext.Provider value={{ user, loginUser, logoutUser, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };








