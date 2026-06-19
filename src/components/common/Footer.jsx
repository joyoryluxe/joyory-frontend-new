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
  const [brands, setBrands] = useState([]);

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
    // {
    //   _id: 'fb1',
    //   name: 'Bath & Body',
    //   slug: 'bath-body',
    //   flatList: [
    //     { name: 'Body Wash & Shower Gel', path: '/category/bath-body/body-wash-shower-gel' },
    //     { name: 'Body Lotions & Moisturizers', path: '/category/bath-body/body-lotions-moisturizers' },
    //     { name: 'Body Scrubs & Exfoliants', path: '/category/bath-body/body-scrubs-exfoliants' },
    //     { name: 'Epilators', path: '/category/bath-body/epilators' },
    //     { name: 'Bath Kits & Sets', path: '/category/bath-body/bath-kits-sets' },
    //     { name: 'Hand Creams & Masks', path: '/category/bath-body/hand-creams-masks' },
    //     { name: 'Soaps', path: '/category/bath-body/soaps' },
    //     { name: 'Massage Oil', path: '/category/bath-body/massage-oil' },
    //     { name: 'Body Butters', path: '/category/bath-body/body-butters' },
    //     { name: 'Talc', path: '/category/bath-body/talc' }
    //   ]
    // },
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
    // {
    //   _id: 'fb3',
    //   name: 'Hair',
    //   slug: 'hair',
    //   flatList: [
    //     { name: 'Shampoo', path: '/category/hair/shampoo' },
    //     { name: 'Hair Serum', path: '/category/hair/hair-serum' },
    //     { name: 'Hair Mask', path: '/category/hair/hair-mask' },
    //     { name: 'Hair Oil', path: '/category/hair/hair-oil' },
    //     { name: 'Conditioner', path: '/category/hair/conditioner' },
    //     { name: 'Hair Straighteners', path: '/category/hair/hair-straighteners' },
    //     { name: 'Trimmers', path: '/category/hair/trimmers' },
    //     { name: 'Hair Spray', path: '/category/hair/hair-spray' },
    //     { name: 'Rollers & Curlers', path: '/category/hair/rollers-curlers' }
    //   ]
    // },
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
    // {
    //   _id: 'fb5',
    //   name: 'Fragrance',
    //   slug: 'fragrance',
    //   flatList: [
    //     { name: 'Fragrance', path: '/category/fragrance' },
    //     { name: 'Mens Perfumes (EDT & EDP)', path: '/category/fragrance/mens-perfumes' },
    //     { name: 'Perfume', path: '/category/fragrance/perfume' },
    //     { name: 'Unisex Perfumes (EDT & EDP)', path: '/category/fragrance/unisex-perfumes' },
    //     { name: 'Womens Deodorants & Roll-Ons', path: '/category/fragrance/womens-deodorants' },
    //     { name: 'Rollers & Curlers', path: '/category/fragrance/rollers-curlers' },
    //     { name: 'Mens Deodorants & Roll-Ons', path: '/category/fragrance/mens-deodorants' },
    //     { name: 'Body Mists & Sprays', path: '/category/fragrance/body-mists' },
    //     { name: 'Unisex Body Mist & Sprays', path: '/category/fragrance/unisex-body-mists' },
    //     { name: 'Unisex Deodorants & Roll-Ons', path: '/category/fragrance/unisex-deodorants' }
    //   ]
    // }
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
        <div className="footer-col">
          <h4 className="footer-title">Joyory</h4>
          <ul>
            {/* <li><Link className="page-title-main-name border-none" to="/aboutus">Who we are</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/help">FAQs</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="#">Brands</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/Offerlanding">Offers</Link></li>
            <li><Link className="page-title-main-name border-none" to="/Foryoulanding">For you</Link></li>
            <li><Link className="page-title-main-name border-none" to="/ShadeFinder">Shade finder</Link></li>
            <li><Link className="page-title-main-name border-none" to="/virtualtryon">Virtual Try-on</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/blogs">Blogs</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/terms">Terms & Condition</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/collab">Influencer Collab</Link></li> */}
          </ul>
        </div>
        <div className="footer-col">
          <h4 className="footer-title">CATEGORIES</h4>
          <ul>
            {/* {categories.length > 0 ? (
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
              <> */}
            {/* Fallback items while loading or if API fails */}
            {/* <li>Eyes</li>
                <li>Lips</li>
                <li>Face</li>
                <li>Fragrance</li> */}
            {/* </>
            )} */}

            <li><Link className="page-title-main-name border-none" to="/category/makeup">Makeup</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/makeup/face">Face</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/makeup/eyes">Eyes</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/skin">Skin</Link></li>
            <li><Link className="page-title-main-name border-none" to="/category/skin/skin-moisturizer">Moisturizer</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/category/skin/skin-lip-care">Lip Care</Link></li> */}

          </ul>
        </div>

        {/* Customer Service Column */}
        <div className="footer-col">
          <h4 className="footer-title">CUSTOMER SERVICE</h4>
          <ul>
            {/* <li><Link className="page-title-main-name border-none" to="/contact">Contact Us</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/Myorders">Track Your Order</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/returns">Returns Policy</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/privacy-policy">Privacy Policy</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/affiliate">Joyory Affiliate Program</Link></li> */}
            <li><Link className="page-title-main-name border-none" to="/help">Help Center</Link></li>
            {/* <li><Link className="page-title-main-name border-none" to="/shipping-policy">Shipping Policy</Link></li> */}
            {/* <li><Link className="page-title-main-name border-none" to="/sell">Sell on Joyory</Link></li> */}
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