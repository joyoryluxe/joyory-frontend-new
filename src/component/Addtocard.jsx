import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";
import { CartContext } from "../Context/CartContext";
import bagIcon from "../assets/bag.svg";

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

      // ✅ Guest user flow
      if (isGuest) {
        console.log("🎯 Adding to guest cart...");
        
        try {
          const success = await addToCart(prod, variantToAdd, 1, true);
          console.log("📊 addToCart result:", success);

          if (success) {
            console.log("✅ Successfully added to guest cart");
            showToastMsg("✅ Added to cart! (Guest Mode)", "success");

            // Verify guest cart was updated
            const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
            console.log("📋 Guest cart contents after add:", guestCart);
            console.log("🛒 Guest cart item count:", guestCart.length);

            setTimeout(() => {
              navigate("/cartpage", { state: { refresh: true } });
            }, 500);
          } else {
            console.log("❌ addToCart returned false");
            showToastMsg("❌ Failed to add to cart", "error");
          }
        } catch (cartError) {
          console.error("🔥 CartContext error:", cartError);
          
          // 🟢 FALLBACK: Direct localStorage handling if CartContext fails
          console.log("🔄 Falling back to direct localStorage handling");
          let guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          
          const existingIndex = guestCart.findIndex(
            item => item.productId === prod._id && item.variantSku === variantToAdd.sku
          );

          if (existingIndex >= 0) {
            guestCart[existingIndex].quantity += 1;
          } else {
            guestCart.push({
              productId: prod._id,
              name: prod.name,
              variantSku: variantToAdd.sku,
              shadeName: variantToAdd.shadeName || "Default",
              image: variantToAdd.image || prod.images?.[0] || "/placeholder.png",
              price: variantToAdd.discountedPrice || variantToAdd.originalPrice || prod.price,
              quantity: 1,
              stock: variantToAdd.stock,
              brand: prod.brand?.name || prod.brand || "Unknown Brand",
              product: prod,
              selectedVariant: variantToAdd,
              isGuest: true
            });
          }
          
          localStorage.setItem("guestCart", JSON.stringify(guestCart));
          console.log("💾 Direct guest cart save successful");
          showToastMsg("✅ Added to cart! (Guest Mode)", "success");
          
          setTimeout(() => {
            navigate("/cartpage", { state: { refresh: true } });
          }, 500);
        }
        return;
      }

      // ✅ Logged-in user flow
      console.log("🔐 Logged-in user flow starting...");
      try {
        const response = await axiosInstance.post("/api/user/cart/add", {
          productId: prod._id,
          variants: [{ variantSku: variantToAdd.sku, quantity: 1 }],
        });

        console.log("📡 Backend response:", response.data);

        if (response.data.success) {
          await addToCart(prod, variantToAdd, 1, false);
          showToastMsg("✅ Product added to cart!", "success");
          navigate("/cartpage", { state: { refresh: true } });
        } else {
          showToastMsg(response.data.message || "❌ Failed to add product", "error");
        }
      } catch (error) {
        console.error("📡 Backend API error:", error);
        if (error.response?.status === 401) {
          showToastMsg("⚠️ Please log in first", "error");
          navigate("/login");
        } else {
          showToastMsg("❌ Failed to add product", "error");
        }
      }
    } catch (err) {
      console.error("🔥 Add to Cart error:", err);
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


