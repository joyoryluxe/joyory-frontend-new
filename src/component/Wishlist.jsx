import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { FaStar, FaHeart, FaShoppingCart, FaTimes } from "react-icons/fa";
import { UserContext } from "./UserContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bag from "../assets/Bag.svg";
import "../css/BestSellers.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(UserContext);


  const formatPrice = useCallback((price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  }, []);

  // Fetch Wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        if (user && !user.guest) {
          // Logged-in user
          const response = await fetch("https://beauty.joyory.com/api/user/wishlist", {
            method: "GET",
            credentials: "include",
          });

          if (response.status === 401) {
            const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
            setWishlistItems(localWishlist);
            toast.info("Session expired. Showing guest wishlist.");
            return;
          }

          if (!response.ok) throw new Error("Failed to fetch wishlist");

          const data = await response.json();
          setWishlistItems(data.success && Array.isArray(data.wishlist) ? data.wishlist : []);
        } else {
          // Guest user
          const localWishlist = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
          setWishlistItems(localWishlist);
        }
      } catch (err) {
        console.error("Wishlist fetch error:", err);
        toast.error("Failed to load wishlist");
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  // Remove from Wishlist
  const removeFromWishlist = async (productId, sku) => {
    const itemKey = `${productId}-${sku}`;
    if (removingItems[itemKey]) return; // debounce double click triggers
    setRemovingItems((prev) => ({ ...prev, [itemKey]: true }));

    try {
      if (user && !user.guest) {
        const response = await fetch(`https://beauty.joyory.com/api/user/wishlist/${productId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sku }),
        });
        if (!response.ok) throw new Error("Failed to remove item");
      } else {
        // Guest
        const updated = wishlistItems.filter((item) => !(item.productId === productId && item.sku === sku));
        localStorage.setItem("guestWishlist", JSON.stringify(updated));
      }

      setWishlistItems((prev) => prev.filter((item) => !(item.productId === productId && item.sku === sku)));
      toast.success("Removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    } finally {
      setRemovingItems((prev) => {
        const copy = { ...prev };
        delete copy[itemKey];
        return copy;
      });
    }
  };

  // Move to Cart
  const moveToCart = async (item) => {
    try {
      if (user && !user.guest) {
        const response = await fetch(
          `https://beauty.joyory.com/api/user/wishlist/${item.productId}/move-to-cart`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sku: item.sku }),
          }
        );

        if (!response.ok) throw new Error("Failed to move to cart");
      } else {
        // Guest - Add to local cart
        let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const cartItem = {
          productId: item.productId,
          productName: item.name,
          variant: item.variantName || item.variant,
          sku: item.sku,
          image: item.image,
          price: item.displayPrice,
          originalPrice: item.originalPrice,
          quantity: 1,
        };
        guestCart.push(cartItem);
        localStorage.setItem("guestCart", JSON.stringify(guestCart));
      }

      // Remove from wishlist after moving
      setWishlistItems((prev) => prev.filter((w) => w.productId !== item.productId));
      toast.success("Moved to cart successfully!");
      navigate("/cartpage");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to cart");
    }
  };

  // Render Stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating || 0);
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        size={16}
        color={i < fullStars ? "#ffc107" : "#e0e0e0"}
        style={{ marginRight: "2px" }}
      />
    ));
  };

  // if (loading) {
  //   return (
  //     <div style={{ height: "60vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
  //       <div className="spinner-border text-primary mb-3" role="status" />
  //       <p className="page-title-main-name">Loading your wishlist...</p>
  //     </div>
  //   );
  // }






  if (loading)
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https:lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />


          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );

  return (
    <>
      <Header />


      <div className="container py-4 mt-xl-5 pt-xl-5 mt-5 pt-5">
        <h2 className="mb-4 fw-bold page-title-main-name mt-5">
          My Wishlist ({wishlistItems.length})
        </h2>

        {wishlistItems.length === 0 ? (
          // <div className="text-center py-5 page-title-main-name">
          //   <p className="text-muted fs-5">Your wishlist is empty.</p>
          //   <button className="btn btn-primary page-title-main-name" onClick={() => navigate("/")}>
          //     Continue Shopping
          //   </button>
          // </div>

          <div className="container mt-xl-5">
            <div className="p-4 text-center mt-5 cartpage-empty-Main-section">
              <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
              <h5 className="mb-2 page-title-main-name">Your wishlist is empty</h5>
              <button className="page-title-main-name Shop-now-Button" onClick={() => navigate("/")}>
                Add to wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item) => (
              <div key={`${item.productId}-${item.sku}`} className="col-6 col-md-4 col-lg-3 px-2 mb-3">
                <div className="card h-100 shadow-sm-none border-0 position-relative">
                  {/* Cross (Remove) Button - Top Right */}
                  <button
                    className="position-absolute top-0 end-0 m-2 bg-white border-0 rounded-circle p-1 shadow-sm"
                    style={{
                      zIndex: 10,
                      width: "32px",
                      height: "32px",
                      minWidth: "32px",
                      minHeight: "32px",
                      maxWidth: "32px",
                      maxHeight: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: removingItems[`${item.productId}-${item.sku}`] ? 0.5 : 1,
                      cursor: removingItems[`${item.productId}-${item.sku}`] ? "not-allowed" : "pointer"
                    }}
                    onClick={() => removeFromWishlist(item.productId, item.sku)}
                    disabled={removingItems[`${item.productId}-${item.sku}`]}
                  >
                    {removingItems[`${item.productId}-${item.sku}`]
                      ? <div className="spinner-border spinner-border-sm" role="status" style={{ width: "12px", height: "12px" }} />
                      : <FaTimes size={16} color="#000" />
                    }
                  </button>

                  {/* Product Image */}
                  <div
                    className="position-relative"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="card-img-top"
                      style={{ height: "auto", objectFit: "cover", borderRadius: "8px 8px 0 0" }}
                      onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                  </div>

                  <div className="card-body d-flex flex-column p-3">
                    {/* Product Name */}
                    <h6
                      className="foryou-name font-family-Poppins m-0 p-0 mt-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {(() => {
                        const variantText = (item.variantName || item.variant || "").trim().toUpperCase();
                        return variantText && variantText !== "DEFAULT" ? `${item.name} - ${variantText}` : item.name;
                      })()}
                    </h6>

                    {/* Price Section */}
                    <div className="price-section mb-3">
                      <div className="d-flex align-items-baseline flex-wrap">
                        <span className="current-price fw-400 fs-5">
                          {formatPrice(item.displayPrice)}
                        </span>

                        {item.originalPrice > item.displayPrice && (
                          <>
                            <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                              {formatPrice(item.originalPrice)}
                            </span>
                            <span className="discount-percent text-danger fw-bold ms-2">
                              ({(() => {
                                const discPercent = item.discountPercent || (
                                  item.originalPrice && item.displayPrice && item.originalPrice > item.displayPrice
                                    ? Math.round(((item.originalPrice - item.displayPrice) / item.originalPrice) * 100)
                                    : 0
                                );
                                return discPercent;
                              })()}% OFF)
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-md-auto mt-0">
                      <button
                        className="btn w-100 addtocartbuttton d-flex align-items-center justify-content-center gap-2 btn-outline-dark"
                        style={{
                          transition: "background-color .3s ease, color .3s ease",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.status === "outOfStock") {
                            toast.error("Please select an in-stock variant.");
                          } else {
                            moveToCart(item);
                          }
                        }}
                      >
                        {item.status === "outOfStock" ? "Out of Stock" : "Move to Cart"}
                        <img src={Bag} alt="Bag" style={{ height: 20 }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;