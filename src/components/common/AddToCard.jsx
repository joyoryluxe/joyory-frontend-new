import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { CartContext } from "../../Context/CartContext";
import bagIcon from "../../assets/bag.svg";

const Addtocard = ({ prod, selectedShade, showToastMsg, user }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  if (!prod) return null;

  const handleAddToCart = async () => {
    try {
      console.log("🛒 Starting add to cart for:", prod.name);
      console.log("👤 User prop:", user);
      console.log("🍪 Token exists:", document.cookie.includes("token="));

      // 🟢 FIX: Better guest detection
      let isGuest = true;
      try {
        // Check if user is actually logged in by making a simple API call
        await axiosInstance.get("/api/user/profile");
        isGuest = false;
        console.log("👤 Logged-in user detected via API");
      } catch (error) {
        // If API call fails, user is guest
        isGuest = true;
        console.log("👤 Guest user detected (API call failed)");
      }

      // Also check user prop as fallback
      if (user && !user.guest) {
        isGuest = false;
        console.log("👤 Logged-in user detected via prop");
      }

      console.log("🎯 Final user type:", isGuest ? "Guest" : "Logged-in");

      const hasVariants = Array.isArray(prod.variants) && prod.variants.length > 0;
      let variantToAdd = null;

      console.log("📦 Product variants:", prod.variants);
      console.log("🎨 Selected shade:", selectedShade);

      // ✅ Handle product variants
      if (hasVariants) {
        const availableVariants = prod.variants.filter((v) => v.stock > 0);
        console.log("✅ Available variants:", availableVariants);

        if (availableVariants.length === 0) {
          showToastMsg("❌ All variants are out of stock.", "error");
          return;
        }

        if (selectedShade) {
          const matchedVariant = prod.variants.find(
            (v) =>
              v.sku === selectedShade.sku ||
              v.shadeName?.toLowerCase() === selectedShade.shadeName?.toLowerCase()
          );
          console.log("🔍 Matched variant:", matchedVariant);

          if (matchedVariant && matchedVariant.stock > 0) {
            variantToAdd = {
              ...matchedVariant,
              image:
                matchedVariant.images?.[0] ||
                matchedVariant.image ||
                selectedShade.image ||
                prod.images?.[0] ||
                "/placeholder.png",
            };
          } else {
            showToastMsg("❌ Selected shade is out of stock.", "error");
            return;
          }
        } else {
          variantToAdd = {
            ...availableVariants[0],
            image:
              availableVariants[0].images?.[0] ||
              availableVariants[0].image ||
              prod.images?.[0] ||
              "/placeholder.png",
          };
          console.log("ℹ️ No shade selected, using first available variant");
        }
      } else {
        // ✅ Handle non-variant products
        if ((prod?.stock ?? 0) <= 0) {
          showToastMsg("❌ Product is out of stock.", "error");
          return;
        }

        variantToAdd = {
          sku: `sku-${prod._id}-default`,
          shadeName: "Default",
          hex: "#ccc",
          image: prod?.images?.[0] || "/placeholder.png",
          originalPrice: prod?.mrp || prod?.price || 0,
          discountedPrice: prod?.price || 0,
          stock: prod?.stock ?? 1,
        };
        console.log("ℹ️ Non-variant product, using default variant");
      }

      console.log("🚀 Final variant to add:", variantToAdd);

      if (!variantToAdd.sku) {
        console.error("❌ No SKU found for variant:", variantToAdd);
        showToastMsg("❌ Product variant error", "error");
        return;
      }

      // ✅ Cache selected variant for persistence
      const cache = JSON.parse(localStorage.getItem("cartVariantCache") || "{}");
      cache[prod._id] = variantToAdd;
      localStorage.setItem("cartVariantCache", JSON.stringify(cache));
      console.log("💾 Variant cached successfully");

      // ✅ Add to cart using Context
      console.log("🎯 Adding to cart...");
      try {
        const success = await addToCart(prod, variantToAdd, isGuest);
        if (success) {
          console.log("✅ Successfully added to cart");
          showToastMsg(isGuest ? "✅ Added to cart! (Guest Mode)" : "✅ Product added to cart!", "success");
          setTimeout(() => {
            navigate("/cartpage", { state: { refresh: true } });
          }, 500);
        } else {
          console.log("❌ addToCart returned false");
          showToastMsg("❌ Failed to add to cart", "error");
        }
      } catch (cartError) {
        console.error("🔥 CartContext error:", cartError);
        if (cartError.message === "Authentication required") {
          showToastMsg("⚠️ Please log in first", "error");
          navigate("/login");
        } else {
          showToastMsg("❌ Failed to add product to cart", "error");
        }
      }
    } catch (err) {
      console.error("🔥 Add to Cart outer error:", err);
      showToastMsg("❌ Failed to add product to cart", "error");
    }
  };

  // ✅ Disable button if product is out of stock
  const isOutOfStock =
    (!prod?.variants || prod.variants.length === 0) && (prod?.stock ?? 0) === 0;

  return (
    <button
      className="btn text-white bg-black d-flex gap-2 add-to-card-button flex-row-reverse m-0 p-0" style={{borderRadius:'0px' , height:'50px'}}
      onClick={handleAddToCart}
      disabled={isOutOfStock}
    >
      <img src={bagIcon} className="img-fluid ms-1" style={{marginTop:'0px' , width:'18px'}} alt="Bag-icons" />
      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
    </button>
  );
};

export default Addtocard;


