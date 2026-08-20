import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { UserContext } from "../../context/UserContext";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { moveToCart as apiMoveToCart } from "../../api/wishlistApi";
import "../../styles/BestSellers.css";
import WishlistCard from "../../components/sections/cart/WishlistCard";

const Wishlist = () => {
  const { wishlistItems, loading, removeFromWishlist: contextRemoveFromWishlist, syncWishlist } = useContext(WishlistContext);
  const { addToCart, syncCartFromBackend } = useContext(CartContext);
  const [removingItems, setRemovingItems] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const getCleanProductSlug = (item) => {
    try {
      const slugMap = JSON.parse(localStorage.getItem("productSlugMap") || "{}");
      return slugMap[item.productId] || item.slug || item.productId;
    } catch {
      return item.slug || item.productId;
    }
  };

  useEffect(() => {
    syncWishlist(wishlistItems.length > 0);
  }, []);

  const handleRemove = async (productId, sku) => {
    const itemKey = `${productId}-${sku}`;
    if (removingItems[itemKey]) return;
    setRemovingItems((prev) => ({ ...prev, [itemKey]: true }));

    try {
      await contextRemoveFromWishlist(productId, sku);
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingItems((prev) => {
        const copy = { ...prev };
        delete copy[itemKey];
        return copy;
      });
    }
  };

  const moveToCart = async (item) => {
    try {
      if (item.status === "outOfStock") {
        toast.error("Please select an in-stock variant.");
        return;
      }

      if (user && !user.guest) {
        const response = await apiMoveToCart(item.productId, { sku: item.sku });
        if (!response.data?.success) throw new Error("Failed to move to cart");
      } else {
        const product = {
          _id: item.productId,
          name: item.name,
          price: item.displayPrice,
          images: [item.image],
        };
        const variant = {
          sku: item.sku,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          image: item.image,
        };
        await addToCart(product, variant, true);
      }

      await contextRemoveFromWishlist(item.productId, item.sku, true);
      await syncCartFromBackend();
      toast.success("Moved to cart successfully!");
      navigate("/cartpage");
    } catch (err) {
      console.error(err);
      toast.error("Failed to move to cart");
    }
  };

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
          <DotLottieReact
            className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
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

      <div className="container py-4 mt-xl-0 pt-xl-5 mt-0 pt-4">
        <h2 className="mb-4 fw-bold page-title-main-name mt-lg-3">
          My Wishlist ({wishlistItems.length})
        </h2>

        {wishlistItems.length === 0 ? (
          <div className="container mt-xl-5">
            <div className="p-4 text-center mt-lg-5 cartpage-empty-Main-section">
              <h2 className="page-title-main-name cartpage-titles playfair-font-bold">Oops!</h2>
              <h5 className="mb-2 page-title-main-name empty-cart-message">Your wishlist is empty</h5>
              <button className="page-title-main-name Shop-now-Button" onClick={() => navigate("/")}>
                Add to wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {wishlistItems.map((item) => (
              <WishlistCard
                key={`${item.productId}-${item.sku}`}
                item={item}
                isRemoving={removingItems[`${item.productId}-${item.sku}`]}
                onRemove={handleRemove}
                onMoveToCart={moveToCart}
                onProductClick={(it) => navigate(`/product/${getCleanProductSlug(it)}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Wishlist;
