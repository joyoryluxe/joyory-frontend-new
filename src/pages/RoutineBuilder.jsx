// src/component/RoutineBuilder.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  FaSun, 
  FaMoon, 
  FaClock, 
  FaTrash, 
  FaEdit, 
  FaShareAlt, 
  FaPlus, 
  FaCheck, 
  FaCartPlus, 
  FaArrowUp, 
  FaArrowDown, 
  FaInfoCircle, 
  FaMagic, 
  FaArrowLeft,
  FaSearch,
  FaCalendarAlt,
  FaChartLine,
  FaImages,
  FaHeart,
  FaExclamationTriangle,
  FaBullseye,
  FaSave
} from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance.js";
import { UserContext } from "../context/UserContext";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import Sidebarcomon from "../components/common/SidebarCommon";
import "../styles/RoutineBuilder.css";

const SKINCARE_LAYER_ORDER = [
  "cleanser", "toner", "essence", "serum", "ampoule",
  "eye cream", "moisturizer", "cream", "face oil", "sunscreen", "spf",
  "primer", "foundation", "concealer", "blush", "highlight", "setting spray"
];

function guessSkincarePriority(productName, tags = []) {
  const text = `${productName} ${(tags || []).join(" ")}`.toLowerCase();
  for (let i = 0; i < SKINCARE_LAYER_ORDER.length; i++) {
    if (text.includes(SKINCARE_LAYER_ORDER[i])) return i;
  }
  return SKINCARE_LAYER_ORDER.length; // unknown goes to end
}

// Convert Date to local YYYY-MM-DD
const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

