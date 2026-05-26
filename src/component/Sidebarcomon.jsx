// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Sidebarcomon.css";

// const Sidebarcomon = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState(""); 
//   const navigate = useNavigate();

//   const handleNavigate = (section, path) => {
//     setActiveSection(section); 
//     navigate(path);            
//     setMenuOpen(false);        
//   };

//   // ✅ Logout handler
//   // const handleLogout = async () => {
//   //   try {
//   //     const res = await fetch("https://beauty.joyory.com/api/user/logout", {
//   //       method: "POST",
//   //       credentials: "include", // ✅ send HTTP-only cookies
//   //     });

//   //     if (!res.ok) {
//   //       const errorText = await res.text();
//   //       throw new Error(`Logout failed: ${res.status} ${errorText}`);
//   //     }

//   //     setActiveSection("logout");
//   //     setMenuOpen(false);
//   //     navigate("/login"); // redirect to login page after logout
//   //   } catch (err) {
//   //     console.error("Logout error:", err);
//   //     alert("Failed to logout. Please try again.");
//   //   }
//   // };



//   const handleLogout = async () => {
//   try {
//     // 🔹 1. Backend logout request — clears HTTP-only cookie session
//     const res = await fetch("https://beauty.joyory.com/api/user/logout", {
//       method: "POST",
//       credentials: "include",
//     });

//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`Logout failed: ${res.status} ${errorText}`);
//     }

//     // 🔹 2. Clear all local/session data
//     localStorage.clear();
//     sessionStorage.clear();

//     // 🔹 3. Clear extension (Chrome) storage if available
//     if (window.chrome?.storage) {
//       try {
//         window.chrome.storage.local.clear();
//         window.chrome.storage.sync.clear();
//       } catch (extErr) {
//         console.warn("⚠️ Unable to clear Chrome extension storage:", extErr);
//       }
//     }

//     // 🔹 4. Clear all JS-accessible cookies
//     document.cookie.split(";").forEach((cookie) => {
//       const eqPos = cookie.indexOf("=");
//       const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//       document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//     });

//     // 🔹 5. Clear browser cache storage (PWA/fetch cache)
//     if ("caches" in window) {
//       try {
//         const cacheNames = await caches.keys();
//         await Promise.all(cacheNames.map((name) => caches.delete(name)));
//         console.log("✅ Cache storage cleared");
//       } catch (cacheErr) {
//         console.warn("⚠️ Unable to clear cache storage:", cacheErr);
//       }
//     }

//     // 🔹 6. Reset component state/UI
//     setActiveSection("logout");
//     setMenuOpen(false);

//     // 🔹 7. Navigate to login screen
//     navigate("/login");

//     // 🔹 8. Optional: Reload to reset all contexts
//     setTimeout(() => {
//       window.location.reload();
//     }, 300);

//   } catch (err) {
//     console.error("Logout error:", err);
//     alert("Failed to logout. Please try again.");
//   }
// };


//   return (
//     <>
//       {/* Toggle button for mobile */}
//       <button
//         className="ua-sidebar-toggle"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         ☰
//       </button>

//       {/* Sidebar */}
//       <aside className={`ua-sidebar ${menuOpen ? "open" : ""}`}>
//         <ul>
//           <li
//             className={activeSection === "orders" ? "active" : ""}
//             onClick={() => handleNavigate("orders", "/Myorders")}
//           >
//             <span className="ua-icon">🧾</span> Orders
//           </li>

//           <li
//             className={activeSection === "profile" ? "active" : ""}
//             onClick={() => handleNavigate("profile", "/Useraccount")}
//           >
//             <span className="ua-icon">👤</span> Profile
//           </li>

//           <li
//             className={activeSection === "wishlist" ? "active" : ""}
//             onClick={() => handleNavigate("wishlist", "/wishlist")}
//           >
//             <span className="ua-icon">♥️</span> Wishlist
//           </li>

//           <li
//             className={activeSection === "refer" ? "active" : ""}
//             onClick={() => handleNavigate("refer", "/referral")}
//           >
//             <span className="ua-icon">🎁</span> Refer & Earn
//           </li>

