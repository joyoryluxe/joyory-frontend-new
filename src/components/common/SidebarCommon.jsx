import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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











