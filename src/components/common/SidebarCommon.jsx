import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/SidebarCommon.css";
import user from "../../assets/user.svg";
import Order from "../../assets/Order.svg";
import favourite from "../../assets/favourite.svg";
import Refresh from "../../assets/Refresh.svg";
import wallets from "../../assets/wallets.svg";
import help from "../../assets/help.svg";
import Joyory from "../../assets/Joyory.svg";
import logout from "../../assets/logout.svg";


const Sidebarcomon = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/Useraccount")) setActiveSection("profile");
    else if (path.includes("/Myorders")) setActiveSection("orders");
    else if (path.includes("/wishlist")) setActiveSection("wishlist");
    else if (path.includes("/ingredient-compatibility")) setActiveSection("compatibility");
    else if (path.includes("/routines")) setActiveSection("routines");
    else if (path.includes("/referral")) setActiveSection("refer");
    else if (path.includes("/wallet")) setActiveSection("wallet");
    else if (path.includes("/help")) setActiveSection("help");
    else if (path.includes("/Coming-Soon")) setActiveSection("sell");
  }, [location.pathname]);

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
            <div className="ua-sidebar-icon-wrapper">
              <img src={user} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Profile
          </li>



          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => handleNavigate("orders", "/Myorders")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={Order} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Orders
          </li>


          <li
            className={activeSection === "wishlist" ? "active" : ""}
            onClick={() => handleNavigate("wishlist", "/wishlist")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={favourite} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Wishlist
          </li>

          <li
            className={activeSection === "compatibility" ? "active" : ""}
            onClick={() => handleNavigate("compatibility", "/ingredient-compatibility")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="img-fluid">
                <g transform="translate(0.575, 1.39)">
                  <path d="M9 3H15M10 3V10.22C10 10.98 9.68 11.71 9.11 12.23L5.78 15.3C4.65 16.34 5.39 18.22 6.92 18.22H17.07C18.61 18.22 19.34 16.34 18.21 15.3L14.88 12.23C14.31 11.71 14 10.98 14 10.22V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.5 15H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </svg>
            </div>
            Ingredient Compatibility
          </li>

          <li
            className={activeSection === "routines" ? "active" : ""}
            onClick={() => handleNavigate("routines", "/routines")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="img-fluid"
              >
                <g transform="translate(0, 0.5)">
                  {/* Bottle */}
                  <path
                    d="M10 3H14M11 3V6L8.5 8.5C8.18 8.82 8 9.25 8 9.71V18C8 19.1 8.9 20 10 20H14C15.1 20 16 19.1 16 18V9.71C16 9.25 15.82 8.82 15.5 8.5L13 6V3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Checklist */}
                  <path
                    d="M18 10L19 11L21 9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 15L19 16L21 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </div>
            Routine Builder
          </li>

          <li
            className={activeSection === "refer" ? "active" : ""}
            onClick={() => handleNavigate("refer", "/referral")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={Refresh} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Refer & Earn
          </li>

          <li
            className={activeSection === "wallet" ? "active" : ""}
            onClick={() => handleNavigate("wallet", "/wallet")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={wallets} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Joyory Wallet
          </li>

          <li
            className={activeSection === "help" ? "active" : ""}
            onClick={() => handleNavigate("help", "/help")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={help} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Help & FAQs
          </li>

          <li
            className={activeSection === "sell" ? "active" : ""}
            onClick={() => handleNavigate("sell", "/Coming-Soon")}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={Joyory} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Sell on Joyory
          </li>

          <li
            className={activeSection === "logout" ? "active" : ""}
            onClick={handleLogout}
          >
            <div className="ua-sidebar-icon-wrapper">
              <img src={logout} alt="Image-Not-Found" className="img-fluid" />
            </div>
            Logout
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebarcomon;