const RoutineBuilder = () => {
  const { shareToken } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(UserContext);

  // --- Core States ---
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my"); // "my", "builder", or "tracker"
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // --- Shared / Public View State ---
  const [publicRoutine, setPublicRoutine] = useState(null);

  // --- Customizer Form State ---
  const [editingRoutineId, setEditingRoutineId] = useState(null);
  const [routineName, setRoutineName] = useState("");
  const [routineDesc, setRoutineDesc] = useState("");
  const [routineType, setRoutineType] = useState("skincare");
  const [timeOfDay, setTimeOfDay] = useState("AM");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [steps, setSteps] = useState([]);
  const [isAISuggested, setIsAISuggested] = useState(false);
  
  // New Goal Fields
  const [routineGoal, setRoutineGoal] = useState("general_wellness");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [startDate, setStartDate] = useState(getTodayDateString());

  // --- Step Search Dropdowns States ---
  const [searchQueries, setSearchQueries] = useState({});
  const [showDropdown, setShowDropdown] = useState({});

  // --- Progress Tracker Active States ---
  const [activeTrackerRoutine, setActiveTrackerRoutine] = useState(null);
  const [trackerTab, setTrackerTab] = useState("checkin"); // "checkin", "trends", "diary"
  const [trackerLogs, setTrackerLogs] = useState([]);
  const [trackerStats, setTrackerStats] = useState({
    currentDay: 1,
    durationDays: 30,
    complianceRate: 0,
    amCompletedCount: 0,
    pmCompletedCount: 0,
  });
  const [ratingsTrend, setRatingsTrend] = useState([]);
  const [photoGallery, setPhotoGallery] = useState([]);

  // Checkin Entry Form
  const [logDate, setLogDate] = useState(getTodayDateString());
  const [amCompleted, setAmCompleted] = useState(false);
  const [pmCompleted, setPmCompleted] = useState(false);
  const [skinRating, setSkinRating] = useState(0);
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryPhotoUrl, setDiaryPhotoUrl] = useState("");
  const [isSavingLog, setIsSavingLog] = useState(false);

  // --- Load User Routines ---
  const fetchMyRoutines = async () => {
    if (!user || user.guest) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/user/routines/my");
      if (res.data && res.data.routines) {
        setRoutines(res.data.routines);
      }
    } catch (err) {
      console.error("Error fetching routines:", err);
      toast.error("Failed to load your routines.");
    } finally {
      setLoading(false);
    }
  };

  // --- Load Catalog Products for Selector ---
  const fetchCatalogProducts = async () => {
    if (allProducts.length > 0 || productsLoading) return;
    try {
      setProductsLoading(true);
      let allFetchedProducts = [];
      let currentCursor = null;
      let hasMore = true;

      // Fetch up to 500 products for local indexing
      const res = await axiosInstance.get("/api/user/products/all", {
        params: { cursor: currentCursor, limit: 250 },
        withCredentials: true
      });

      let products = [];
      if (res.data && Array.isArray(res.data.products)) {
        products = res.data.products;
      } else if (Array.isArray(res.data)) {
        products = res.data;
      }

      if (products.length > 0) {
        allFetchedProducts = products;
      }

      // Deduplicate
      const productMap = new Map();
      allFetchedProducts.forEach(p => {
        const id = p._id || p.id;
        if (id) productMap.set(id, p);
      });
      setAllProducts(Array.from(productMap.values()));
    } catch (err) {
      console.error("Error fetching catalog products:", err);
    } finally {
      setProductsLoading(false);
    }
  };

  // --- Load Public Routine ---
  const fetchPublicRoutine = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/user/routines/public/${shareToken}`);
      if (res.data && res.data.routine) {
        setPublicRoutine(res.data.routine);
      }
    } catch (err) {
      console.error("Error loading public routine:", err);
      toast.error("Public routine not found or has been made private.");
    } finally {
      setLoading(false);
    }
  };

  // --- Effects ---
  useEffect(() => {
    if (shareToken) {
      fetchPublicRoutine();
    } else if (!authLoading) {
      if (user && !user.guest) {
        fetchMyRoutines();
        fetchCatalogProducts();
      } else {
        setLoading(false);
      }
    }
  }, [shareToken, user, authLoading]);

  // --- Handle Goal Change Default Milestone Titles ---
  const handleGoalChange = (newGoal) => {
    setRoutineGoal(newGoal);
    let days = durationDays || 30;
    if (newGoal === "acne_clearance") {
      setMilestoneTitle(`${days}-Day Acne Clearing & Pore Journey`);
    } else if (newGoal === "dark_spot_fading") {
      setMilestoneTitle(`${days}-Day Intense Brightening Journey`);
    } else if (newGoal === "anti_aging") {
      setMilestoneTitle(`${days}-Day Youth Renewal & Collagen Boost`);
    } else if (newGoal === "hydration") {
      setMilestoneTitle(`${days}-Day Deep Moisture Journey`);
    } else if (newGoal === "barrier_repair") {
      setMilestoneTitle(`${days}-Day Skin Barrier Calming Journey`);
    } else {
      setMilestoneTitle(`${days}-Day Skincare Wellness Journey`);
    }
  };

  // --- AI Suggestion Flow ---
  const handleGetAISuggestion = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/user/routines/suggest");
      if (res.data && res.data.success) {
        const suggested = res.data;
        // Map suggested steps to form steps
        const newSteps = suggested.steps.map((s, idx) => {
          const matchedProd = allProducts.find(p => String(p._id) === String(s.product)) || {
            _id: s.product,
            name: s.productName,
            variants: [{ sku: s.selectedSku, images: [s.productImage] }],
            howToUse: [s.applicationTip]
          };

          return {
            product: s.product,
            productName: s.productName,
            productImage: s.productImage,
            selectedSku: s.selectedSku,
            note: "AI recommended step",
            applicationTip: s.applicationTip,
            timeOfDay: s.timeOfDay || "both",
            allergenAlert: s.allergenAlert || false,
            allergenAlertMessage: s.allergenAlertMessage || null,
            variants: matchedProd.variants || []
          };
        });

        // Open customizer filled with suggestions
        setEditingRoutineId(null);
        setRoutineName(suggested.milestoneTitle || `My Suggested Routine`);
        setRoutineDesc(suggested.tip || "AI recommended sequence.");
        setRoutineType("skincare");
        setTimeOfDay("AM+PM");
        setEstimatedMinutes(10);
        setRoutineGoal(suggested.goal || "general_wellness");
        setMilestoneTitle(suggested.milestoneTitle || "30-Day Daily Glow Journey");
        setDurationDays(suggested.durationDays || 30);
        setStartDate(getTodayDateString());
        setSteps(newSteps);
        setIsAISuggested(true);
        setActiveTab("builder");
        toast.success("AI suggested goal routine loaded! Customize it below.");
      }
    } catch (err) {
      console.error("AI suggest error:", err);
      if (err.response?.status === 400) {
        toast.info("Please complete your skincare quiz first.");
        const quizConfirm = window.confirm("You need to complete the skincare quiz first. Take it now?");
        if (quizConfirm) navigate("/Makeupquiz");
      } else {
        toast.error(err.response?.data?.message || "Failed to generate AI suggestions.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Add Entire Routine to Cart ---
  const handleAddRoutineToCart = async (routineId) => {
    try {
      const id = routineId || (publicRoutine && publicRoutine._id);
      if (!id) return;
      
      if (!user || user.guest) {
        toast.info("Please log in to add items to your cart.");
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }

      const res = await axiosInstance.post(`/api/user/routines/${id}/add-to-cart`);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Routine products added to cart!");
      }
    } catch (err) {
      console.error("Add routine to cart error:", err);
      toast.error("Failed to add routine products to cart.");
    }
  };

  // --- Share Routine ---
  const handleShareRoutine = async (id) => {
    try {
      const res = await axiosInstance.post(`/api/user/routines/${id}/share`);
      if (res.data && res.data.shareToken) {
        const shareUrl = `${window.location.origin}/routines/${res.data.shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard! ✨");
        fetchMyRoutines();
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to generate share link.");
    }
  };

  // --- Edit Routine Load ---
  const handleEditRoutine = (routine) => {
    setEditingRoutineId(routine._id);
    setRoutineName(routine.name);
    setRoutineDesc(routine.description || "");
    setRoutineType(routine.routineType || "skincare");
    setTimeOfDay(routine.timeOfDay || "AM");
    setEstimatedMinutes(routine.estimatedMinutes || "");
    setIsAISuggested(routine.isAISuggested || false);
    
    // Set Goals Info
    setRoutineGoal(routine.goal || "general_wellness");
    setMilestoneTitle(routine.milestoneTitle || "");
    setDurationDays(routine.durationDays || 30);
    setStartDate(routine.startDate ? routine.startDate.split('T')[0] : getTodayDateString());

    // Map routine steps (with product ref populated or snapshots)
    const formSteps = routine.steps.map(s => {
      const matchedProd = allProducts.find(p => String(p._id) === String(s.product?._id || s.product)) || {};
      return {
        product: s.product?._id || s.product,
        productName: s.productName || s.product?.name || "Unknown Product",
        productImage: s.productImage || s.product?.variants?.[0]?.images?.[0] || "",
        selectedSku: s.selectedSku || s.product?.variants?.[0]?.sku || "",
        note: s.note || "",
        applicationTip: s.applicationTip || s.product?.howToUse?.[0] || "",
        timeOfDay: s.timeOfDay || "both",
        allergenAlert: s.allergenAlert || false,
        allergenAlertMessage: s.allergenAlertMessage || null,
        variants: matchedProd.variants || s.product?.variants || []
      };
    });

    setSteps(formSteps);
    setActiveTab("builder");
  };

  // --- Delete Routine ---
  const handleDeleteRoutine = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this routine?");
    if (!confirmDelete) return;

    try {
      const res = await axiosInstance.delete(`/api/user/routines/${id}`);
      if (res.data && res.data.success) {
        toast.success("Routine deleted.");
        fetchMyRoutines();
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete routine.");
    }
  };

  // --- Open Daily Progress Tracker ---
  const handleOpenTracker = async (routine) => {
    setActiveTrackerRoutine(routine);
    setActiveTab("tracker");
    setTrackerTab("checkin");
    setLogDate(getTodayDateString());
    resetCheckinForm();
    await fetchRoutineLogs(routine._id);
  };

  const fetchRoutineLogs = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/user/routines/${id}/logs`);
      if (res.data && res.data.success) {
        setTrackerLogs(res.data.logs || []);
        setTrackerStats(res.data.stats || {
          currentDay: 1,
          durationDays: 30,
          complianceRate: 0,
          amCompletedCount: 0,
          pmCompletedCount: 0,
        });
        setRatingsTrend(res.data.ratingsTrend || []);
        setPhotoGallery(res.data.photoGallery || []);
        
        // Prefill check-in inputs if log already exists for today
        const todayLog = (res.data.logs || []).find(l => l.dateString === getTodayDateString());
        if (todayLog) {
          setAmCompleted(todayLog.amCompleted);
          setPmCompleted(todayLog.pmCompleted);
          setSkinRating(todayLog.skinRating || 0);
          setDiaryNote(todayLog.notes || "");
          setDiaryPhotoUrl(todayLog.photoUrl || "");
        }
      }
    } catch (err) {
      console.error("Fetch logs error:", err);
      toast.error("Failed to fetch tracking history.");
    } finally {
      setLoading(false);
    }
  };

  // Triggered when date selection changes in check-in form
  const handleTrackerDateChange = (dateStr) => {
    setLogDate(dateStr);
    const dateLog = trackerLogs.find(l => l.dateString === dateStr);
    if (dateLog) {
      setAmCompleted(dateLog.amCompleted);
      setPmCompleted(dateLog.pmCompleted);
      setSkinRating(dateLog.skinRating || 0);
      setDiaryNote(dateLog.notes || "");
      setDiaryPhotoUrl(dateLog.photoUrl || "");
    } else {
      resetCheckinForm();
    }
  };

  const resetCheckinForm = () => {
    setAmCompleted(false);
    setPmCompleted(false);
    setSkinRating(0);
    setDiaryNote("");
    setDiaryPhotoUrl("");
  };

  // --- Save Daily Activity Log ---
  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    if (!activeTrackerRoutine) return;

    try {
      setIsSavingLog(true);
      const payload = {
        dateString: logDate,
        amCompleted,
        pmCompleted,
        skinRating: skinRating > 0 ? skinRating : null,
        notes: diaryNote.trim() || null,
        photoUrl: diaryPhotoUrl.trim() || null
      };

      const res = await axiosInstance.post(`/api/user/routines/${activeTrackerRoutine._id}/log`, payload);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Daily progress check-in logged! 🌸");
        // Reload logs list to update graphs
        await fetchRoutineLogs(activeTrackerRoutine._id);
        fetchMyRoutines(); // Refresh index compliance rates
      }
    } catch (err) {
      console.error("Save log error:", err);
      toast.error("Failed to save progress check-in.");
    } finally {
      setIsSavingLog(false);
    }
  };

  // --- Step Fields Handlers ---
  const handleAddStep = () => {
    setSteps([
      ...steps,
      {
        product: "",
        productName: "",
        productImage: "",
        selectedSku: "",
        note: "",
        applicationTip: "",
        timeOfDay: "both",
        allergenAlert: false,
        allergenAlertMessage: null,
        variants: []
      }
    ]);
  };

  const handleRemoveStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  const handleMoveStep = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === steps.length - 1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updated = [...steps];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setSteps(updated);
  };

  const handleStepProductSelect = (stepIdx, product) => {
    const updated = [...steps];
    const image = product.selectedVariant?.images?.[0] || product.variants?.[0]?.images?.[0] || product.image || "";
    const sku = product.selectedVariant?.sku || product.variants?.[0]?.sku || "";
    const tip = product.howToUse?.[0] || "";

    updated[stepIdx] = {
      product: product._id,
      productName: product.name,
      productImage: image,
      selectedSku: sku,
      note: updated[stepIdx].note || "",
      applicationTip: tip,
      timeOfDay: updated[stepIdx].timeOfDay || "both",
      allergenAlert: false,
      allergenAlertMessage: null,
      variants: product.variants || []
    };

    setSteps(updated);
    
    // Clear search dropdown
    setSearchQueries(prev => ({ ...prev, [stepIdx]: "" }));
    setShowDropdown(prev => ({ ...prev, [stepIdx]: false }));
  };

  const handleStepVariantChange = (stepIdx, sku) => {
    const updated = [...steps];
    const step = updated[stepIdx];
    step.selectedSku = sku;
    
    const matchedVariant = step.variants?.find(v => v.sku === sku);
    if (matchedVariant && matchedVariant.images?.[0]) {
      step.productImage = matchedVariant.images[0];
    }
    setSteps(updated);
  };

  const handleStepTextChange = (stepIdx, field, val) => {
    const updated = [...steps];
    updated[stepIdx][field] = val;
    setSteps(updated);
  };

  // --- Auto-Sort by Layering Logic ---
  const handleAutoSort = () => {
    if (steps.length <= 1) return;
    const sorted = [...steps].sort((a, b) => {
      const matchedA = allProducts.find(p => String(p._id) === String(a.product)) || {};
      const matchedB = allProducts.find(p => String(p._id) === String(b.product)) || {};
      
      const priorityA = guessSkincarePriority(a.productName, matchedA.productTags || matchedA.tags);
      const priorityB = guessSkincarePriority(b.productName, matchedB.productTags || matchedB.tags);
      return priorityA - priorityB;
    });

    setSteps(sorted);
    toast.success("Steps sorted by layering order! 🧴✨");
  };

  // --- Save / Create Routine Submit ---
  const handleSaveRoutine = async (e) => {
    e.preventDefault();

    if (!routineName.trim()) {
      toast.warn("Routine name is required.");
      return;
    }
    if (steps.length === 0) {
      toast.warn("Add at least one product step.");
      return;
    }

    const invalidStep = steps.findIndex(s => !s.product);
    if (invalidStep !== -1) {
      toast.warn(`Please select a product for Step ${invalidStep + 1}.`);
      return;
    }

    const formattedSteps = steps.map((s, idx) => ({
      stepOrder: idx + 1,
      stepLabel: s.stepLabel || `Step ${idx + 1}`,
      product: s.product,
      productName: s.productName,
      productImage: s.productImage,
      selectedSku: s.selectedSku,
      note: s.note,
      applicationTip: s.applicationTip,
      timeOfDay: s.timeOfDay
    }));

    const payload = {
      name: routineName.trim(),
      description: routineDesc.trim() || null,
      timeOfDay,
      routineType,
      estimatedMinutes: estimatedMinutes ? parseInt(estimatedMinutes) : null,
      steps: formattedSteps,
      isAISuggested,
      goal: routineGoal,
      milestoneTitle: milestoneTitle.trim() || null,
      durationDays: durationDays ? parseInt(durationDays) : 30,
      startDate: startDate ? new Date(startDate) : new Date()
    };

    try {
      setLoading(true);
      if (editingRoutineId) {
        const res = await axiosInstance.put(`/api/user/routines/${editingRoutineId}`, payload);
        if (res.data && res.data.success) {
          toast.success("Routine updated successfully ✨");
        }
      } else {
        const res = await axiosInstance.post("/api/user/routines/create", payload);
        if (res.data && res.data.success) {
          toast.success("Routine created successfully ✨");
        }
      }

      resetForm();
      setActiveTab("my");
      fetchMyRoutines();
    } catch (err) {
      console.error("Save routine error:", err);
      toast.error(err.response?.data?.message || "Server error while saving routine.");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingRoutineId(null);
    setRoutineName("");
    setRoutineDesc("");
    setRoutineType("skincare");
    setTimeOfDay("AM");
    setEstimatedMinutes("");
    setSteps([]);
    setIsAISuggested(false);
    setRoutineGoal("general_wellness");
    setMilestoneTitle("");
    setDurationDays(30);
    setStartDate(getTodayDateString());
  };

  // --- Filtering Products ---
  const getFilteredProducts = (queryText) => {
    if (!queryText || !queryText.trim()) return [];
    const term = queryText.toLowerCase().trim();
    return allProducts.filter(p => {
      const nameMatch = p.name?.toLowerCase().includes(term);
      const brandMatch = typeof p.brand === "string" ? p.brand.toLowerCase().includes(term) : p.brand?.name?.toLowerCase().includes(term);
      const categoryMatch = typeof p.category === "string" ? p.category.toLowerCase().includes(term) : p.category?.name?.toLowerCase().includes(term);
      return nameMatch || brandMatch || categoryMatch;
    }).slice(0, 5);
  };

  const formatGoalName = (goalCode) => {
    const map = {
      acne_clearance: "Acne Clearance",
      dark_spot_fading: "Dark Spot Fading",
      barrier_repair: "Skin Barrier Repair",
      anti_aging: "Youth Renewal",
      hydration: "Deep Hydration",
      general_wellness: "General Wellness"
    };
    return map[goalCode] || "General Skincare";
  };

  // Render cell color for calendar compliance day
  const getCellClassName = (dayNum) => {
    // Find log index matching this relative day number from startDate
    if (!activeTrackerRoutine) return "";
    const start = new Date(activeTrackerRoutine.startDate);
    const cellDate = new Date(start.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
    const dateStr = cellDate.toISOString().split('T')[0];
    
    const log = trackerLogs.find(l => l.dateString === dateStr);
    if (!log) return "";
    
    if (log.amCompleted && log.pmCompleted) return "both";
    if (log.amCompleted || log.pmCompleted) return "half";
    return "none";
  };

  // ==========================================
  // RENDER: Public Shared Routine View
  // ==========================================
  if (shareToken) {
    if (loading) {
      return (
        <>
          <Header />
          <div className="rb-loader-container page-title-main-name">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading shared routine...</span>
            </div>
            <p className="mt-3">Unlocking routine details...</p>
          </div>
          <Footer />
        </>
      );
    }

    if (!publicRoutine) {
      return (
        <>
          <Header />
          <div className="rb-container text-center py-5 page-title-main-name">
            <h3>Shared Routine Not Found</h3>
            <p className="text-muted">This routine is private, expired, or doesn't exist.</p>
            <button className="rb-btn-primary mt-3" onClick={() => navigate("/")}>Go Home</button>
          </div>
          <Footer />
        </>
      );
    }

    return (
      <>
        <Header />
        <div className="rb-public-layout page-title-main-name">
          <div className="rb-public-card">
            
            <div className="rb-public-hero">
              {publicRoutine.user?.profileImage ? (
                <img 
                  src={publicRoutine.user.profileImage} 
                  alt={publicRoutine.user.name || "User"} 
                  className="rb-public-avatar"
                />
              ) : (
                <div className="rb-public-avatar d-inline-flex align-items-center justify-content-center bg-secondary text-white font-weight-bold" style={{ fontSize: "1.5rem" }}>
                  {(publicRoutine.user?.name || "J") [0].toUpperCase()}
                </div>
              )}
              <div className="rb-public-author">Curated By {publicRoutine.user?.name || "Joyory Creator"}</div>
              <h1 className="rb-public-title">{publicRoutine.name}</h1>
              {publicRoutine.milestoneTitle && (
                <div className="rb-public-milestone">🎯 Journey: {publicRoutine.milestoneTitle} ({publicRoutine.durationDays} Days)</div>
              )}
              {publicRoutine.description && (
                <p className="rb-public-desc">{publicRoutine.description}</p>
              )}

              <div className="rb-public-meta-row">
                <span className="rb-badge rb-badge-time">
                  {publicRoutine.timeOfDay}
                </span>
                <span className="rb-badge rb-badge-type">{publicRoutine.routineType}</span>
                <span className="rb-badge rb-badge-goal">{formatGoalName(publicRoutine.goal)}</span>
                {publicRoutine.estimatedMinutes && (
                  <span className="rb-duration">
                    <FaClock /> {publicRoutine.estimatedMinutes} mins
                  </span>
                )}
              </div>

              <div className="mt-4">
                <button className="rb-btn-primary d-inline-flex align-items-center gap-2" onClick={() => handleAddRoutineToCart()}>
                  <FaCartPlus /> Add Entire Routine to Cart
                </button>
              </div>
            </div>

            <div className="rb-public-steps-container">
              <h3 className="mb-4">Routine Sequence ({publicRoutine.steps?.length} Steps)</h3>
              <div className="rb-public-steps">
                {publicRoutine.steps.map((step, idx) => (
                  <div key={idx} className="rb-public-step-item">
                    <div className="rb-public-step-num">{step.stepOrder}</div>
                    
                    <div className="rb-public-step-details">
                      {step.productImage && (
                        <img 
                          src={step.productImage} 
                          alt={step.productName} 
                          className="rb-public-step-img"
                        />
                      )}
                      
                      <div className="rb-public-step-info">
                        <div className="rb-public-step-label">
                          {step.stepLabel || `Step ${idx+1}`}
                          {step.timeOfDay && step.timeOfDay !== "both" && ` (${step.timeOfDay} only)`}
                        </div>
                        <h4 className="rb-public-step-pname">
                          {step.product?.slug ? (
                            <Link to={`/product/${step.product.slug}`}>{step.productName}</Link>
                          ) : (
                            step.productName
                          )}
                        </h4>
                        
                        {step.selectedSku && (
                          <div className="rb-public-step-variant">
                            SKU: {step.selectedSku}
                          </div>
                        )}

                        {step.allergenAlert && (
                          <div className="rb-allergen-alert-box alert-danger">
                            <FaExclamationTriangle /> <strong>Allergen Warning:</strong> {step.allergenAlertMessage || "Matches your sensitive/allergy profile."}
                          </div>
                        )}

                        {step.note && (
                          <div className="rb-public-step-note">
                            <strong>My Note:</strong> {step.note}
                          </div>
                        )}

                        {step.applicationTip && (
                          <div className="rb-public-step-tip">
                            <strong>Application Tip:</strong> {step.applicationTip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5 pt-4 border-top">
                <p className="text-muted">Want to create your own customized routine?</p>
                <button className="rb-btn-secondary" onClick={() => navigate("/routines")}>
                  Open Routine Builder
                </button>
              </div>

            </div>

          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ==========================================
  // RENDER: Dashboard Logged-In Flow
  // ==========================================
  return (
    <>
      <Header />

      <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <h3 className="ua-title ms-4 page-title-main-name">Routine Builder</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <section className="ua-card">
            
            {authLoading || loading ? (
              <div className="rb-loader-container page-title-main-name">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading Routine Tracker...</span>
                </div>
                <p className="mt-3">Analyzing beauty schedules...</p>
              </div>
            ) : !user || user.guest ? (
              <div className="rb-login-card page-title-main-name">
                <span className="rb-login-icon">🧴</span>
                <h2>Unlock Routine Builder & Tracker</h2>
                <p>
                  Log in to create bespoke skincare, makeup, and haircare sequences. 
                  Leverage AI analysis based on your cosmetic profile, perform daily AM/PM logs,
                  track skin satisfaction ratings, and monitor allergen matches instantly.
                </p>
                <button className="rb-btn-primary" onClick={() => navigate("/login", { state: { from: "/routines" } })}>
                  Login / Sign Up
                </button>
              </div>
            ) : (
              <div className="rb-container page-title-main-name">
                
                {/* Dashboard Header Section with Tabs */}
                {activeTab !== "tracker" && (
                  <div className="rb-header-section">
                    <div className="rb-tabs">
                      <button 
                        className={`rb-tab-btn ${activeTab === "my" ? "active" : ""}`}
                        onClick={() => { resetForm(); setActiveTab("my"); }}
                      >
                        My Routines ({routines.length})
                      </button>
                      <button 
                        className={`rb-tab-btn ${activeTab === "builder" ? "active" : ""}`}
                        onClick={() => { resetForm(); setActiveTab("builder"); }}
                      >
                        {editingRoutineId ? "Edit Routine" : "Custom Builder"}
                      </button>
                    </div>

                    {activeTab === "my" && (
                      <button className="rb-create-btn" onClick={() => { resetForm(); setActiveTab("builder"); }}>
                        <FaPlus /> Build Custom
                      </button>
                    )}
                  </div>
                )}

                {/* Tab Content: My Saved Routines Dashboard */}
                {activeTab === "my" && (
                  <div>
                    {/* AI Suggestion Banner */}
                    <div className="rb-ai-banner">
                      <div className="rb-ai-banner-content">
                        <h4><FaMagic style={{ color: "var(--joyory-gold)" }} /> AI Goal Journey Suggestion</h4>
                        <p>Unlock a dermatological suggested skincare journey matching your skin goals, checking for matched allergies.</p>
                      </div>
                      <button className="rb-ai-btn d-flex align-items-center gap-2" onClick={handleGetAISuggestion}>
                        <FaMagic /> Suggest Journey
                      </button>
                    </div>

                    {/* Routines Grid */}
                    {routines.length === 0 ? (
                      <div className="text-center py-5 border rounded-lg bg-light" style={{ borderStyle: "dashed !important" }}>
                        <span style={{ fontSize: "3rem" }}>🪞</span>
                        <h4 className="mt-3">No routines created yet</h4>
                        <p className="text-muted">Use the Custom Builder or suggest an AI routine to begin tracking.</p>
                      </div>
                    ) : (
                      <div className="rb-routines-grid">
                        {routines.map(routine => (
                          <div key={routine._id} className="rb-routine-card">
                            
                            <div className="rb-card-header">
                              <div>
                                <div className="rb-card-badges">
                                  <span className="rb-badge rb-badge-time">{routine.timeOfDay}</span>
                                  <span className="rb-badge rb-badge-goal">{formatGoalName(routine.goal)}</span>
                                  {routine.isAISuggested && (
                                    <span className="rb-badge rb-badge-ai">AI</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="rb-card-actions">
                                <button className="rb-icon-btn" title="Track Progress" onClick={() => handleOpenTracker(routine)}>
                                  <FaCalendarAlt />
                                </button>
                                <button className="rb-icon-btn" title="Edit Routine" onClick={() => handleEditRoutine(routine)}>
                                  <FaEdit />
                                </button>
                                <button className="rb-icon-btn" title="Share Routine" onClick={() => handleShareRoutine(routine._id)}>
                                  <FaShareAlt />
                                </button>
                                <button className="rb-icon-btn delete" title="Delete Routine" onClick={() => handleDeleteRoutine(routine._id)}>
                                  <FaTrash />
                                </button>
                              </div>
                            </div>

                            <div className="rb-card-body">
                              <h3 onClick={() => handleOpenTracker(routine)}>{routine.name}</h3>
                              {routine.milestoneTitle && (
                                <div className="rb-card-milestone">🎯 {routine.milestoneTitle}</div>
                              )}
                              {routine.description && (
                                <p className="rb-card-desc">{routine.description}</p>
                              )}

                              {/* Progress bar info */}
                              <div className="rb-card-progress-bar-container">
                                <div 
                                  className="rb-card-progress-bar-fill" 
                                  style={{ width: `${routine.complianceRate || 0}%` }}
                                />
                              </div>
                              <div className="rb-card-progress-meta">
                                <span>Day {routine.currentDay || 1} of {routine.durationDays || 30}</span>
                                <span>{routine.complianceRate || 0}% Consistency</span>
                              </div>

                              {/* Step Products Preview */}
                              <div className="rb-products-preview">
                                {routine.steps?.slice(0, 5).map((step, idx) => (
                                  step.productImage && (
                                    <img 
                                      key={idx}
                                      src={step.productImage} 
                                      alt={step.productName} 
                                      className="rb-preview-img"
                                      title={step.productName}
                                    />
                                  )
                                ))}
                                {routine.steps?.length > 5 && (
                                  <span className="rb-steps-count">+{routine.steps.length - 5} steps</span>
                                )}
                              </div>
                            </div>

                            <div className="rb-card-footer">
                              <button className="rb-btn-secondary" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => handleOpenTracker(routine)}>
                                Track Journey
                              </button>
                              <button className="rb-create-btn" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => handleAddRoutineToCart(routine._id)}>
                                <FaCartPlus /> Buy products
                              </button>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab Content: Daily Log & Tracker */}
                {activeTab === "tracker" && activeTrackerRoutine && (
                  <div>
                    {/* Back Button and Journey Header */}
                    <div className="d-flex align-items-center gap-3 mb-4">
                      <button className="rb-icon-btn" style={{ background: "#eaeaea" }} onClick={() => { setActiveTrackerRoutine(null); setActiveTab("my"); }}>
                        <FaArrowLeft />
                      </button>
                      <div>
                        <h2 className="mb-0 font-weight-bold" style={{ fontSize: "1.6rem" }}>{activeTrackerRoutine.name}</h2>
                        <span className="text-muted font-weight-bold" style={{ fontSize: "0.9rem" }}>
                          🎯 Goal: {formatGoalName(activeTrackerRoutine.goal)} | Milestone: {activeTrackerRoutine.milestoneTitle}
                        </span>
                      </div>
                    </div>

                    {/* Tracker Tabs */}
                    <div className="rb-tabs mb-4">
                      <button 
                        className={`rb-tab-btn ${trackerTab === "checkin" ? "active" : ""}`}
                        onClick={() => setTrackerTab("checkin")}
                      >
                        <FaCalendarAlt style={{ marginRight: "6px" }} /> Daily Check-In
                      </button>
                      <button 
                        className={`rb-tab-btn ${trackerTab === "trends" ? "active" : ""}`}
                        onClick={() => setTrackerTab("trends")}
                      >
                        <FaChartLine style={{ marginRight: "6px" }} /> Skin Trends
                      </button>
                      <button 
                        className={`rb-tab-btn ${trackerTab === "diary" ? "active" : ""}`}
                        onClick={() => setTrackerTab("diary")}
                      >
                        <FaImages style={{ marginRight: "6px" }} /> Progress Diary
                      </button>
                    </div>

                    {/* Tracker Sub-Tabs Content */}
                    <div className="rb-tracker-grid">
                      
                      {/* Left: General Tracker Stats Widget */}
                      <div className="d-flex flex-column gap-3">
                        <div className="rb-tracker-stats-row">
                          <div className="rb-tracker-stat-box">
                            <div className="rb-tracker-stat-val">Day {trackerStats.currentDay}</div>
                            <div className="rb-tracker-stat-lbl">Journey Day</div>
                          </div>
                          <div className="rb-tracker-stat-box">
                            <div className="rb-tracker-stat-val">{trackerStats.complianceRate}%</div>
                            <div className="rb-tracker-stat-lbl">Compliance</div>
                          </div>
                        </div>

                        <div className="rb-tracker-stat-box text-left">
                          <div className="d-flex justify-content-between mb-2">
                            <span>AM Cleanse/Care:</span>
                            <strong>{trackerStats.amCompletedCount} Completed</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>PM Night Active:</span>
                            <strong>{trackerStats.pmCompletedCount} Completed</strong>
                          </div>
                        </div>

                        <button className="rb-create-btn justify-content-center" onClick={() => handleAddRoutineToCart(activeTrackerRoutine._id)}>
                          <FaCartPlus /> Buy Routine Set
                        </button>
                      </div>

                      {/* Right Dynamic Section */}
                      <div className="w-100">
                        
                        {/* Tab 1: Check-in & Compliance Calendar Grid */}
                        {trackerTab === "checkin" && (
                          <div className="d-flex flex-column gap-4">
                            
                            {/* Check-In Logging Form */}
                            <form onSubmit={handleSaveDailyLog} className="rb-checkin-card">
                              <h3>Daily Check-In Log</h3>
                              
                              <div className="rb-checkin-date-picker">
                                <label className="rb-label mb-2">Check-in Date:</label>
                                <input 
                                  type="date" 
                                  value={logDate} 
                                  onChange={(e) => handleTrackerDateChange(e.target.value)}
                                  className="rb-input w-100"
                                />
                              </div>

                              <label className="rb-label mb-2">Completion Status:</label>
                              <div className="rb-checkin-slot-row">
                                <button 
                                  type="button"
                                  className={`rb-slot-toggle-btn am ${amCompleted ? "active" : ""}`}
                                  onClick={() => setAmCompleted(!amCompleted)}
                                >
                                  <FaSun size={20} />
                                  <span>AM Check-In</span>
                                </button>
                                <button 
                                  type="button"
                                  className={`rb-slot-toggle-btn pm ${pmCompleted ? "active" : ""}`}
                                  onClick={() => setPmCompleted(!pmCompleted)}
                                >
                                  <FaMoon size={20} />
                                  <span>PM Check-In</span>
                                </button>
                              </div>

                              <div className="mb-3">
                                <label className="rb-label">Skin Satisfaction Rating (1-5)</label>
                                <div className="rb-rating-stars">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      className={`rb-star-btn ${skinRating >= star ? "active" : ""}`}
                                      onClick={() => setSkinRating(star)}
                                    >
                                      <FaHeart />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="mb-3">
                                <label className="rb-label">Daily Skin Log Notes</label>
                                <input 
                                  type="text" 
                                  placeholder="e.g. Skin felt soft, no redness today" 
                                  value={diaryNote}
                                  onChange={(e) => setDiaryNote(e.target.value)}
                                  className="rb-input w-100"
                                />
                              </div>

                              <div className="mb-4">
                                <label className="rb-label">Progress Photo URL (Visual Skin Diary)</label>
                                <input 
                                  type="url" 
                                  placeholder="Enter progress photo URL" 
                                  value={diaryPhotoUrl}
                                  onChange={(e) => setDiaryPhotoUrl(e.target.value)}
                                  className="rb-input w-100"
                                />
                              </div>

                              <button type="submit" className="rb-btn-primary w-100 d-flex align-items-center justify-content-center gap-2" disabled={isSavingLog}>
                                <FaSave /> {isSavingLog ? "Saving log..." : "Save Daily Log"}
                              </button>

                            </form>

                            {/* Compliance Grid Calendar Map */}
                            <div className="rb-checkin-card">
                              <h3>{activeTrackerRoutine.durationDays}-Day Compliance Journey Calendar</h3>
                              <p className="text-muted" style={{ fontSize: "0.85rem" }}>Monitor logs across the duration of your routine starting from {new Date(activeTrackerRoutine.startDate).toLocaleDateString()}.</p>
                              
                              <div className="rb-compliance-calendar">
                                {Array.from({ length: activeTrackerRoutine.durationDays || 30 }).map((_, i) => {
                                  const cellClass = getCellClassName(i + 1);
                                  return (
                                    <div 
                                      key={i} 
                                      className={`rb-calendar-cell ${cellClass}`}
                                      title={`Day ${i + 1}`}
                                    >
                                      <span>Day {i + 1}</span>
                                      {cellClass && <div className="rb-calendar-day-dot" />}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Calendar cell key legends */}
                              <div className="rb-calendar-legend">
                                <div className="rb-legend-item">
                                  <div className="rb-legend-box" style={{ background: "#c8e6c9" }} />
                                  <span>AM & PM Complete</span>
                                </div>
                                <div className="rb-legend-item">
                                  <div className="rb-legend-box" style={{ background: "#ffe0b2" }} />
                                  <span>Half Complete</span>
                                </div>
                                <div className="rb-legend-item">
                                  <div className="rb-legend-box" style={{ background: "#ffcdd2" }} />
                                  <span>Missed Log</span>
                                </div>
                                <div className="rb-legend-item">
                                  <div className="rb-legend-box" style={{ background: "#fafafa" }} />
                                  <span>No Log</span>
                                </div>
                              </div>

                            </div>

                          </div>
                        )}

                        {/* Tab 2: Skin Rating Trends Bar Chart */}
                        {trackerTab === "trends" && (
                          <div className="rb-trend-chart-container">
                            <h3>Skin Satisfaction Rating Trend (1-5 Scale)</h3>
                            <p className="text-muted" style={{ fontSize: "0.85rem" }}>Visualize day-to-day skin improvements recorded in check-in logs.</p>
                            
                            {ratingsTrend.length === 0 ? (
                              <div className="text-center py-5 text-muted">
                                No ratings logged yet. Track progress and add skin scores in the check-in tab.
                              </div>
                            ) : (
                              <div className="rb-trend-chart-bars">
                                {ratingsTrend.map((log, idx) => (
                                  <div key={idx} className="rb-trend-bar-col">
                                    <div 
                                      className="rb-trend-bar-fill"
                                      data-rating={log.rating}
                                      style={{ height: `${(log.rating / 5) * 100}%` }}
                                    />
                                    <span className="rb-trend-bar-date">{log.date.substring(5)}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tab 3: Photo Diary Progress Gallery */}
                        {trackerTab === "diary" && (
                          <div>
                            <h3>Visual Skin Progress Photo Gallery</h3>
                            <p className="text-muted" style={{ fontSize: "0.85rem" }}>A history of your before & after skin recovery journey.</p>
                            
                            {photoGallery.length === 0 ? (
                              <div className="text-center py-5 border rounded-lg bg-light mt-3">
                                <span style={{ fontSize: "2rem" }}>📷</span>
                                <p className="text-muted mt-2">No progress photos logged. Attach photo URLs when doing check-ins to build your diary.</p>
                              </div>
                            ) : (
                              <div className="rb-photo-diary-grid">
                                {photoGallery.map((item, idx) => (
                                  <div key={idx} className="rb-diary-card">
                                    <img src={item.photoUrl} alt={`Progress ${item.date}`} className="rb-diary-img" />
                                    <div className="rb-diary-content">
                                      <div className="rb-diary-date">{item.date}</div>
                                      {item.notes && (
                                        <p className="rb-diary-notes mt-2">"{item.notes}"</p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                      </div>

                    </div>

                  </div>
                )}

                {/* Tab Content: Custom Builder / Editor */}
                {activeTab === "builder" && (
                  <form onSubmit={handleSaveRoutine} className="rb-form-card">
                    
                    <div className="rb-form-header">
                      <h2>{editingRoutineId ? "Edit Routine Journey" : "Design A Goal Skincare Journey"}</h2>
                      <p className="text-muted">Outline your step-by-step product layering. Customize allergen slots and tracking durations.</p>
                    </div>

                    {/* Metadata Fields */}
                    <div className="rb-form-grid">
                      
                      <div className="rb-form-group full-width">
                        <label className="rb-label">Routine Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Daily Glow Spot Fading Regimen" 
                          value={routineName} 
                          onChange={(e) => setRoutineName(e.target.value)}
                          className="rb-input"
                          required
                        />
                      </div>

                      <div className="rb-form-group full-width">
                        <label className="rb-label">Journey Goals & Focus *</label>
                        <select 
                          value={routineGoal}
                          onChange={(e) => handleGoalChange(e.target.value)}
                          className="rb-select"
                        >
                          <option value="general_wellness">General Skincare Wellness</option>
                          <option value="acne_clearance">Acne Clearance & Pore Clarifying</option>
                          <option value="dark_spot_fading">Dark Spot Fading & Niacinamide Boost</option>
                          <option value="barrier_repair">Skin Barrier Calming & Cica Repair</option>
                          <option value="anti_aging">Youth Renewal & Peptide Hydration</option>
                          <option value="hydration">Deep Hydration & Hyaluronic Lock</option>
                        </select>
                      </div>

                      <div className="rb-form-group full-width">
                        <label className="rb-label">Milestone Journey Title</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 30-Day Spot Clearance Plan" 
                          value={milestoneTitle}
                          onChange={(e) => setMilestoneTitle(e.target.value)}
                          className="rb-input"
                        />
                      </div>

                      <div className="rb-form-group full-width">
                        <label className="rb-label">Description (Optional)</label>
                        <textarea 
                          placeholder="Describe the goals of this routine"
                          value={routineDesc}
                          onChange={(e) => setRoutineDesc(e.target.value)}
                          className="rb-textarea"
                          rows={2}
                        />
                      </div>

                      <div className="rb-form-group">
                        <label className="rb-label">Routine Type</label>
                        <select 
                          value={routineType} 
                          onChange={(e) => setRoutineType(e.target.value)}
                          className="rb-select"
                        >
                          <option value="skincare">Skincare</option>
                          <option value="makeup">Makeup</option>
                          <option value="haircare">Haircare</option>
                          <option value="mixed">Mixed / Combination</option>
                        </select>
                      </div>

                      <div className="rb-form-group">
                        <label className="rb-label">Journey Duration (Days)</label>
                        <input 
                          type="number"
                          value={durationDays}
                          onChange={(e) => setDurationDays(e.target.value)}
                          className="rb-input"
                          min="1"
                        />
                      </div>

                      <div className="rb-form-group">
                        <label className="rb-label">Start Date</label>
                        <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="rb-input"
                        />
                      </div>

                      <div className="rb-form-group">
                        <label className="rb-label">Estimated Steps Duration (mins)</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 10" 
                          value={estimatedMinutes}
                          onChange={(e) => setEstimatedMinutes(e.target.value)}
                          className="rb-input"
                          min="1"
                        />
                      </div>

                    </div>

                    {/* Step Customizer Section */}
                    <div className="rb-section-title">
                      <span>Routine steps ({steps.length})</span>
                      <div className="d-flex gap-2">
                        {steps.length > 1 && (
                          <button type="button" className="rb-btn-secondary" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={handleAutoSort}>
                            <FaMagic /> Auto-Sort Layers
                          </button>
                        )}
                        <button type="button" className="rb-create-btn" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={handleAddStep}>
                          <FaPlus /> Add Step
                        </button>
                      </div>
                    </div>

                    {steps.length === 0 ? (
                      <div className="text-center py-5 border rounded-lg bg-light mb-4">
                        <p className="text-muted mb-0">No steps defined. Add a step to search and select products.</p>
                      </div>
                    ) : (
                      <div className="rb-steps-list">
                        {steps.map((step, idx) => (
                          <div key={idx} className={`rb-step-card ${step.allergenAlert ? "allergen-warning-border" : ""}`}>
                            <div className="rb-step-number">{idx + 1}</div>
                            
                            <div className="rb-step-content">
                              
                              {/* Product Selector */}
                              <div className="rb-product-selector">
                                <label className="rb-label">Select Product *</label>
                                
                                {step.product ? (
                                  <div className="rb-selected-product-info">
                                    {step.productImage && (
                                      <img src={step.productImage} alt={step.productName} className="rb-selected-img" />
                                    )}
                                    <div className="rb-selected-detail">
                                      <div className="rb-selected-name">{step.productName}</div>
                                      
                                      {step.variants && step.variants.length > 1 ? (
                                        <div className="mt-2">
                                          <select 
                                            value={step.selectedSku} 
                                            onChange={(e) => handleStepVariantChange(idx, e.target.value)}
                                            className="rb-select"
                                            style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                                          >
                                            {step.variants.map((v, vIdx) => (
                                              <option key={vIdx} value={v.sku}>
                                                {v.shadeName || v.name || v.sku}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      ) : step.selectedSku ? (
                                        <div className="rb-selected-brand">SKU: {step.selectedSku}</div>
                                      ) : null}
                                    </div>
                                    <button 
                                      type="button" 
                                      className="rb-remove-selected-btn"
                                      onClick={() => handleStepProductSelect(idx, { _id: "", name: "", variants: [] })}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="d-flex align-items-center bg-white border rounded px-3" style={{ position: "relative" }}>
                                      <FaSearch className="text-muted mr-2" />
                                      <input 
                                        type="text"
                                        placeholder="Search product from catalog..."
                                        value={searchQueries[idx] || ""}
                                        onChange={(e) => {
                                          const text = e.target.value;
                                          setSearchQueries(prev => ({ ...prev, [idx]: text }));
                                          setShowDropdown(prev => ({ ...prev, [idx]: true }));
                                        }}
                                        className="rb-input w-100 border-0 pl-1"
                                        style={{ boxShadow: "none" }}
                                      />
                                    </div>

                                    {showDropdown[idx] && searchQueries[idx]?.trim() && (
                                      <div className="rb-search-results-dropdown">
                                        {getFilteredProducts(searchQueries[idx]).length === 0 ? (
                                          <div className="p-3 text-muted text-center" style={{ fontSize: "0.85rem" }}>
                                            No matching products found.
                                          </div>
                                        ) : (
                                          getFilteredProducts(searchQueries[idx]).map(prod => (
                                            <div 
                                              key={prod._id} 
                                              className="rb-search-item"
                                              onClick={() => handleStepProductSelect(idx, prod)}
                                            >
                                              <img src={prod.image} alt={prod.name} className="rb-search-item-img" />
                                              <div className="rb-search-item-info">
                                                <div className="rb-search-item-name">{prod.name}</div>
                                                <div className="rb-search-item-brand">{prod.brand}</div>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Form Row for Custom Note, Tip and Time Slot */}
                              <div className="rb-step-fields-row">
                                <div className="rb-form-group">
                                  <label className="rb-label">Apply Slot</label>
                                  <select 
                                    value={step.timeOfDay} 
                                    onChange={(e) => handleStepTextChange(idx, "timeOfDay", e.target.value)}
                                    className="rb-select"
                                  >
                                    <option value="both">AM + PM Both</option>
                                    <option value="AM">AM Only</option>
                                    <option value="PM">PM Only</option>
                                  </select>
                                </div>
                                <div className="rb-form-group">
                                  <label className="rb-label">Personal Note</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Apply 3 drops, massage upward" 
                                    value={step.note} 
                                    onChange={(e) => handleStepTextChange(idx, "note", e.target.value)}
                                    className="rb-input"
                                  />
                                </div>
                                <div className="rb-form-group">
                                  <label className="rb-label">Application Tip</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Best applied on damp skin" 
                                    value={step.applicationTip} 
                                    onChange={(e) => handleStepTextChange(idx, "applicationTip", e.target.value)}
                                    className="rb-input"
                                  />
                                </div>
                              </div>

                              {/* Step Allergen Warning Alert Box */}
                              {step.allergenAlert && (
                                <div className="rb-allergen-alert-box">
                                  <FaExclamationTriangle />
                                  <span>{step.allergenAlertMessage || "Warning: Matches user allergy profile ingredients!"}</span>
                                </div>
                              )}

                            </div>

                            {/* Reordering Controls */}
                            <div className="rb-step-side-actions">
                              <button 
                                type="button" 
                                className="rb-icon-btn delete" 
                                title="Remove Step"
                                onClick={() => handleRemoveStep(idx)}
                              >
                                <FaTrash />
                              </button>
                              
                              <div className="rb-step-move-controls">
                                <button 
                                  type="button" 
                                  className="rb-icon-btn" 
                                  disabled={idx === 0}
                                  title="Move Up"
                                  onClick={() => handleMoveStep(idx, "up")}
                                >
                                  <FaArrowUp />
                                </button>
                                <button 
                                  type="button" 
                                  className="rb-icon-btn" 
                                  disabled={idx === steps.length - 1}
                                  title="Move Down"
                                  onClick={() => handleMoveStep(idx, "down")}
                                >
                                  <FaArrowDown />
                                </button>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="rb-action-row">
                      <button type="button" className="rb-btn-secondary" onClick={() => { resetForm(); setActiveTab("my"); }}>
                        Cancel
                      </button>
                      <button type="submit" className="rb-btn-primary d-flex align-items-center gap-2">
                        <FaCheck /> {editingRoutineId ? "Update Regimen" : "Save Regimen"}
                      </button>
                    </div>

                  </form>
                )}

              </div>
            )}

          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default RoutineBuilder;
