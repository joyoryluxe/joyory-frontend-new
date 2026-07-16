// src/pages/SkinDiagnosis.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import { UserContext } from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import axiosInstance from "../utils/axiosInstance";
import { analyzeSkin, getDiagnosisHistory, exportDiagnosisToRoutine } from "../api/skinDiagnosisApi";
import Loader from "../components/common/Loader";
import { toast } from "react-toastify";
import {
  FaCamera,
  FaUpload,
  FaHistory,
  FaCheckCircle,
  FaSpinner,
  FaUserMd,
  FaChevronRight,
  FaShoppingBag,
  FaShieldAlt,
  FaLightbulb,
  FaCheck,
  FaTimes,
  FaHeart,
  FaRegHeart
} from "react-icons/fa";
import "../styles/SkinDiagnosis.css";
import "../styles/ForYou.css";
import bagIcon from "../assets/bag.svg";


const SkinDiagnosis = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const [activeTab, setActiveTab] = useState("new-scan");
  const [step, setStep] = useState(1); // 1 = Input, 2 = Scanning, 3 = Results

  // Webcam states
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const auditIntervalRef = useRef(null);
  const canvasRef = useRef(null);

  // Smart lighting status
  const [lightingStatus, setLightingStatus] = useState({ label: "Checking lighting...", isGood: null, color: "#888" });

  // (Allergen checks are now computed server-side — no local state needed)

  // Regimen and checkout states
  const [isBulkAdding, setIsBulkAdding] = useState(false);
  const [isExportingRoutine, setIsExportingRoutine] = useState(false);

  // Variant selection states & helpers (aligned with BrandPage.jsx)
  const [selectedVariants, setSelectedVariants] = useState({});
  const [tempSelectedVariants, setTempSelectedVariants] = useState({});
  const [showVariantOverlay, setShowVariantOverlay] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState("all");
  const [showOutOfStockPopup, setShowOutOfStockPopup] = useState(false);
  const [outOfStockProductName, setOutOfStockProductName] = useState("");

  // Wishlist states
  const [wishlistData, setWishlistData] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  const getSku = (v) => v?.sku || v?.variantSku || `sku-${v?._id || "default"}`;

  const isValidHexColor = (hex) => {
    if (!hex || typeof hex !== "string") return false;
    return /^#([a-f0-9]{6}|[a-f0-9]{3})$/.test(hex.trim().toLowerCase());
  };

  const getVariantDisplayText = (v) =>
    (
      v.shadeName ||
      v.name ||
      v.size ||
      v.ml ||
      v.weight ||
      "Default"
    ).toUpperCase();

  const groupVariantsByType = (variants) => {
    const g = { color: [], text: [] };
    (variants || []).forEach((v) => {
      if (!v) return;
      v.hex && isValidHexColor(v.hex) ? g.color.push(v) : g.text.push(v);
    });
    return g;
  };

  // ===================== WISHLIST FUNCTIONS & HELPERS =====================
  const isInWishlist = (productId, sku) => {
    if (!productId || !sku) return false;
    return wishlistData.some(item =>
      (item.productId === productId || item._id === productId) &&
      item.sku === sku
    );
  };

  const fetchWishlistData = async () => {
    try {
      if (user && !user.guest) {
        const response = await axiosInstance.get("/api/user/wishlist");
        if (response.data.success) {
          setWishlistData(response.data.wishlist || []);
        }
      } else {
        const localWishlist = JSON.parse(localStorage.getItem("guestWishlist")) || [];
        const formattedWishlist = localWishlist.map(item => ({
          productId: item._id,
          _id: item._id,
          sku: item.sku,
          name: item.name,
          variant: item.variantName,
          image: item.image,
          displayPrice: item.displayPrice,
          originalPrice: item.originalPrice,
          discountPercent: item.discountPercent,
          status: item.status,
          avgRating: item.avgRating,
          totalRatings: item.totalRatings
        }));
        setWishlistData(formattedWishlist);
      }
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
      setWishlistData([]);
    }
  };

  const toggleWishlist = async (prod, variant) => {
    if (!user || user.guest) {
      toast.error("Please login to use wishlist");
      navigate("/login", { state: { from: "/skin-diagnosis" } });
      return;
    }
    if (!prod || !variant) {
      toast.error("Please select a variant first");
      return;
    }

    const productId = prod._id;
    const sku = getSku(variant);

    setWishlistLoading(prev => ({ ...prev, [productId]: true }));

    try {
      const currentlyInWishlist = isInWishlist(productId, sku);

      if (user && !user.guest) {
        if (currentlyInWishlist) {
          await axiosInstance.delete(`/api/user/wishlist/${productId}`, {
            data: { sku: sku }
          });
          toast.success("Removed from wishlist!");
        } else {
          await axiosInstance.post(`/api/user/wishlist/${productId}`, {
            sku: sku
          });
          toast.success("Added to wishlist!");
        }
        await fetchWishlistData();
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login to use wishlist");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to update wishlist");
      }
    } finally {
      setWishlistLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(numPrice);
  };

  const handleOutOfStockClick = (productName) => {
    setOutOfStockProductName(productName || "This product");
    setShowOutOfStockPopup(true);
    setTimeout(() => {
      setShowOutOfStockPopup(false);
    }, 3000);
  };

  const closeOutOfStockPopup = () => {
    setShowOutOfStockPopup(false);
  };

  const isCompletelyOutOfStock = (prod) => {
    const vars = Array.isArray(prod.variants) ? prod.variants : [];
    if (vars.length === 0) {
      return (prod.stock || 0) <= 0;
    }
    return vars.every((v) => (v.stock || 0) <= 0);
  };

  const handleVariantSelect = (pid, v) =>
    setSelectedVariants((p) => ({ ...p, [pid]: v }));

  const openVariantOverlay = (pid, t = "all") => {
    setSelectedVariantType(t);
    setShowVariantOverlay(pid);
  };

  const closeVariantOverlay = () => {
    setShowVariantOverlay(null);
    setSelectedVariantType("all");
  };

  const getProductSlug = (pr) => {
    if (!pr) return "";
    if (pr.slugs?.[0]) return pr.slugs[0];
    return pr.slug || pr._id || "";
  };


  // File and preview states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusTicker, setStatusTicker] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  // Product adding states
  const [addingToCart, setAddingToCart] = useState({});

  // History states
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fileInputRef = useRef(null);

  const tickerMessages = [
    "Uploading photo...",
    "Detecting skin surface...",
    "Analyzing melanin & undertones...",
    "Evaluating pores & concerns...",
    "Formulating custom regime..."
  ];

  // Load history if logged in
  const loadHistory = async () => {
    if (!user || user.guest) return;
    setHistoryLoading(true);
    try {
      const res = await getDiagnosisHistory();
      if (res.data.success) {
        setHistoryList(res.data.history || []);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
      toast.error("Failed to load diagnosis history.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab, user]);

  useEffect(() => {
    fetchWishlistData();
  }, [user]);

  // Allergen profile is now checked server-side in the backend.
  // No separate allergen API call needed here.

  // Smart lighting analysis loop
  const startLightingAudit = () => {
    if (auditIntervalRef.current) clearInterval(auditIntervalRef.current);

    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");

    auditIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, 80, 80);
        try {
          const imgData = ctx.getImageData(0, 0, 80, 80);
          const data = imgData.data;
          let sum = 0;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            sum += brightness;
          }
          const avg = sum / (data.length / 4);
          if (avg < 65) {
            setLightingStatus({
              label: "Too Dark - Move to a brighter room",
              isGood: false,
              color: "#ff4d4d"
            });
          } else {
            setLightingStatus({
              label: "Good Lighting - Ready to Scan",
              isGood: true,
              color: "#4dff4d"
            });
          }
        } catch (e) {
          console.error("Error doing lighting check:", e);
        }
      }
    }, 400);
  };

  // Handle webcam toggle
  const startWebcam = async () => {
    try {
      setIsWebcamActive(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      setLightingStatus({ label: "Auditing lighting...", isGood: null, color: "#aaa" });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 640 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      startLightingAudit();
    } catch (err) {
      console.error("Webcam access error:", err);
      toast.error("Could not access camera. Please check permissions or upload an image.");
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (auditIntervalRef.current) {
      clearInterval(auditIntervalRef.current);
      auditIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext("2d");

    // Mirror horizontally to match preview
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setPreviewUrl(dataUrl);

    // Convert to file object
    const blobBin = atob(dataUrl.split(',')[1]);
    const array = [];
    for (let i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    const file = new File([new Uint8Array(array)], "selfie.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    stopWebcam();
  };

  // Cleanup webcam on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Drag and drop handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopWebcam();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      stopWebcam();
    } else {
      toast.error("Please drop an image file (JPG, PNG, or WebP).");
    }
  };

  // Start analysis flow
  const handleStartAnalysis = async () => {
    if (!selectedFile) {
      toast.error("Please upload or capture a selfie first.");
      return;
    }

    setStep(2); // Scanning state
    setIsAnalyzing(true);

    let tickerIndex = 0;
    setStatusTicker(tickerMessages[0]);
    const tickerInterval = setInterval(() => {
      tickerIndex = (tickerIndex + 1) % tickerMessages.length;
      setStatusTicker(tickerMessages[tickerIndex]);
    }, 1200);

    const formData = new FormData();
    formData.append("selfie", selectedFile);

    // Keep the scan animation active for a minimum of 4.5 seconds to build immersion
    const minWaitPromise = new Promise(resolve => setTimeout(resolve, 4500));

    try {
      const apiPromise = analyzeSkin(formData);
      const [apiResponse] = await Promise.all([apiPromise, minWaitPromise]);

      clearInterval(tickerInterval);

      if (apiResponse.data.success) {
        setAnalysisResult({
          diagnosisId: apiResponse.data.diagnosisId,
          imageUrl: apiResponse.data.imageUrl || previewUrl,
          analysis: apiResponse.data.analysis,
          recommendedProducts: apiResponse.data.recommendedProducts || []
        });
        setStep(3); // Result state
        toast.success("Skin diagnosis completed successfully!");
      } else {
        setStep(1);
        toast.error(apiResponse.data.message || "Analysis failed. Please try a clearer picture.");
      }
    } catch (err) {
      clearInterval(tickerInterval);
      setStep(1);
      console.error("Diagnosis request failed:", err);
      toast.error(err.response?.data?.message || "Failed to communicate with AI model. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Click history item
  const handleViewHistoryItem = (item) => {
    const mappedProducts = (item.recommendedProductIds || []).map(p => ({
      productId: p.productId || p._id,
      _id: p.productId || p._id,
      name: p.name,
      slug: p.slugs?.[0] || p.slug || p._id,
      image: p.variants?.[0]?.images?.[0] || p.image || null,
      price: p.variants?.[0]?.displayPrice || p.price || 0,
      discountedPrice: p.variants?.[0]?.discountedPrice || p.discountedPrice || null,
      brandName: p.brandName || (p.brand?.name || ""),
      categoryName: p.categoryName || (p.category?.name || ""),
      summary: p.summary || "",
      ingredients: p.ingredients || [],
      variants: p.variants || [],
      supportsVTO: p.supportsVTO || false,
      stock: p.stock || 0
    }));

    setAnalysisResult({
      diagnosisId: item._id,
      imageUrl: item.imageUrl,
      analysis: item.analysis,
      recommendedProducts: mappedProducts
    });
    setStep(3);
    setActiveTab("new-scan");
  };

  // Add product to bag
  const handleAddToCart = async (product, chosenVariant = null) => {
    const prodId = product.productId || product._id;
    setAddingToCart(prev => ({ ...prev, [prodId]: true }));
    try {
      const vars = Array.isArray(product.variants) ? product.variants : [];
      const hasVar = vars.length > 0;
      let variantToSubmit = chosenVariant || tempSelectedVariants[prodId] || selectedVariants[prodId];

      if (hasVar && !variantToSubmit) {
        variantToSubmit = vars.find(v => v.stock > 0) || vars[0];
      }

      if (hasVar && (!variantToSubmit || variantToSubmit.stock <= 0)) {
        toast.error("This product is currently out of stock.");
        return;
      }

      const isGuest = !user || user.guest;
      const productPayload = {
        _id: product.productId || product._id,
        name: product.name,
        brand: product.brandName || "Joyory Luxe",
        images: product.variants?.[0]?.images || [product.image],
        price: product.price,
      };

      const variantPayload = variantToSubmit ? {
        sku: variantToSubmit.sku,
        image: variantToSubmit.images?.[0] || variantToSubmit.image || product.image || "/placeholder.png",
        displayPrice: variantToSubmit.displayPrice || product.price,
        originalPrice: variantToSubmit.originalPrice || product.price,
        stock: variantToSubmit.stock,
      } : {
        sku: "default-" + (product.productId || product._id),
        image: product.image || "/placeholder.png",
        displayPrice: product.price,
        originalPrice: product.price,
        stock: 1,
      };

      const success = await addToCart(productPayload, variantPayload, isGuest);
      if (success) {
        toast.success("Added to bag!");
        navigate("/cartpage");
      }
    } catch (err) {
      console.error("Cart error:", err);
      if (err.message === "Authentication required") {
        toast.error("Please login to proceed.");
        navigate("/login");
      } else {
        toast.error(err.response?.data?.message || "Failed to add to bag.");
      }
    } finally {
      setAddingToCart(prev => ({ ...prev, [prodId]: false }));
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setStep(1);
  };

  // ── NOTE: getProductStepLabel, getProductTimeOfDay, checkProductAllergens
  // have been REMOVED. These are now computed server-side in skinDiagnosisController.js
  // and returned directly in each product: product.stepLabel, product.timeOfDay, product.allergenAlert

  // Action Handler: Export routine planner
  // Backend builds the full routine — goal, steps, AM/PM, allergens, milestone — all server-side
  const handleExportToRoutine = async () => {
    if (!user || user.guest) {
      toast.info("Please log in to save this routine to your planner.");
      navigate("/login", { state: { from: "/skin-diagnosis" } });
      return;
    }
    setIsExportingRoutine(true);
    try {
      const res = await exportDiagnosisToRoutine(analysisResult.diagnosisId);
      if (res.data && res.data.success) {
        toast.success(`${res.data.message || "Routine saved!"} ✨ Go to 'My Routines' in the Routine Builder to track it.`);
      } else {
        toast.error("Failed to export routine.");
      }
    } catch (err) {
      console.error("Export routine error:", err);
      toast.error(err.response?.data?.message || "Failed to communicate with Routine Planner.");
    } finally {
      setIsExportingRoutine(false);
    }
  };

  // Action Handler: Bulk add routine to bag
  // Uses enriched product data already in state — no extra API calls per product
  const handleAddFullRegimenToCart = async () => {
    setIsBulkAdding(true);
    let addedCount = 0;
    try {
      await navigator.clipboard.writeText("LUXE10");
    } catch (err) {
      console.warn("Failed to copy code", err);
    }

    for (const product of analysisResult.recommendedProducts) {
      try {
        const vars = Array.isArray(product.variants) ? product.variants : [];
        const hasVar = vars.length > 0;
        let selectedVariant = hasVar ? (vars.find(v => v.stock > 0) || vars[0]) : null;

        if (hasVar && (!selectedVariant || selectedVariant.stock <= 0)) {
          continue; // skip out-of-stock
        }

        const productPayload = {
          _id: product._id || product.productId,
          name: product.name,
          brand: product.brandName || product.brand || "Joyory Luxe",
          images: product.variants?.[0]?.images || [product.image],
          price: product.price,
        };

        const variantPayload = selectedVariant ? {
          sku: selectedVariant.sku,
          image: selectedVariant.images?.[0] || product.image || "/placeholder.png",
          displayPrice: selectedVariant.displayPrice || product.price,
          originalPrice: selectedVariant.originalPrice || product.price,
          stock: selectedVariant.stock,
        } : {
          sku: "default-" + (product._id || product.productId),
          image: product.image || "/placeholder.png",
          displayPrice: product.price,
          originalPrice: product.price,
          stock: 1,
        };

        const isGuest = !user || user.guest;
        const success = await addToCart(productPayload, variantPayload, isGuest);
        if (success) addedCount++;
      } catch (err) {
        console.error("Bulk add item error:", product.name, err);
      }
    }

    setIsBulkAdding(false);
    if (addedCount > 0) {
      toast.success(`Success! Added ${addedCount} products to bag. Coupon code 'LUXE10' copied! Save 10% on checkout. 🛍️✨`);
    } else {
      toast.error("Failed to add products. They may be out of stock.");
    }
  };

  const getSortedHistory = () => {
    return [...historyList]
      .filter(item => item.createdAt && item.analysis)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  const renderHistoryChart = () => {
    const sorted = getSortedHistory();
    if (sorted.length < 2) return null;

    const width = 500;
    const height = 150;
    const padding = 25;
    const pointsHydration = [];
    const pointsSeverity = [];

    sorted.forEach((item, idx) => {
      let baseHyd = 50;
      const type = (item.analysis.skinType || "").toLowerCase();
      const concerns = item.analysis.concerns || [];
      if (type === "dry") baseHyd = 38;
      else if (type === "oily") baseHyd = 52;
      else if (type === "combination") baseHyd = 48;
      else if (type === "normal") baseHyd = 65;
      else if (type === "sensitive") baseHyd = 42;

      if (concerns.includes("dryness")) baseHyd = 30;

      const hyd = Math.min(75, baseHyd + idx * 8);

      const baseSev = Math.max(15, concerns.length * 20);
      const sev = Math.max(10, baseSev - idx * 10);

      const x = padding + (idx / (sorted.length - 1)) * (width - 2 * padding);
      const yHyd = height - padding - (hyd / 100) * (height - 2 * padding);
      const ySev = height - padding - (sev / 100) * (height - 2 * padding);

      pointsHydration.push({ x, y: yHyd, val: hyd, date: new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) });
      pointsSeverity.push({ x, y: ySev, val: sev });
    });

    const dHydration = pointsHydration.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(" ");
    const dSeverity = pointsSeverity.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(" ");

    return (
      <div className="progress-chart-card">
        <div className="chart-header">
          <div className="chart-title-side">
            <h4 className="progress-chart-title">Skincare Progress History</h4>
            <p className="progress-chart-subtitle">Skin metrics tracked over {sorted.length} visual scans</p>
          </div>
          <div className="chart-legends">
            <span className="legend-item"><span className="legend-dot hydration" /> Hydration Level</span>
            <span className="legend-item"><span className="legend-dot severity" /> Concern Severity</span>
          </div>
        </div>
        <div className="chart-wrapper">
          <svg viewBox={`0 0 ${width} ${height}`} className="progress-svg-chart">
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(75, 67, 67, 1)" />
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(75, 67, 67, 1)" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(75, 67, 67, 1)" />

            <path d={dHydration} fill="none" stroke="#4dff4d" strokeWidth="2.5" className="chart-line-path hydration" />
            <path d={dSeverity} fill="none" stroke="#ff4d4d" strokeWidth="2.5" className="chart-line-path severity" />

            {pointsHydration.map((p, i) => (
              <g key={`hyd-${i}`}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#4dff4d" className="chart-point" />
                <text x={p.x} y={p.y - 8} fill="#4dff4d" fontSize="9" fontWeight="bold" textAnchor="middle">{p.val}%</text>
                <text x={p.x} y={height - 8} fill="#999" fontSize="8.5" textAnchor="middle">{p.date}</text>
              </g>
            ))}
            {pointsSeverity.map((p, i) => (
              <g key={`sev-${i}`}>
                <circle cx={p.x} cy={p.y} r="4.5" fill="#ff4d4d" className="chart-point" />
                <text x={p.x} y={p.y - 8} fill="#ff4d4d" fontSize="9" fontWeight="bold" textAnchor="middle">{p.val}%</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  // Tone color swatches map
  const getToneColor = (tone) => {
    const map = {
      light: "#F9E4D4",
      medium: "#E6C5A9",
      tan: "#B88A64",
      deep: "#7A4A28",
      unknown: "#d4af37"
    };
    return map[tone.toLowerCase()] || map.unknown;
  };

  // Circumference logic for confidence SVGs
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = analysisResult?.analysis
    ? circumference - (analysisResult.analysis.confidence / 100) * circumference
    : circumference;

  return (
    <div className="skin-diagnosis-page">
      <Header />

      <main className="skin-diagnosis-container">

        {/* Page Header */}
        <section className="skin-diagnosis-header">
          <span className="skin-diagnosis-tag">AI Beauty Lab</span>
          <h1 className="skin-diagnosis-title">SkinScan AI Diagnosis</h1>
          <p className="skin-diagnosis-subtitle">
            Dermatologist-aligned vision intelligence. Reveal your exact skin metrics, analyze concerns, and generate a hyper-customized regimen.
          </p>
        </section>

        {/* Tabs switcher capsule */}
        <div className="tabs-container">
          <div className="tabs-capsule">
            <button
              className={`tab-btn ${activeTab === "new-scan" ? "active" : ""}`}
              onClick={() => {
                setActiveTab("new-scan");
                if (analysisResult) {
                  setStep(3);
                } else {
                  setStep(1);
                }
              }}
            >
              New Scan
            </button>
            {user && !user.guest && (
              <button
                className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
                onClick={() => setActiveTab("history")}
              >
                Diagnosis History
              </button>
            )}
          </div>
        </div>

        {/* TAB: NEW SCAN */}
        {activeTab === "new-scan" && (
          <div className="glass-panel">

            {/* STEP 1: Upload / Webcam View */}
            {step === 1 && (
              <div className="scan-workspace">

                {/* Media area */}
                <div
                  className={`media-box ${dragOver ? "dragover" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {/* Webcam preview active */}
                  {isWebcamActive && (
                    <div className="webcam-container">
                      <div className="webcam-wrapper">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="webcam-video"
                        />
                        <div className="webcam-overlay">
                          {/* Pulsing SVG Face Guide Overlay */}
                          <svg viewBox="0 0 100 100" className="webcam-hud-svg">
                            <circle cx="50" cy="50" r="48" stroke="rgba(212, 175, 55, 0.12)" strokeWidth="0.5" fill="none" strokeDasharray="3, 3" />
                            <circle cx="50" cy="50" r="44" stroke="rgba(212, 175, 55, 0.25)" strokeWidth="0.8" fill="none" />
                            <path
                              d="M50,16 C34,16 31,34 31,53 C31,70 40,83 50,83 C60,83 69,70 69,53 C69,34 66,16 50,16 Z"
                              stroke="#d4af37"
                              strokeWidth="1.5"
                              fill="none"
                              className="hud-face-path"
                            />
                            <path d="M22,50 L18,50 M82,50 L78,50 M50,12 L50,8 M50,88 L50,84" stroke="rgba(212, 175, 55, 0.4)" strokeWidth="1" />
                          </svg>

                          {/* Smart Lighting Indicator Overlay */}
                          <div className="lighting-hud-indicator">
                            <span className="lighting-hud-dot" style={{ backgroundColor: lightingStatus.color }} />
                            <span className="lighting-hud-text" style={{ color: lightingStatus.color }}>
                              {lightingStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="webcam-controls">
                        <button className="btn-capture" onClick={capturePhoto} title="Capture Snapshot">
                          <FaCamera />
                        </button>
                        <button className="btn-webcam-cancel" onClick={stopWebcam} title="Cancel">
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Image chosen preview */}
                  {!isWebcamActive && previewUrl && (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Preview" className="preview-image" />
                      <div className="preview-controls">
                        <button className="btn-upload-file" onClick={handleStartAnalysis}>
                          Analyze Skin
                        </button>
                        <button className="btn-webcam-cancel" onClick={handleReset} title="Clear Image">
                          ✕
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Empty state file pick drop */}
                  {!isWebcamActive && !previewUrl && (
                    <div className="upload-placeholder" onClick={() => fileInputRef.current?.click()}>
                      <div className="upload-icon-wrapper">
                        <FaUpload />
                      </div>
                      <h4 className="upload-title">Drag & Drop Selfie</h4>
                      <p className="upload-subtitle">Supports JPG, PNG, or WebP up to 4MB</p>
                      <button className="btn-upload-file">
                        Choose File
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>

                {/* Checklist controls */}
                <div className="checklist-box">
                  <h4 className="checklist-title">Scan Guidelines</h4>
                  <div className="checklist-items">
                    <div className="checklist-item">
                      <span className="checklist-icon"><FaCheckCircle /></span>
                      <div className="checklist-text">
                        <h5>Optimal Lighting</h5>
                        <p>Face a natural light source. Avoid heavy shadows or backlighting.</p>
                      </div>
                    </div>
                    <div className="checklist-item">
                      <span className="checklist-icon"><FaCheckCircle /></span>
                      <div className="checklist-text">
                        <h5>Bare Skin Preferred</h5>
                        <p>Wash your face and remove makeup/glasses for maximum AI precision.</p>
                      </div>
                    </div>
                    <div className="checklist-item">
                      <span className="checklist-icon"><FaCheckCircle /></span>
                      <div className="checklist-text">
                        <h5>Neutral Expression</h5>
                        <p>Look straight into the lens, keeping your face centered inside the frame.</p>
                      </div>
                    </div>
                  </div>

                  {!isWebcamActive && !previewUrl && (
                    <button className="toggle-webcam-btn" onClick={startWebcam}>
                      <FaCamera /> Use Live Webcam
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Scanning Laser Loader */}
            {step === 2 && (
              <div className="scanning-workspace">
                <div className="scanner-image-container">
                  <img src={previewUrl} alt="Scanning face" />
                  <div className="scan-beam" />
                </div>
                <div className="scanner-ticker">
                  {statusTicker}
                </div>
                <div className="scanner-bar-container">
                  <div className="scanner-bar-progress" />
                </div>
              </div>
            )}

            {/* STEP 3: Results Display */}
            {step === 3 && analysisResult && (
              <div className="results-workspace">
                <div className="results-grid">

                  {/* Results Left Info */}
                  <div className="results-left">
                    <div className="results-photo-wrapper results-photo-wrapper-relative">
                      <img src={analysisResult.imageUrl} alt="Analyzed face" />
                      {/* Pinpoint dots */}
                      <div className="facial-pin pin-forehead">
                        <div className="pin-pulse" />
                        <div className="pin-dot" />
                        <div className="pin-tooltip">
                          <h6>Forehead (T-Zone)</h6>
                          <p>Slightly oily, enlarged pores</p>
                        </div>
                      </div>
                      <div className="facial-pin pin-left-cheek">
                        <div className="pin-pulse" />
                        <div className="pin-dot" />
                        <div className="pin-tooltip">
                          <h6>Left Cheek</h6>
                          <p>High dryness, redness detected</p>
                        </div>
                      </div>
                      <div className="facial-pin pin-right-cheek">
                        <div className="pin-pulse" />
                        <div className="pin-dot" />
                        <div className="pin-tooltip">
                          <h6>Right Cheek</h6>
                          <p>Redness, dryness detected</p>
                        </div>
                      </div>
                      <div className="facial-pin pin-chin">
                        <div className="pin-pulse" />
                        <div className="pin-dot" />
                        <div className="pin-tooltip">
                          <h6>Chin / Jaw</h6>
                          <p>Mild congestion, breakouts</p>
                        </div>
                      </div>
                    </div>

                    {/* Confidence score wheel */}
                    <div className="confidence-wrapper">
                      <svg width="130" height="130" viewBox="0 0 120 120">
                        <defs>
                          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" />
                            <stop offset="100%" stopColor="#b89222" />
                          </linearGradient>
                        </defs>
                        <circle cx="60" cy="60" r={radius} className="confidence-ring-bg" />
                        <circle
                          cx="60"
                          cy="60"
                          r={radius}
                          className="confidence-ring-progress"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          transform="rotate(-90 60 60)"
                        />
                      </svg>
                      <div className="confidence-text-container">
                        <span className="confidence-value">{analysisResult.analysis.confidence}%</span>
                        <span className="confidence-label">Confidence</span>
                      </div>
                    </div>

                    <div className="metrics-grid">
                      <div className="metric-card">
                        <span className="metric-label">Tone Match</span>
                        <span className="metric-value">
                          <span
                            className="color-swatch"
                            style={{ backgroundColor: getToneColor(analysisResult.analysis.skinTone) }}
                          />
                          {analysisResult.analysis.skinTone}
                        </span>
                      </div>

                      <div className="metric-card">
                        <span className="metric-label">Undertone</span>
                        <span className="metric-value">
                          <span className={`undertone-badge undertone-${analysisResult.analysis.undertone.toLowerCase()}`}>
                            {analysisResult.analysis.undertone}
                          </span>
                        </span>
                      </div>

                      <div className="metric-card" style={{ gridColumn: "span 2" }}>
                        <span className="metric-label">Skin Type</span>
                        <span className="metric-value">
                          <span className="skin-type-badge">
                            {analysisResult.analysis.skinType}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Melanin & Hydration Comparison Swatches — values from backend skinMetrics */}
                    <div className="swatches-gauge-card">
                      <h4 className="swatches-title">Skin Swatches & Ideal Scales</h4>
                      {(() => {
                        const metrics = analysisResult.analysis.skinMetrics || {};
                        const hyd = metrics.hydrationLevel ?? 50;
                        const hydIdeal = metrics.hydrationIdeal ?? 65;
                        const mel = metrics.melaninIndex ?? 38;
                        const melIdeal = metrics.melaninIdeal ?? 30;
                        return (
                          <>
                            <div className="swatch-gauge-item">
                              <div className="swatch-header-row">
                                <span className="swatch-name">Hydration Level</span>
                                <span className="swatch-val font-weight-bold">
                                  {hyd}% <span className="swatch-ideal-target">vs Ideal {hydIdeal}%</span>
                                </span>
                              </div>
                              <div className="swatch-track-bar">
                                <div className="swatch-bar-progress hydration-fill" style={{ width: `${hyd}%` }} />
                                <div className="swatch-ideal-marker" style={{ left: `${hydIdeal}%` }} title={`Ideal Target: ${hydIdeal}%`} />
                              </div>
                            </div>
                            <div className="swatch-gauge-item">
                              <div className="swatch-header-row">
                                <span className="swatch-name">Melanin Index</span>
                                <span className="swatch-val font-weight-bold">
                                  {mel}% <span className="swatch-ideal-target">vs Ideal {melIdeal}%</span>
                                </span>
                              </div>
                              <div className="swatch-track-bar">
                                <div className="swatch-bar-progress melanin-fill" style={{ width: `${mel}%` }} />
                                <div className="swatch-ideal-marker" style={{ left: `${melIdeal}%` }} title={`Ideal Target: ${melIdeal}%`} />
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Results Right Info */}
                  <div className="results-right">

                    {/* Concerns Pill tags */}
                    <div className="concerns-box mb-4">
                      <span className="metric-label">Identified Concerns</span>
                      <div className="concerns-list">
                        {analysisResult.analysis.concerns.length > 0 ? (
                          analysisResult.analysis.concerns.map((concern, idx) => (
                            <span key={idx} className="concern-pill">
                              {concern.replace("_", " ")}
                            </span>
                          ))
                        ) : (
                          <span className="concern-pill">No visible concerns</span>
                        )}
                      </div>
                    </div>

                    {/* Consultation Block */}
                    <div className="consultation-box">
                      <h4 className="consultation-title">
                        <FaUserMd /> Dermatologist Consultation Notes
                      </h4>
                      <p className="consultation-text">
                        "{analysisResult.analysis.rawSummary}"
                      </p>
                    </div>

                    <div className="results-action-bar">
                      <button className="btn-scan-again" onClick={handleReset}>
                        Scan Another Selfie
                      </button>
                      <button
                        className="btn-export-routine"
                        onClick={handleExportToRoutine}
                        disabled={isExportingRoutine}
                      >
                        {isExportingRoutine ? (
                          <>
                            <FaSpinner className="spinner-luxe" style={{ borderTopColor: "#fff", width: "14px", height: "14px" }} /> Exporting...
                          </>
                        ) : (
                          <>
                            Add to My Routine Planner
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Custom regimes / Products recommendations */}
                <div className="recs-section-header">
                  <h3 className="recs-section-title">Your Prescribed Regimen</h3>
                  <p className="recs-section-subtitle">
                    Dermatologist-recommended formulations aligned with your concerns ({analysisResult.analysis.concerns.join(", ").replace(/_/g, " ")}) and skin type.
                  </p>
                </div>

                {/* Bulk Checkout Regimen Banner */}
                <div className="bulk-checkout-banner">
                  <div className="bulk-text-side">
                    <h4 className="bulk-title">✨ Add Full Prescribed Regimen</h4>
                    <p className="bulk-subtitle">Save 10% off your full routine bundle using code <strong>LUXE10</strong> (copied on add).</p>
                  </div>
                  <button
                    className="btn-bulk-checkout"
                    onClick={handleAddFullRegimenToCart}
                    disabled={isBulkAdding}
                  >
                    {isBulkAdding ? (
                      <>
                        <FaSpinner className="spinner-luxe" style={{ borderTopColor: "#fff", width: "16px", height: "16px" }} /> Adding Bundle...
                      </>
                    ) : (
                      <>
                        <FaShoppingBag /> Add Full Regimen ({analysisResult.recommendedProducts.length} Products)
                      </>
                    )}
                  </button>
                </div>

                {/* Custom regimes / Products recommendations */}
                <div className="recs-section-header">
                  <h3 className="recs-section-title">Your Prescribed Regimen</h3>
                  <p className="recs-section-subtitle">
                    Dermatologist-recommended formulations aligned with your concerns ({analysisResult.analysis.concerns.join(", ").replace(/_/g, " ")}) and skin type.
                  </p>
                </div>

                {/* Recs Grid */}
                <div className="recs-grid">
                  {analysisResult.recommendedProducts.length > 0 ? (
                    analysisResult.recommendedProducts.map((product, idx) => {
                      const prodId = product.productId || product._id;
                      const vars = Array.isArray(product.variants) ? product.variants : [];
                      const hasVar = vars.length > 0;

                      const displayVariant = tempSelectedVariants[prodId] || selectedVariants[prodId] || (hasVar ? vars.find((v) => v.stock > 0) || vars[0] : null) || {};
                      const grouped = groupVariantsByType(vars);

                      const img = displayVariant?.images?.[0] || displayVariant?.image || product.image || product.images?.[0] || "/placeholder.png";
                      const price = displayVariant?.displayPrice || displayVariant?.discountedPrice || product.price || 0;
                      const originalPrice = displayVariant?.originalPrice || displayVariant?.mrp || product.price || price;
                      const hasDiscount = originalPrice > price;
                      const discountPercent = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

                      const completelyOutOfStock = isCompletelyOutOfStock(product);
                      const isCurrentVariantOutOfStock = hasVar ? displayVariant?.stock <= 0 : product.stock <= 0;
                      const showOutOfStock = completelyOutOfStock && !hasVar;
                      const showSelectVariantButton = hasVar && vars.length > 1;

                      const isAdding = addingToCart[prodId];
                      const buttonDisabled = isAdding || showOutOfStock;

                      let btnText = "Add to Bag";
                      if (isAdding) btnText = "Adding...";
                      else if (showOutOfStock) btnText = "Out of Stock";
                      else if (showSelectVariantButton) btnText = "Select Option";
                      else if (isCurrentVariantOutOfStock) btnText = "Out of Stock";

                      return (
                        <div key={prodId} className="foryou-card-wrapper animate-card">
                          <div className="foryou-card">
                            {/* Product Image with Overlays */}
                            <div
                              className="foryou-img-wrapper"
                              onClick={() => {
                                if (showOutOfStock) {
                                  handleOutOfStockClick(product.name);
                                } else {
                                  navigate(`/product/${getProductSlug(product)}`);
                                }
                              }}
                              style={{ cursor: 'pointer', position: 'relative' }}
                            >
                              <img
                                src={img}
                                alt={product.name}
                                className="foryou-img img-fluid"
                                loading="lazy"
                                onError={(e) => { e.target.src = "/placeholder.png"; }}
                                style={{
                                  opacity: showOutOfStock ? 0.6 : 1,
                                  filter: showOutOfStock ? 'grayscale(0.3)' : 'none',
                                }}
                              />
                              <span className="rec-badge-overlay" style={{ position: 'absolute', top: '10px', left: '10px', background: '#000', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', zIndex: 2 }}>Prescribed</span>

                              {product?.supportsVTO && (
                                <div
                                  className="support-beauty-badge"
                                  title="Try It On"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/product/${getProductSlug(product)}`);
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                                    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                                    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                                    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                                    <path d="M8 10a4 4 0 1 1 8 0c0 2.2-1.8 4-4 4s-4-1.8-4-4z" />
                                    <path d="M10 10h.01" />
                                    <path d="M14 10h.01" />
                                    <path d="M10 13c.5.5 1.5.7 2 .7s1.5-.2 2-.7" />
                                    <path d="M6 19c0-1.5 1.5-2.5 6-2.5s6 1 6 2.5" />
                                  </svg>
                                  <span className="vto-text">TRY IT ON</span>
                                </div>
                              )}

                              {showOutOfStock && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 3,
                                  }}
                                >
                                  <div
                                    style={{
                                      backgroundColor: '#dc3545',
                                      color: '#fff',
                                      padding: '8px 16px',
                                      borderRadius: '20px',
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                    }}
                                  >
                                    <FaTimes />
                                    Out of Stock
                                  </div>
                                </div>
                              )}

                              {/* Wishlist Icon */}
                              {!showOutOfStock && (
                                <button
                                  className={`product-card-wishlist-btn ${isInWishlist(prodId, getSku(displayVariant)) ? 'in-wishlist' : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (displayVariant) {
                                      toggleWishlist(product, displayVariant);
                                    }
                                  }}
                                  disabled={wishlistLoading[prodId]}
                                  title={isInWishlist(prodId, getSku(displayVariant)) ? "Remove from wishlist" : "Add to wishlist"}
                                >
                                  {wishlistLoading[prodId] ? (
                                    <div className="spinner-border spinner-border-sm" role="status"></div>
                                  ) : isInWishlist(prodId, getSku(displayVariant)) ? (
                                    <FaHeart />
                                  ) : (
                                    <FaRegHeart />
                                  )}
                                </button>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="foryou-product-info foryou-product-info-ai w-100 ps-lg-0 p-0 pt-md-0">
                              <div className="justify-content-between d-flex flex-column" style={{ height: '240px' }}>
                                {/* Step Sequence & Allergen-Safe Badge */}
                                <div className="d-flex gap-2 flex-column justify-content-between mb-1 mt-2">
                                  <span className="rec-step-seq" style={{ fontSize: '11px', fontWeight: 'bold', color: '#b89222' }}>{product.stepLabel || `Step ${idx + 1}`}</span>
                                  {product.allergenAlert ? (
                                    <span className="allergen-shield warning" title={product.allergenAlertMessage || "Allergen detected"}>
                                      ⚠️ Allergen Alert
                                    </span>
                                  ) : user && !user.guest ? (
                                    <span className="allergen-shield safe">🛡️ Allergen-Safe</span>
                                  ) : (
                                    <span className="allergen-shield neutral" title="Log in to check your allergen profile.">🛡️ Patch Test</span>
                                  )}
                                </div>

                                {/* Brand Name */}
                                <div className="brand-name small text-muted text-start mb-1">
                                  {product.brandName || "Joyory Luxe"}
                                </div>

                                {/* Product Name */}
                                <div className="product-card-title-wrap">
                                  <h6
                                    className="foryou-name m-0 p-0 text-start"
                                    onClick={() => {
                                      if (showOutOfStock) {
                                        handleOutOfStockClick(product.name);
                                      } else {
                                        navigate(`/product/${getProductSlug(product)}`);
                                      }
                                    }}
                                    style={{
                                      cursor: 'pointer',
                                      opacity: showOutOfStock ? 0.6 : 1,
                                    }}
                                  >
                                    {(() => {
                                      const varText = displayVariant ? getVariantDisplayText(displayVariant) : "";
                                      return varText && varText.toUpperCase() !== "DEFAULT" ? `${product.name} - ${varText}` : product.name;
                                    })()}
                                  </h6>
                                </div>

                                {/* Out of Stock Variant Notice */}
                                {showOutOfStock && (
                                  <div className="mt-2 mb-2 text-start">
                                    <span style={{ color: '#dc3545', fontSize: '13px', fontWeight: 500 }}>
                                      <FaTimes style={{ fontSize: '11px', marginRight: '4px' }} />
                                      Currently unavailable
                                    </span>
                                  </div>
                                )}

                                {/* Price Section */}
                                <div className="price-section mb-3 mt-auto">
                                  <div className="d-flex align-items-baseline flex-wrap">
                                    <span
                                      className="current-price fw-400 fs-5"
                                      style={{
                                        textDecoration: showOutOfStock ? 'line-through' : 'none',
                                        opacity: showOutOfStock ? 0.6 : 1,
                                      }}
                                    >
                                      {formatPrice(price)}
                                    </span>

                                    {hasDiscount && !showOutOfStock && (
                                      <>
                                        <span className="original-price text-muted text-decoration-line-through ms-2 fs-6">
                                          {formatPrice(originalPrice)}
                                        </span>
                                        <span className="discount-percent fw-bold ms-2">
                                          ({discountPercent}% OFF)
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Add to Bag Button */}
                                <div className="cart-section">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <button
                                      className={`btn w-100 page-title-main-name addtocartbuttton d-flex align-items-center justify-content-center gap-2 ${showOutOfStock
                                        ? "btn-secondary"
                                        : isAdding
                                          ? ""
                                          : "btn-outline-dark"
                                        }`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (showOutOfStock) {
                                          handleOutOfStockClick(product.name);
                                        } else if (showSelectVariantButton) {
                                          openVariantOverlay(prodId, "all", e);
                                        } else {
                                          handleAddToCart(product, displayVariant);
                                        }
                                      }}
                                      disabled={buttonDisabled && !showOutOfStock}
                                      style={{
                                        transition: "background-color 0.3s ease, color 0.3s ease",
                                        opacity: showOutOfStock ? 0.8 : 1,
                                        cursor: showOutOfStock ? 'pointer' : (buttonDisabled ? 'not-allowed' : 'pointer'),
                                      }}
                                    >
                                      {isAdding ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                          Adding...
                                        </>
                                      ) : showOutOfStock ? (
                                        <>
                                          <FaTimes style={{ fontSize: '14px' }} />
                                          Out of Stock
                                        </>
                                      ) : (
                                        <>
                                          {showSelectVariantButton ? "Select Option" : isCurrentVariantOutOfStock ? "Out of Stock" : "Add to Bag"}
                                          {!buttonDisabled && !isAdding && !showSelectVariantButton && !isCurrentVariantOutOfStock && (
                                            <img src={bagIcon} className="img-fluid ms-1" style={{ marginTop: '-3px', height: "20px" }} alt="Bag-icon" />
                                          )}
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Desktop Inline Variant Selector Overlay */}
                          {showVariantOverlay === prodId && !showOutOfStock && (
                            <div className="variant-overlay" onClick={closeVariantOverlay}>
                              <div className="variant-overlay-content" onClick={(e) => e.stopPropagation()}>
                                <div className="overlay-header d-flex justify-content-between align-items-center p-3 border-bottom">
                                  <h5 className="m-0 page-title-main-name">Select Option</h5>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); closeVariantOverlay(); }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      fontSize: '30px',
                                      lineHeight: 1,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    &times;
                                  </button>
                                </div>
                                <div className="variant-overlay-body p-3">
                                  {grouped.color.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 justify-content-start align-items-center mb-3">
                                      {grouped.color.map((v) => {
                                        const isSel = tempSelectedVariants[prodId]?.sku === v.sku || displayVariant?.sku === v.sku;
                                        const isOos = v.stock <= 0;
                                        return (
                                          <div
                                            key={v.sku}
                                            style={{ cursor: isOos ? "not-allowed" : "pointer", position: "relative" }}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (!isOos) {
                                                handleVariantSelect(prodId, v);
                                                setTempSelectedVariants(prev => ({ ...prev, [prodId]: v }));
                                              }
                                            }}
                                            title={v.shadeName}
                                          >
                                            <div
                                              style={{
                                                width: "28px",
                                                height: "28px",
                                                borderRadius: "20%",
                                                backgroundColor: v.hex || "#ccc",
                                                border: isSel ? "3px solid #000" : "1px solid #ddd",
                                                opacity: isOos ? 0.4 : 1,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                              }}
                                            >
                                              {isSel && <FaCheck style={{ color: "#000", fontSize: "10px" }} />}
                                              {isOos && <span style={{ color: "red", fontWeight: "bold", fontSize: "12px" }}>✕</span>}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {grouped.text.length > 0 && (
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                      {grouped.text.map((v) => {
                                        const isSel = tempSelectedVariants[prodId]?.sku === v.sku || displayVariant?.sku === v.sku;
                                        const isOos = v.stock <= 0;
                                        return (
                                          <button
                                            key={v.sku}
                                            className={`btn btn-sm ${isSel ? 'btn-dark' : 'btn-outline-dark'} ${isOos ? 'opacity-50' : ''}`}
                                            disabled={isOos}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleVariantSelect(prodId, v);
                                              setTempSelectedVariants(prev => ({ ...prev, [prodId]: v }));
                                            }}
                                          >
                                            {getVariantDisplayText(v)}
                                            {isOos && " ✕"}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <div className="variant-overlay-footer p-3 border-top mt-auto">
                                  <div className="selected-variant-display mb-2 text-start" style={{ fontSize: '11px' }}>
                                    Selected: <span className="fw-bold">{getVariantDisplayText(displayVariant)}</span>
                                  </div>
                                  <div style={{ marginTop: '4px', marginBottom: '8px', textAlign: 'left' }}>
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/product/${getProductSlug(product)}`);
                                        closeVariantOverlay();
                                      }}
                                      style={{ cursor: 'pointer', fontSize: '11px', color: '#000', textDecoration: 'underline' }}
                                    >
                                      View Details
                                    </span>
                                  </div>
                                  <button
                                    className="btn btn-dark w-100"
                                    disabled={isCurrentVariantOutOfStock}
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      const chosen = tempSelectedVariants[prodId] || selectedVariants[prodId] || (vars.find(v => v.stock > 0) || vars[0]);
                                      await handleAddToCart(product, chosen);
                                      closeVariantOverlay();
                                    }}
                                  >
                                    {isAdding ? "Adding..." : "Add Selection"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-4 py-4 text-center text-muted">
                      No matching formulations found in the store database.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: DIAGNOSIS HISTORY (REDESIGNED) */}
        {activeTab === "history" && (
          <div className="glass-panel">
            {/* Skincare Progress Line Chart */}
            {!historyLoading && historyList.length > 1 && renderHistoryChart()}

            {historyLoading ? (
              <Loader text="Retrieving past scans..." height={120} />
            ) : historyList.length > 0 ? (
              <div className="history-container">
                {historyList.map((item) => (
                  <div
                    key={item._id}
                    className="history-card"
                    onClick={() => handleViewHistoryItem(item)}
                  >
                    {/* 1. Thumbnail */}
                    <div className="history-thumb">
                      <img src={item.imageUrl || "/placeholder.png"} alt="Scan thumbnail" />
                    </div>

                    {/* 2. Details Column */}
                    <div className="history-details-col">
                      <div className="history-details-header">
                        <h4>{item.analysis.skinType} Skin</h4>
                        <span className="history-details-date">
                          {new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <p className="history-details-desc">{item.analysis.rawSummary}</p>
                    </div>

                    {/* 3. Glass Metrics Box */}
                    <div className="history-metrics-box">
                      <div className="history-metric-item">
                        <span className="history-metric-label">Tone</span>
                        <span className="history-metric-value">{item.analysis.skinTone}</span>
                      </div>
                      <div className="history-metric-item">
                        <span className="history-metric-bullet" style={{ backgroundColor: getToneColor(item.analysis.skinTone), width: '12px', height: '12px', borderRadius: '50%' }} />
                        <span className={`undertone-badge undertone-${item.analysis.undertone.toLowerCase()}`} style={{ fontSize: '10px', padding: '1px 8px' }}>
                          {item.analysis.undertone}
                        </span>
                      </div>
                    </div>

                    {/* 4. Action Button */}
                    <div className="history-action-box">
                      <button className="history-item-view">
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-history-box">
                <p>You haven't completed any skin diagnosis scans yet.</p>
                <button className="btn-upload-file" onClick={() => setActiveTab("new-scan")}>
                  Start Your First Scan
                </button>
              </div>
            )}
          </div>
        )}      {/* ===================== OUT OF STOCK POPUP ===================== */}
        {showOutOfStockPopup && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={closeOutOfStockPopup}
          >
            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '30px 40px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                position: 'relative',
                animation: 'popupSlideIn 0.3s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeOutOfStockPopup}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                <FaTimes />
              </button>

              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#fee2e2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#ef4444',
                }}
              >
                <FaTimes style={{ fontSize: '24px' }} />
              </div>

              <h5
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  marginBottom: '10px',
                  color: '#111827',
                }}
              >
                Out of Stock
              </h5>

              <p
                style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  lineHeight: 1.5,
                  marginBottom: '20px',
                }}
              >
                Oops! {outOfStockProductName} is currently out of stock. We'll restock soon!
              </p>

              <button
                onClick={closeOutOfStockPopup}
                style={{
                  backgroundColor: '#111827',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  width: '100%',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* ===================== MOBILE BOTTOM SHEET DRAWER ===================== */}
        {(() => {
          if (!showVariantOverlay) return null;
          const item = analysisResult?.recommendedProducts?.find((p) => (p.productId || p._id) === showVariantOverlay);
          if (!item) return null;

          const allVariants = Array.isArray(item.variants) ? item.variants : [];
          if (allVariants.length === 0) return null;

          const displayVariant = tempSelectedVariants[showVariantOverlay] || selectedVariants[showVariantOverlay] || (allVariants.find((v) => v.stock > 0) || allVariants[0]) || {};
          const groupedVariants = groupVariantsByType(allVariants);
          const hasColorVariants = groupedVariants.color.length > 0;
          const hasTextVariants = groupedVariants.text.length > 0;
          const isAdding = addingToCart[showVariantOverlay];
          const isCurrentVariantOutOfStock = displayVariant?.stock <= 0;

          return (
            <>
              <div className="mobile-sheet-backdrop" onClick={closeVariantOverlay} />
              <div className="mobile-sheet-container">
                <div className="mobile-sheet-grabber" />
                <div className="mobile-sheet-header">
                  <h3 className="mobile-sheet-title page-title-main-name">Select Option</h3>
                  <button className="mobile-sheet-close-btn" onClick={closeVariantOverlay}>
                    &times;
                  </button>
                </div>
                <div className="mobile-sheet-body">
                  {hasColorVariants && (
                    <div className="mobile-sheet-variants-grid">
                      {groupedVariants.color.map((v) => {
                        const isSelected = displayVariant.sku === v.sku;
                        const isOutOfStock = (v.stock ?? 0) <= 0;
                        const variantText = getVariantDisplayText(v);

                        return (
                          <div
                            key={getSku(v) || v._id}
                            className={`mobile-sheet-variant-item ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantSelect(showVariantOverlay, v);
                                setTempSelectedVariants(prev => ({ ...prev, [showVariantOverlay]: v }));
                              }
                            }}
                          >
                            <div
                              className={`mobile-sheet-color-circle ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}
                              style={{ backgroundColor: v.hex || "#ccc", position: "relative" }}
                            >
                              {isSelected && (
                                <FaCheck className="mobile-sheet-check-icon" />
                              )}
                              {isOutOfStock && (
                                <span style={{
                                  position: 'absolute',
                                  top: 0,
                                  left: 0,
                                  right: 0,
                                  bottom: 0,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'red',
                                  fontWeight: 'bold',
                                  fontSize: '14px',
                                  pointerEvents: 'none',
                                }}>✕</span>
                              )}
                            </div>
                            <span className="mobile-sheet-variant-text">
                              {variantText}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {hasTextVariants && !hasColorVariants && (
                    <div className="mobile-sheet-variants-grid">
                      {groupedVariants.text.map((v) => {
                        const isSelected = displayVariant.sku === v.sku;
                        const isOutOfStock = (v.stock ?? 0) <= 0;
                        const variantText = getVariantDisplayText(v);

                        return (
                          <div
                            key={getSku(v) || v._id}
                            className="mobile-sheet-variant-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOutOfStock) {
                                handleVariantSelect(showVariantOverlay, v);
                                setTempSelectedVariants(prev => ({ ...prev, [showVariantOverlay]: v }));
                              }
                            }}
                          >
                            <button className={`mobile-sheet-text-pill ${isSelected ? "selected" : ""} ${isOutOfStock ? "oos" : ""}`}>
                              <span>{variantText}</span>
                              {isSelected && <FaCheck style={{ fontSize: '10px' }} />}
                              {isOutOfStock && (
                                <span style={{
                                  color: 'red',
                                  fontWeight: 'bold',
                                  marginLeft: '6px',
                                  fontSize: '12px',
                                }}>✕</span>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Price & Info */}
                <div className="mobile-sheet-footer">
                  <div className="mobile-sheet-footer-left">
                    <span className="mobile-sheet-selected-label">
                      {getVariantDisplayText(displayVariant)}
                    </span>
                    <div className="mobile-sheet-price-row">
                      <span className="mobile-sheet-current-price">
                        {formatPrice(displayVariant.displayPrice || item.price)}
                      </span>
                      {displayVariant.originalPrice > displayVariant.displayPrice && (
                        <>
                          <span className="mobile-sheet-original-price">
                            {formatPrice(displayVariant.originalPrice)}
                          </span>
                          <span className="mobile-sheet-discount">
                            ({Math.round(((displayVariant.originalPrice - displayVariant.displayPrice) / displayVariant.originalPrice) * 100)}% OFF)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    className="mobile-sheet-view-details"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${getProductSlug(item)}`);
                      closeVariantOverlay();
                    }}
                  >
                    View Details
                  </span>
                </div>

                {/* Add to Bag Button */}
                <div className="mobile-sheet-action-wrap">
                  <button
                    className="mobile-sheet-btn-add"
                    disabled={isAdding || isCurrentVariantOutOfStock}
                    onClick={async (e) => {
                      e.stopPropagation();
                      const chosen = tempSelectedVariants[showVariantOverlay] || selectedVariants[showVariantOverlay] || (allVariants.find((v) => v.stock > 0) || allVariants[0]);
                      if (chosen) {
                        handleVariantSelect(showVariantOverlay, chosen);
                      }
                      await handleAddToCart(item, chosen);
                      closeVariantOverlay();
                    }}
                  >
                    {isAdding ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span> Adding...
                      </>
                    ) : isCurrentVariantOutOfStock ? (
                      "Out of Stock"
                    ) : (
                      "Add to Bag"
                    )}
                  </button>
                </div>
              </div>
            </>
          );
        })()}

      </main>

      <Footer />
    </div>
  );
};

export default SkinDiagnosis;