//           <li
//             className={activeSection === "wallet" ? "active" : ""}
//             onClick={() => handleNavigate("wallet", "/wallet")}
//           >
//             <span className="ua-icon">👛</span> Joyory Wallet
//           </li>

//           <li
//             className={activeSection === "help" ? "active" : ""}
//             onClick={() => handleNavigate("help", "/help")}
//           >
//             <span className="ua-icon">❓</span> Help & FAQs
//           </li>

//           <li
//             className={activeSection === "sell" ? "active" : ""}
//             onClick={() => handleNavigate("sell", "/sell")}
//           >
//             <span className="ua-icon">🏬</span> Sell on Joyory
//           </li>

//           <li
//             className={activeSection === "logout" ? "active" : ""}
//             onClick={handleLogout} // ✅ call API here
//           >
//             <span className="ua-icon">⎋</span> Logout
//           </li>
//         </ul>
//       </aside>
//     </>
//   );
// };

// export default Sidebarcomon;



























import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Sidebarcomon.css";
import user from "../assets/user.svg";
import Order from "../assets/Order.svg";
import favourite from "../assets/favourite.svg";
import Refresh from "../assets/Refresh.svg";
import wallets from "../assets/wallets.svg";
import help from "../assets/help.svg";
import Joyory from "../assets/Joyory.svg";
import logout from "../assets/logout.svg";


