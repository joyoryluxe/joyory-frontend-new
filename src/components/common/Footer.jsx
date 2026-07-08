import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Footer.css";
import logo from "../../assets/logo.png";
import mastercard from "../../assets/footer.png";
import axiosInstance from "../../utils/axiosInstance.js";
import instagram from "../../assets/instagram.svg";
import facebook from "../../assets/facebook.svg";
import linkedin from "../../assets/linkedin.svg";


const Footer = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [openSections, setOpenSections] = useState({
    joyory: false,
    categories: false,
    service: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAiToolClick = (toolId) => {
    navigate(`/ai-beauty-lab#${toolId}`);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("scroll-to-ai-tool", { detail: toolId }));
    }, 100);
  };

  // Fetch dynamic categories and brands for the footer
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

    const fetchFooterBrands = async () => {
      try {
        const res = await axiosInstance.get("/api/user/brands");
        setBrands(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Footer Brands fetch error:", err);
      }
    };

    fetchFooterCategories();
    fetchFooterBrands();
  }, []);

  const fallbackCategories = [
 
    {
      _id: 'fb2',
      name: 'Skin',
      slug: 'skin',
      flatList: [
        { name: 'Serums & Essence', path: '/category/skin/serums-essence' },
        { name: 'Face Moisturizer', path: '/category/skin/skin-moisturizer' },
        { name: 'Face Wash', path: '/category/skin/face-wash' },
        { name: 'Face Sunscreen', path: '/category/skin/face-sunscreen' },
        { name: 'Toners', path: '/category/skin/toners' },
        { name: 'Masks & Peels', path: '/category/skin/masks-peels' },
        { name: 'Skin Cleanser', path: '/category/skin/skin-cleanser' },
        { name: 'Sheet Masks', path: '/category/skin/sheet-masks' },
        { name: 'Night Cream', path: '/category/skin/night-cream' },
        { name: 'Lip Masks', path: '/category/skin/lip-masks' }
      ]
    },
 
    {
      _id: 'fb4',
      name: 'Makeup',
      slug: 'makeup',
      flatList: [
        { name: 'Foundation', path: '/category/makeup/face/foundation' },
        { name: 'Lipstick', path: '/category/makeup/lips/lipstick' },
        { name: 'Liquid Lipstick', path: '/category/makeup/lips/liquid-lipstick' },
        { name: 'Lip Balm', path: '/category/makeup/lips/lip-balm' },
        { name: 'Lip Stain', path: '/category/makeup/lips/lip-stain' },
        { name: 'Concealer', path: '/category/makeup/face/concealer' },
        { name: 'Blush', path: '/category/makeup/face/blush' },
        { name: 'Lip Gloss', path: '/category/makeup/lips/lip-gloss' },
        { name: 'Mascara', path: '/category/makeup/eyes/mascara' },
        { name: 'Loose Powder', path: '/category/makeup/face/loose-powder' }
      ]
    },
   
  ];

  const getSubcategoriesList = (cat) => {
    if (cat.flatList) return cat.flatList;
    const result = [];
    const traverse = (item, currentPath) => {
      if (item.subCategories && item.subCategories.length > 0) {
        item.subCategories.forEach(sub => {
          const subPath = `${currentPath}/${sub.slug}`;
          result.push({
            _id: sub._id,
            name: sub.name,
            path: `/category/${subPath}`
          });
          traverse(sub, subPath);
        });
      }
    };

    if (cat.subCategories && cat.subCategories.length > 0) {
      cat.subCategories.forEach(sub => {
        const subPath = `${cat.slug}/${sub.slug}`;
        result.push({
          _id: sub._id,
          name: sub.name,
          path: `/category/${subPath}`
        });
        traverse(sub, subPath);
      });
    }
    return result;
  };

  return (
    <footer className="footer page-title-main-name bg-white">
      <div className="footer-top-contanet footer-width-responsive">
        Discover authentic beauty products, trusted brands, and personalized experiences — all at JOYORY.
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
        <div className={`footer-col ${openSections.joyory ? "open" : ""}`}>
          <h4 className="footer-title" onClick={() => toggleSection("joyory")}>
            Joyory
            <span className="footer-toggle-icon">
              {openSections.joyory ? "−" : "+"}
            </span>
          </h4>
          <ul>
            <li><Link className="page-title-main-name border-none" to="/Offerlanding">Offers</Link></li>
            <li><Link className="page-title-main-name border-none" to="/Foryoulanding">For you</Link></li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#smart-beauty-quiz"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("smart-beauty-quiz"); }}
              >
                Smart Beauty Quiz
              </Link>
            </li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#ai-virtual-try-on"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("ai-virtual-try-on"); }}
              >
                AI Virtual Try-On
              </Link>
            </li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#skincare-routine-builder"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("skincare-routine-builder"); }}
              >
                Skincare Routine Builder
              </Link>
            </li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#foundation-shade-finder"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("foundation-shade-finder"); }}
              >
                Foundation Shade Finder
              </Link>
            </li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#ingredient-compatibility"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("ingredient-compatibility"); }}
              >
                Ingredient Compatibility
              </Link>
            </li>
            <li>
              <Link
                className="page-title-main-name border-none"
                to="/ai-beauty-lab#ai-beauty-concierge"
                onClick={(e) => { e.preventDefault(); handleAiToolClick("ai-beauty-concierge"); }}
              >
                AI Beauty Concierge
              </Link>
            </li>
            <li><Link className="page-title-main-name border-none" to="/terms">Terms & Condition</Link></li>
          </ul>
        </div>
        <div className={`footer-col ${openSections.categories ? "open" : ""}`}>
          <h4 className="footer-title" onClick={() => toggleSection("categories")}>
            CATEGORIES
            <span className="footer-toggle-icon">
              {openSections.categories ? "−" : "+"}
            </span>
          </h4>
          <ul>
            <li><Link className="page-title-main-name border-none" to="/category/makeup">Makeup</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/makeup/face">Face</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/makeup/eyes">Eyes</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/skin">Skin</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/skin/skin-moisturizer">Moisturizer</Link></li>
          </ul>
        </div>

        {/* Customer Service Column */}
        <div className={`footer-col ${openSections.service ? "open" : ""}`}>
          <h4 className="footer-title" onClick={() => toggleSection("service")}>
            CUSTOMER SERVICE
            <span className="footer-toggle-icon">
              {openSections.service ? "−" : "+"}
            </span>
          </h4>
          <ul>
            <li><Link className="page-title-main-name border-none" to="/Myorders">Track Your Order</Link></li>
            <li><Link className="page-title-main-name border-none" to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link className="page-title-main-name border-none" to="/help">Help Center</Link></li>
          </ul>
        </div>


      </div>

      {/* Brands Section */}
      <div className="footer-brands-section">
        <div className="container d-flex flex-md-row flex-column  align-items-start gap-md-4 gap-3">
          <div className="footer-brands-title">Popular Brands</div>
          <div className="footer-brands-list">
            {(brands.length > 0 ? brands.slice(0, 15) : [
              { _id: '1', name: 'Maybelline', slug: 'maybelline' },
              { _id: '2', name: 'Swiss Beauty', slug: 'swiss-beauty' },
              { _id: '3', name: 'Aqualogica', slug: 'aqualogica' },
              { _id: '4', name: 'Dot And Key', slug: 'dot-and-key' },
              { _id: '5', name: 'Lakme', slug: 'lakme' },
              { _id: '6', name: 'Dr Sheth', slug: 'dr-sheth' },
              { _id: '7', name: 'Pilgrim', slug: 'pilgrim' },
              { _id: '8', name: 'Wish Care', slug: 'wish-care' },
              { _id: '9', name: 'Plum', slug: 'plum' },
              { _id: '10', name: 'Minimalist', slug: 'minimalist' }
            ]).map((brand, index, arr) => (
              <React.Fragment key={brand._id || index}>
                <Link to={`/brand/${brand.slug || brand._id}`} className="footer-brand-link">
                  {brand.name}
                </Link>
                {index < arr.length - 1 && <span className="footer-brands-separator">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Top Categories Section */}
      <div className="footer-categories-section">
        <div className="container">
          <div className="footer-categories-header">Top Categories</div>
          {(categories.length > 0 ? categories : fallbackCategories).map((cat) => {
            const subList = getSubcategoriesList(cat);
            if (subList.length === 0) return null;
            return (
              <div key={cat._id} className="footer-category-row">
                <Link to={`/category/${cat.slug}`} className="footer-category-name">
                  {cat.name}
                </Link>
                <div className="footer-subcategory-links">
                  {subList.map((sub, idx) => (
                    <React.Fragment key={sub._id || idx}>
                      <Link to={sub.path} className="footer-subcategory-link">
                        {sub.name}
                      </Link>
                      {idx < subList.length - 1 && <span className="footer-brands-separator">|</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
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

            <Link className="text-white text-decoration-none" to="/terms">Terms & Conditions</Link>
            <Link className="text-white text-decoration-none" to="/privacy-policy">Privacy Policy</Link>
            <Link className="text-white text-decoration-none" to="/">Return Policy</Link>

          </div>
        </div>



      </div>





    </footer>
  );
};

export default Footer;