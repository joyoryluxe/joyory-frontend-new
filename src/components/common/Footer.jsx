import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";
import logo from "../../assets/logo.png";
import mastercard from "../../assets/footer.png";
import axiosInstance from "../../utils/axiosInstance.js";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import linkedin from "../../assets/linkedin.svg";


const Footer = () => {
  const [categories, setCategories] = useState([]);

  // Fetch dynamic categories for the footer
  useEffect(() => {
    const fetchFooterCategories = async () => {
      try {
        const res = await axiosInstance.get("/api/user/categories/tree");
        // Access categories from data (handling both array and object responses)
        const catData = Array.isArray(res.data) ? res.data : res.data.categories || [];
        // Slice to show top 5-6 categories to keep footer layout clean
        setCategories(catData.slice(0, 6));
      } catch (err) {
        console.error("Footer Category fetch error:", err);
      }
    };
    fetchFooterCategories();
  }, []);

  return (
    <footer className="footer page-title-main-name bg-white">
        <div className="footer-top-contanet footer-width-responsive">
          Be the first to hear about all things JOYORY
          Stay connected for exclusive offers and latest updates, delivered straight to your inbox
        </div>
      {/* Top Section */}
      <div className="footer-top margin-responsive-footerss container">





        {/* Logo & Quote */}
        <div className="footer-col logo-col">
          <Link to="/">
            <img src={logo} alt="Joyory" className="footer-logo" />
          </Link>
          <p className="footer-quote">
            For every day, for every mood, for every you
          </p>
        </div>

        {/* Dynamic Categories Column */}
        {/* About Us Column */}
        <div className="footer-col">
          <h4 className="footer-title">Joyory</h4>
          <ul>
            {/* <li><Link className="page-title-main-name border-none" to="/aboutus">Who we are</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/help">FAQs</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="#">Brands</Link></li>
            <li><Link className="page-title-main-name border-none" to="#">Offers</Link></li>
            <li><Link className="page-title-main-name border-none" to="#">Foryou</Link></li>
            <li><Link className="page-title-main-name border-none" to="/FoundationShadeFinder">Shade_finder</Link></li>
            <li><Link className="page-title-main-name border-none" to="/virtualtryon">Virtual Try-on</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/blogs">Blogs</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/terms">Terms & Condition</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/collab">Influencer Collab</Link></li> */}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">CATEGORIES</h4>
          <ul>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="footer-link page-title-main-name border-none"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                {/* Fallback items while loading or if API fails */}
                {/* <li>Eyes</li>
                <li>Lips</li>
                <li>Face</li>
                <li>Fragrance</li> */}
              </>
            )}
          </ul>
        </div>

        {/* Customer Service Column */}
        <div className="footer-col">
          <h4 className="footer-title">CUSTOMER SERVICE</h4>
          <ul>
            {/* <li><Link className="page-title-main-name border-none" to="/contact">Contact Us</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/Myorders">Track Your Order</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/returns">Returns Policy</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/privacy-policy">Privacy Policy</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/affiliate">Joyory Affiliate Program</Link></li>
            <li><Link className="page-title-main-name border-none" to="/help">Help Center</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/shipping-policy">Shipping Policy</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/sell">Sell on Joyory</Link></li> */}
          </ul>
        </div>


      </div>

      {/* Bottom Section */}


      <div className="second-footer-bg">

        <div className="footer-bottom">
          <p>© 2025. All Rights Are Reserved by Joyory</p>
          <div className="payment-icons">
            <img src={mastercard} alt="Payment Methods" className="img-fluid" />
          </div>








        </div>




        <div className="border-intops mt-4"></div>


        <div className="main-second-footer">
          <div className="social-media">

            <Link to="https://www.instagram.com/joyory_luxe/"><img src={instagram} alt="Image Not Found" /></Link>
            <Link to="https://www.facebook.com/61578381750346/?locale=en_GB"><img src={facebook} alt="Image Not Found" /></Link>
            <Link to="https://www.linkedin.com/company/joyory-luxe-pvt-ltd"><img src={linkedin} alt="Image Not Found" /></Link>

          </div>


          <div className="social-media margin-bootom-footer-responsive">

            <Link className="text-white text-decoration-none" to="/">Privacy Policy</Link>
            <Link className="text-white text-decoration-none" to="/">Return Policy</Link>

          </div>
        </div>



      </div>





    </footer>
  );
};

export default Footer;