const Sidebarcomon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();

  const handleNavigate = (section, path) => {
    setActiveSection(section);
    navigate(path);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      // 1️⃣ Backend logout (clear HTTP-only cookie session)
      const res = await fetch(
        "https://beauty.joyory.com/api/user/logout",
        { method: "POST", credentials: "include" }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Logout failed: ${res.status} ${errorText}`);
      }

      // 2️⃣ Clear all localStorage and sessionStorage
      localStorage.clear();
      sessionStorage.clear();

      // 3️⃣ Clear all JS-accessible cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      // 4️⃣ Clear caches (PWA/fetch cache)
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // 5️⃣ Reset UI state
      setActiveSection("logout");
      setMenuOpen(false);

      // 6️⃣ Navigate to home page as guest
      navigate("/");

      // 7️⃣ Full reload to reset app context for guest
      setTimeout(() => window.location.reload(), 300);
    } catch (err) {
      console.error("Logout error:", err);
      alert("Failed to logout. Please try again.");
    }
  };


  return (
    <>
      {/* Toggle button for mobile */}
      <button
        className="ua-sidebar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`ua-sidebar ${menuOpen ? "open" : ""}`}>
        <ul className="page-title-main-name">

          <li
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => handleNavigate("profile", "/Useraccount")}
          >
            <img src={user} alt="Image-Not-Found" className="img-fluid" />  Profile
          </li>



          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => handleNavigate("orders", "/Myorders")}
          >
            <img src={Order} alt="Image-Not-Found" className="img-fluid" />
            Orders
          </li>


          <li
            className={activeSection === "wishlist" ? "active" : ""}
            onClick={() => handleNavigate("wishlist", "/wishlist")}
          >
            {/* <img src={user} alt="Image-Not-Found" className="img-fluid" /> */}
            <img src={favourite} alt="Image-Not-Found" className="img-fluid" />
            Wishlist
          </li>

          <li
            className={activeSection === "refer" ? "active" : ""}
            onClick={() => handleNavigate("refer", "/referral")}
          >
            {/* <img src={user} alt="Image-Not-Found" className="img-fluid" /> */}
            <img src={Refresh} alt="Image-Not-Found" className="img-fluid" />
            Refer & Earn
          </li>

          <li
            className={activeSection === "wallet" ? "active" : ""}
            onClick={() => handleNavigate("wallet", "/wallet")}
          >
            {/* <img src={user} alt="Image-Not-Found" className="img-fluid" /> */}
            <img src={wallets} alt="Image-Not-Found" className="img-fluid" />
            Joyory Wallet
          </li>

          <li
            className={activeSection === "help" ? "active" : ""}
            onClick={() => handleNavigate("help", "/help")}
          >
            {/* <img src={user} alt="Image-Not-Found" className="img-fluid" /> */}
            <img src={help} alt="Image-Not-Found" className="img-fluid" />
            Help & FAQs
          </li>

          <li
            className={activeSection === "sell" ? "active" : ""}
            onClick={() => handleNavigate("sell", "/Coming-Soon")}
          >
            {/* <img src={user} alt="Image-Not-Found" className="img-fluid" /> */}
            <img src={Joyory} alt="Image-Not-Found" className="img-fluid" />
            Sell on Joyory
          </li>

          <li
            className={activeSection === "logout" ? "active" : ""}
            onClick={handleLogout} // ✅ call API here
          >
            <img src={logout} alt="Image-Not-Found" className="img-fluid" />
            Logout
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebarcomon;



















// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Sidebarcomon.css";

// const Sidebarcomon = ({ user, setUser }) => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState("");
//   const navigate = useNavigate();

//   const handleNavigate = (section, path) => {
//     setActiveSection(section);
//     navigate(path);
//     setMenuOpen(false);
//   };

//   const handleLogout = async () => {
//     try {
//       // Backend logout (clear HTTP-only cookie session)
//       const res = await fetch(
//         "https://beauty.joyory.com/api/user/logout",
//         { method: "POST", credentials: "include" }
//       );

//       if (!res.ok) {
//         const errorText = await res.text();
//         throw new Error(`Logout failed: ${res.status} ${errorText}`);
//       }

//       // Clear all frontend storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // Clear JS-accessible cookies
//       document.cookie.split(";").forEach((cookie) => {
//         const eqPos = cookie.indexOf("=");
//         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//       });

//       // Clear caches if available
//       if ("caches" in window) {
//         const cacheNames = await caches.keys();
//         await Promise.all(cacheNames.map((name) => caches.delete(name)));
//       }

//       // ✅ Update global user state
//       setUser(null);

//       // Reset UI state
//       setActiveSection("logout");
//       setMenuOpen(false);

//       // Navigate to home page
//       navigate("/");

//       // Optional: Full reload to reset all contexts
//       setTimeout(() => window.location.reload(), 300);
//     } catch (err) {
//       console.error("Logout error:", err);
//       alert("Failed to logout. Please try again.");
//     }
//   };

//   return (
//     <>
//       {/* Toggle button for mobile */}
//       <button
//         className="ua-sidebar-toggle"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         ☰
//       </button>

//       {/* Sidebar */}
//       <aside className={`ua-sidebar ${menuOpen ? "open" : ""}`}>
//         <ul>
//           <li
//             className={activeSection === "orders" ? "active" : ""}
//             onClick={() => handleNavigate("orders", "/Myorders")}
//           >
//             <span className="ua-icon">🧾</span> Orders
//           </li>

//           <li
//             className={activeSection === "profile" ? "active" : ""}
//             onClick={() => handleNavigate("profile", "/Useraccount")}
//           >
//             <span className="ua-icon">👤</span> Profile
//           </li>

//           <li
//             className={activeSection === "wishlist" ? "active" : ""}
//             onClick={() => handleNavigate("wishlist", "/wishlist")}
//           >
//             <span className="ua-icon">♥️</span> Wishlist
//           </li>

//           <li
//             className={activeSection === "refer" ? "active" : ""}
//             onClick={() => handleNavigate("refer", "/Referral")}
//           >
//             <span className="ua-icon">🎁</span> Refer & Earn
//           </li>

//           <li
//             className={activeSection === "wallet" ? "active" : ""}
//             onClick={() => handleNavigate("wallet", "/Wallet")}
//           >
//             <span className="ua-icon">👛</span> Joyory Wallet
//           </li>

//           <li
//             className={activeSection === "help" ? "active" : ""}
//             onClick={() => handleNavigate("help", "/help")}
//           >
//             <span className="ua-icon">❓</span> Help & FAQs
//           </li>

//           <li
//             className={activeSection === "sell" ? "active" : ""}
//             onClick={() => handleNavigate("sell", "/sell")}
//           >
//             <span className="ua-icon">🏬</span> Sell on Joyory
//           </li>

//           {user && (
//             <li
//               className={activeSection === "logout" ? "active" : ""}
//               onClick={handleLogout}
//             >
//               <span className="ua-icon">⎋</span> Logout
//             </li>
//           )}
//         </ul>
//       </aside>
//     </>
//   );
// };

// export default Sidebarcomon;



