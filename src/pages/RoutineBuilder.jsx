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
  FaSave,
  FaLightbulb
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

const BADGE_MAP = {
  consistency_starter: "🔥 Consistency Starter",
  routine_warrior: "⚔️ Routine Warrior",
  skincare_scientist: "🔬 Skincare Scientist",
  transformation_master: "👑 Transformation Master",
  perfect_week: "✨ Perfect Week"
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
  const [calendarGrid, setCalendarGrid] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([""]);
  const [showGuidance, setShowGuidance] = useState(false);

  // Checkin Entry Form
  const [logDate, setLogDate] = useState(getTodayDateString());
  const [amCompleted, setAmCompleted] = useState(false);
  const [pmCompleted, setPmCompleted] = useState(false);
  const [skinRating, setSkinRating] = useState(0);
  const [diaryNote, setDiaryNote] = useState("");
  const [diaryPhotoUrl, setDiaryPhotoUrl] = useState("");
  const [isSavingLog, setIsSavingLog] = useState(false);

  // --- Routine Templates States ---
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // --- New Advanced AI States ---
  const [activeReminders, setActiveReminders] = useState([]);
  const [aiPromptQuery, setAiPromptQuery] = useState("");
  const [aiDetectLoading, setAiDetectLoading] = useState(false);
  const [aiDetectResult, setAiDetectResult] = useState(null);
  const [aiDetectRecommendations, setAiDetectRecommendations] = useState(null);
  const [aiBudgetSummary, setAiBudgetSummary] = useState(null);
  const [aiSafetyAdvice, setAiSafetyAdvice] = useState("");
  const [aiStepOwnership, setAiStepOwnership] = useState({});
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);
  const [showAIDetectModal, setShowAIDetectModal] = useState(false);
  const [selectedAIMatches, setSelectedAIMatches] = useState({}); // cat -> 'bestMatch' | 'budgetMatch' | 'premiumMatch'

  const [conflicts, setConflicts] = useState([]);
  const [conflictRecommendations, setConflictRecommendations] = useState([]);
  const [conflictChecking, setConflictChecking] = useState(false);

  const [layeringWarnings, setLayeringWarnings] = useState([]);
  const [validatedCorrectedOrder, setValidatedCorrectedOrder] = useState(null);
  const [validatingOrder, setValidatingOrder] = useState(false);

  const [auditData, setAuditData] = useState(null);
  const [auditLoading, setAuditLoading] = useState(false);

  const [coachAdvice, setCoachAdvice] = useState(null);
  const [coachTips, setCoachTips] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);

  const [alternativesProduct, setAlternativesProduct] = useState(null);
  const [alternativesData, setAlternativesData] = useState(null);
  const [alternativesLoading, setAlternativesLoading] = useState(false);
  const [alternativesStepIdx, setAlternativesStepIdx] = useState(null);
  const [showAlternativesModal, setShowAlternativesModal] = useState(false);

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

  // --- Fetch Active Reminders ---
  const fetchActiveReminders = async () => {
    if (!user || user.guest) return;
    try {
      const res = await axiosInstance.get("/api/user/routines/reminders/active");
      if (res.data && res.data.success) {
        setActiveReminders(res.data.reminders || []);
      }
    } catch (err) {
      console.error("Error fetching active reminders:", err);
    }
  };

  // --- Fetch Routine Templates ---
  const fetchRoutineTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const res = await axiosInstance.get("/api/user/routines/templates");
      if (res.data && res.data.success) {
        setTemplates(res.data.templates || []);
      }
    } catch (err) {
      console.error("Error fetching routine templates:", err);
    } finally {
      setTemplatesLoading(false);
    }
  };

  // --- AI Goals Query Assistant ---
  const handleAIDetectSubmit = async (e) => {
    e.preventDefault();
    if (!aiPromptQuery.trim()) {
      toast.warn("Please type your skin concerns first.");
      return;
    }

    try {
      setAiDetectLoading(true);
      const res = await axiosInstance.post("/api/user/routines/ai-build", { query: aiPromptQuery });
      if (res.data && res.data.success) {
        const data = res.data;
        const newSteps = [];

        const processStep = (s) => {
          if (!s.productFound || !s.product) {
            // Placeholder step if product not found in catalog
            return {
              product: "",
              productName: s.stepLabel || "Select Product",
              productImage: "",
              selectedSku: "",
              note: s.purpose || "AI recommended step type",
              applicationTip: s.tip || "Apply as directed.",
              timeOfDay: s.timeOfDay || "both",
              allergenAlert: false,
              allergenAlertMessage: null,
              variants: [],
              isOwned: false,
              isRequired: true,
              ownershipType: null,
              purchaseSource: null
            };
          }

          // Real product found
          const product = s.product;
          // Find matching catalog product to load full variants list
          const localProduct = allProducts.find(p => String(p._id) === String(product._id)) || {};

          return {
            product: product._id,
            productName: product.name,
            productImage: product.productImage || product.variants?.[0]?.images?.[0] || localProduct.image || "",
            selectedSku: product.selectedSku || product.variants?.[0]?.sku || "",
            note: s.purpose || "AI recommended step",
            applicationTip: s.applicationTip || s.tip || "Apply as directed.",
            timeOfDay: s.timeOfDay || "both",
            allergenAlert: s.allergenAlert || false,
            allergenAlertMessage: s.allergenAlertMessage || null,
            variants: product.variants || localProduct.variants || [],
            isOwned: false,
            isRequired: true,
            ownershipType: null,
            purchaseSource: null
          };
        };

        // Combine AM and PM steps sequentially
        if (data.amSteps && data.amSteps.length > 0) {
          data.amSteps.forEach(s => newSteps.push(processStep(s)));
        }
        if (data.pmSteps && data.pmSteps.length > 0) {
          data.pmSteps.forEach(s => newSteps.push(processStep(s)));
        }

        setSteps(newSteps);
        
        // Map routine goal & details
        const rawGoal = data.aiMeta?.primaryGoals?.[0] || "general_wellness";
        const mapGoalToEnum = (primaryGoal) => {
          if (!primaryGoal) return "general_wellness";
          const g = primaryGoal.toLowerCase();
          if (g.includes("acne") || g.includes("blackhead") || g.includes("pore") || g.includes("pimple") || g.includes("blemish")) {
            return "acne_clearance";
          }
          if (g.includes("spot") || g.includes("pigment") || g.includes("dark") || g.includes("bright") || g.includes("glow") || g.includes("melasma") || g.includes("arbutin") || g.includes("scar")) {
            return "dark_spot_fading";
          }
          if (g.includes("barrier") || g.includes("sensitive") || g.includes("red") || g.includes("sooth") || g.includes("calm") || g.includes("irritat") || g.includes("rosacea") || g.includes("cica")) {
            return "barrier_repair";
          }
          if (g.includes("aging") || g.includes("wrinkle") || g.includes("fine line") || g.includes("mature") || g.includes("retinol") || g.includes("peptide") || g.includes("firm")) {
            return "anti_aging";
          }
          if (g.includes("hydrat") || g.includes("dry") || g.includes("dehydrat") || g.includes("moist") || g.includes("water")) {
            return "hydration";
          }
          return "general_wellness";
        };
        const detectedGoal = mapGoalToEnum(rawGoal);
        setRoutineGoal(detectedGoal);

        setRoutineName(data.routineName || "Personalized AI Regimen");
        setRoutineDesc(data.aiMeta?.skinConcernSummary || "AI custom generated sequence.");
        setMilestoneTitle(data.aiMeta?.expectedTimeline ? `Timeline: ${data.aiMeta.expectedTimeline.substring(0, 50)}...` : "Personalized Goal Journey");
        setDurationDays(data.aiMeta?.durationDays || 30);
        setTimeOfDay("AM+PM");
        setIsAISuggested(true);
        setActiveTab("builder");
        setAiBudgetSummary(data.budgetSummary || null);
        setAiSafetyAdvice(data.aiMeta?.safetyAdvice || "");
        
        if (data.budgetSummary?.budgetNote) {
          toast.success(`AI Routine Generated! ${data.budgetSummary.budgetNote}`, { autoClose: 7000 });
        } else {
          toast.success("AI generated routine sequence loaded! Customize it below.");
        }
      }
    } catch (err) {
      console.error("AI routine builder error:", err);
      toast.error(err.response?.data?.message || "Failed to analyze skin concerns and build routine.");
    } finally {
      setAiDetectLoading(false);
    }
  };

  const loadAIDetectedRoutine = () => {
    // Legacy function - bypassed by new direct loading flow
  };

  const handleDismissReminder = (idx) => {
    setActiveReminders(prev => prev.filter((_, i) => i !== idx));
  };

  // --- Ingredient Conflict Checker ---
  const handleCheckConflicts = async () => {
    const productIds = steps.map(s => s.product).filter(Boolean);
    if (productIds.length === 0) {
      toast.warn("Please add products to your routine steps first.");
      return;
    }

    try {
      setConflictChecking(true);
      const res = await axiosInstance.post("/api/user/routines/check-conflicts", { productIds });
      if (res.data && res.data.success) {
        setConflicts(res.data.conflicts || []);
        setConflictRecommendations(res.data.recommendations || []);
        if (res.data.conflicts?.length > 0) {
          toast.warn("Potential ingredient conflicts detected!");
        } else {
          toast.success("✓ No conflicts detected in your routine!");
        }
      }
    } catch (err) {
      console.error("Conflict checking error:", err);
      toast.error("Failed to run ingredient conflicts validator.");
    } finally {
      setConflictChecking(false);
    }
  };

  // --- AI Tracker Tabs Change ---
  const handleTrackerTabChange = async (tabName) => {
    setTrackerTab(tabName);
    if (!activeTrackerRoutine) return;

    if (tabName === "audit") {
      try {
        setAuditLoading(true);
        const res = await axiosInstance.get(`/api/user/routines/${activeTrackerRoutine._id}/audit`);
        if (res.data && res.data.success) {
          setAuditData(res.data.audit);
        }
      } catch (err) {
        console.error("Audit fetch error:", err);
        toast.error("Failed to fetch routine audit.");
      } finally {
        setAuditLoading(false);
      }
    } else if (tabName === "coach") {
      try {
        setCoachLoading(true);
        const res = await axiosInstance.get(`/api/user/routines/${activeTrackerRoutine._id}/coach`);
        if (res.data && res.data.success) {
          setCoachAdvice(res.data.coachMessage);
          setCoachTips(res.data.tips || []);
        }
      } catch (err) {
        console.error("Coach fetch error:", err);
        toast.error("Failed to generate AI Skincare Coach review.");
      } finally {
        setCoachLoading(false);
      }
    }
  };

  // --- Product Alternatives & Swapping ---
  const handleOpenAlternatives = async (productId, stepIdx) => {
    if (!productId) return;
    try {
      setAlternativesLoading(true);
      setAlternativesStepIdx(stepIdx);
      setShowAlternativesModal(true);
      setAlternativesProduct(steps[stepIdx]);

      const res = await axiosInstance.get(`/api/user/routines/products/${productId}/alternatives`);
      if (res.data && res.data.success) {
        setAlternativesData(res.data);
      }
    } catch (err) {
      console.error("Alternatives fetch error:", err);
      toast.error("Failed to load alternative products.");
    } finally {
      setAlternativesLoading(false);
    }
  };

  const handleSwapProduct = (alternativeProduct) => {
    if (alternativesStepIdx === null || !alternativeProduct) return;

    const image = alternativeProduct.variants?.[0]?.images?.[0] || alternativeProduct.image || "";
    const sku = alternativeProduct.variants?.[0]?.sku || "";
    const tip = alternativeProduct.howToUse?.[0] || "";

    const updated = [...steps];
    updated[alternativesStepIdx] = {
      product: alternativeProduct._id,
      productName: alternativeProduct.name,
      productImage: image,
      selectedSku: sku,
      note: `Swapped with alternative match (${alternativeProduct.name})`,
      applicationTip: tip,
      timeOfDay: updated[alternativesStepIdx].timeOfDay || "both",
      allergenAlert: false,
      allergenAlertMessage: null,
      variants: alternativeProduct.variants || []
    };

    setSteps(updated);
    setShowAlternativesModal(false);
    setAlternativesData(null);
    setAlternativesStepIdx(null);
    toast.success(`Swapped with alternative: ${alternativeProduct.name}! ✨`);
  };

  // --- Clone Public Shared Routine ---
  const handleClonePublicRoutine = async () => {
    if (!shareToken) return;
    if (!user || user.guest) {
      toast.info("Please log in to clone this routine.");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post(`/api/user/routines/clone/${shareToken}`);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Routine cloned to your profile! ✨");
        navigate("/routines");
      }
    } catch (err) {
      console.error("Clone error:", err);
      toast.error(err.response?.data?.message || "Failed to clone routine.");
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
        fetchActiveReminders();
        fetchRoutineTemplates();
      } else {
        setLoading(false);
      }
    }
  }, [shareToken, user, authLoading]);

  // Auto-open reminders drawer once per session if reminders exist
  useEffect(() => {
    if (activeReminders.length > 0) {
      const sessionOpened = sessionStorage.getItem("rb_reminders_auto_opened");
      if (!sessionOpened) {
        setShowReminderDrawer(true);
        sessionStorage.setItem("rb_reminders_auto_opened", "true");
      }
    }
  }, [activeReminders]);

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

  const mapGoalToKey = (goalName) => {
    if (!goalName) return "general_wellness";
    const name = goalName.toLowerCase();
    if (name.includes("acne") || name.includes("pore")) return "acne_clearance";
    if (name.includes("dark") || name.includes("spot") || name.includes("bright") || name.includes("tan")) return "dark_spot_fading";
    if (name.includes("barrier") || name.includes("calm") || name.includes("sensitive") || name.includes("sooth")) return "barrier_repair";
    if (name.includes("age") || name.includes("aging") || name.includes("wrinkle") || name.includes("collagen")) return "anti_aging";
    if (name.includes("hydrat") || name.includes("moist") || name.includes("dry")) return "hydration";
    return "general_wellness";
  };

  const guessCategoryFromName = (name) => {
    const text = name.toLowerCase();
    if (text.includes("cleanser") || text.includes("wash") || text.includes("soap") || text.includes("foam")) return "cleanser";
    if (text.includes("toner") || text.includes("mist")) return "toner";
    if (text.includes("essence") || text.includes("mucin")) return "essence";
    if (text.includes("serum") || text.includes("ampoule")) return "serum";
    if (text.includes("moisturizer") || text.includes("cream") || text.includes("lotion") || text.includes("gel")) return "moisturizer";
    if (text.includes("sunscreen") || text.includes("spf") || text.includes("sun")) return "sunscreen";
    return "";
  };

  const loadTemplateIntoBuilder = (template) => {
    resetForm();
    setRoutineName(template.name);
    setRoutineGoal(template.goals?.[0] ? mapGoalToKey(template.goals[0]) : "general_wellness");
    setMilestoneTitle(template.timeline ? `Timeline: ${template.timeline.substring(0, 50)}...` : `${template.name} Journey`);
    setDurationDays(template.durationDays || 30);

    const requiredCategories = template.requiredCategories || [];
    const recommendedProducts = template.recommendedProducts || [];

    const resolvedRecommended = recommendedProducts.map(recName => {
      const lowerRec = recName.toLowerCase();
      const matched = allProducts.find(p => p.name?.toLowerCase().includes(lowerRec));
      return {
        recommendedName: recName,
        matchedProduct: matched || null,
        guessedCategory: matched
          ? (typeof matched.category === "string" ? matched.category : matched.category?.name || "")
          : guessCategoryFromName(recName)
      };
    });

    const newSteps = [];

    requiredCategories.forEach((cat, index) => {
      const lowerCat = cat.toLowerCase();
      let matchInfo = resolvedRecommended.find(r => {
        const catName = r.guessedCategory?.toLowerCase() || "";
        return catName.includes(lowerCat) || lowerCat.includes(catName);
      });

      if (!matchInfo) {
        matchInfo = resolvedRecommended.find(r => {
          const recNameLower = r.recommendedName.toLowerCase();
          if (lowerCat === "cleanser") return recNameLower.includes("cleanser") || recNameLower.includes("wash") || recNameLower.includes("soap") || recNameLower.includes("foam");
          if (lowerCat === "toner") return recNameLower.includes("toner") || recNameLower.includes("mist");
          if (lowerCat === "essence") return recNameLower.includes("essence") || recNameLower.includes("mucin") || recNameLower.includes("ampoule");
          if (lowerCat === "serum") return recNameLower.includes("serum") || recNameLower.includes("acid") || recNameLower.includes("ampoule");
          if (lowerCat === "moisturizer") return recNameLower.includes("moisturizer") || recNameLower.includes("cream") || recNameLower.includes("lotion") || recNameLower.includes("hydrat");
          if (lowerCat === "sunscreen") return recNameLower.includes("sunscreen") || recNameLower.includes("spf") || recNameLower.includes("sun");
          return recNameLower.includes(lowerCat);
        });
      }

      let matchedProduct = matchInfo?.matchedProduct || null;
      let recommendedName = matchInfo?.recommendedName || (recommendedProducts[index] || "");

      if (!matchedProduct) {
        matchedProduct = allProducts.find(p => {
          const pCat = typeof p.category === "string" ? p.category : p.category?.name;
          return pCat?.toLowerCase().includes(lowerCat);
        });
      }

      if (matchedProduct) {
        const image = matchedProduct.variants?.[0]?.images?.[0] || matchedProduct.image || "";
        const sku = matchedProduct.variants?.[0]?.sku || "";
        const tip = matchedProduct.howToUse?.[0] || "";

        newSteps.push({
          product: matchedProduct._id,
          productName: matchedProduct.name,
          productImage: image,
          selectedSku: sku,
          note: `Template Recommended: ${recommendedName}`,
          applicationTip: tip || "Apply as directed.",
          timeOfDay: lowerCat.includes("sun") || lowerCat.includes("spf") ? "AM" : "both",
          allergenAlert: false,
          allergenAlertMessage: null,
          variants: matchedProduct.variants || [],
          isOwned: false,
          isRequired: true,
          ownershipType: null,
          purchaseSource: null
        });
      } else {
        newSteps.push({
          product: "",
          productName: recommendedName || `Recommended ${cat}`,
          productImage: "",
          selectedSku: "",
          note: `Template Recommended: ${recommendedName} (Please select a product from store)`,
          applicationTip: "Apply as directed.",
          timeOfDay: lowerCat.includes("sun") || lowerCat.includes("spf") ? "AM" : "both",
          allergenAlert: false,
          allergenAlertMessage: null,
          variants: [],
          isOwned: false,
          isRequired: true,
          ownershipType: null,
          purchaseSource: null
        });
      }
    });

    setSteps(newSteps);
    setIsAISuggested(false);
    setActiveTab("builder");
    toast.success(`Loaded "${template.name}" template! Feel free to customize.`);
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
            variants: matchedProd.variants || [],
            isOwned: false,
            isRequired: true,
            ownershipType: null,
            purchaseSource: null
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
        if (quizConfirm) navigate("/shadefinder");
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
        variants: matchedProd.variants || s.product?.variants || [],
        isOwned: s.isOwned || false,
        isRequired: s.isRequired !== undefined ? s.isRequired : true,
        ownershipType: s.ownershipType || null,
        purchaseSource: s.purchaseSource || null
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
  const handleOpenTracker = async (routine, prefillType = null) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/user/routines/${routine._id}`);
      if (res.data && res.data.success) {
        setActiveTrackerRoutine(res.data.routine);
      } else {
        setActiveTrackerRoutine(routine);
      }
    } catch (err) {
      console.error("Error fetching single routine:", err);
      setActiveTrackerRoutine(routine);
    }

    setActiveTab("tracker");
    setTrackerTab("checkin");
    setLogDate(getTodayDateString());

    await fetchRoutineLogs(routine._id, prefillType);
  };

  const fetchRoutineLogs = async (id, prefillType = null) => {
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
          streakCount: 0,
        });
        setRatingsTrend(res.data.ratingsTrend || []);
        setPhotoGallery(res.data.photoGallery || []);

        // Prefill check-in inputs if log already exists for today
        const todayLog = (res.data.logs || []).find(l => l.dateString === getTodayDateString());
        if (todayLog) {
          setAmCompleted(prefillType === 'AM' ? true : (prefillType === 'PM' ? false : todayLog.amCompleted));
          setPmCompleted(prefillType === 'PM' ? true : (prefillType === 'AM' ? false : todayLog.pmCompleted));
          setSkinRating(todayLog.skinRating || 0);
          setDiaryNote(todayLog.notes || "");
          setDiaryPhotoUrl(todayLog.photoUrl || "");
          const photosFromDb = todayLog.progressPhotos && todayLog.progressPhotos.length > 0
            ? todayLog.progressPhotos.map(p => typeof p === 'object' && p.photoUrl ? p.photoUrl : p)
            : [""];
          setProgressPhotos(photosFromDb);
        } else {
          if (prefillType === 'AM') {
            setAmCompleted(true);
            setPmCompleted(false);
          } else if (prefillType === 'PM') {
            setAmCompleted(false);
            setPmCompleted(true);
          } else {
            resetCheckinForm();
          }
        }
      }

      // Fetch compliance calendar grid from API
      const calRes = await axiosInstance.get(`/api/user/routines/${id}/calendar`);
      if (calRes.data && calRes.data.success) {
        setCalendarGrid(calRes.data.calendar || []);
      }
    } catch (err) {
      console.error("Fetch logs/calendar error:", err);
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
      const photosFromDb = dateLog.progressPhotos && dateLog.progressPhotos.length > 0
        ? dateLog.progressPhotos.map(p => typeof p === 'object' && p.photoUrl ? p.photoUrl : p)
        : [""];
      setProgressPhotos(photosFromDb);
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
    setProgressPhotos([""]);
  };

  const handleProgressPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setPhotoUploading(true);
      const formData = new FormData();
      formData.append("photo", file);

      const res = await axiosInstance.post("/api/user/routines/upload-progress-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data && res.data.success) {
        const url = res.data.url;
        setDiaryPhotoUrl(url);
        setProgressPhotos(prev => {
          const filtered = prev.filter(Boolean);
          if (filtered.length === 1 && filtered[0] === "") {
            return [url];
          }
          return [...filtered, url];
        });
        toast.success("Progress photo uploaded successfully! 📸");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload progress photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      setShowCameraModal(true);
      setTimeout(async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
          });
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Camera access error:", err);
          toast.error("Could not access your device's camera. Please verify permissions.");
          setShowCameraModal(false);
        }
      }, 300);
    } catch (err) {
      console.error("Camera init error:", err);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCameraModal(false);
  };

  const captureSelfie = async () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      // Flip for mirrors natural selfie look
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          toast.error("Failed to capture photo.");
          return;
        }

        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" });
        stopCamera();

        try {
          setPhotoUploading(true);
          const formData = new FormData();
          formData.append("photo", file);

          const res = await axiosInstance.post("/api/user/routines/upload-progress-photo", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          if (res.data && res.data.success) {
            const url = res.data.url;
            setDiaryPhotoUrl(url);
            setProgressPhotos(prev => {
              const filtered = prev.filter(Boolean);
              if (filtered.length === 1 && filtered[0] === "") {
                return [url];
              }
              return [...filtered, url];
            });
            toast.success("Selfie captured and uploaded successfully! 📷✨");
          }
        } catch (uploadErr) {
          console.error("Upload failed", uploadErr);
          toast.error("Failed to upload captured selfie.");
        } finally {
          setPhotoUploading(false);
        }
      }, "image/jpeg", 0.95);
    } catch (err) {
      console.error("Capture error:", err);
      toast.error("An error occurred during photo capture.");
    }
  };

  // --- Save Daily Activity Log ---
  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    if (!activeTrackerRoutine) return;

    try {
      setIsSavingLog(true);

      // Filter out empty strings/nulls to avoid backend validation 500 crashes
      const cleanProgressPhotos = progressPhotos.filter(url => url && url.trim());
      const payload = {
        dateString: logDate,
        amCompleted,
        pmCompleted,
      };

      if (skinRating > 0) payload.skinRating = skinRating;
      if (diaryNote.trim()) payload.notes = diaryNote.trim();
      if (cleanProgressPhotos.length > 0) {
        payload.photoUrl = cleanProgressPhotos[0];
        payload.progressPhotos = cleanProgressPhotos.map((url, i) => ({
          faceView: i === 0 ? "front" : i === 1 ? "left" : "right",
          photoUrl: url
        }));
      }

      const res = await axiosInstance.post(`/api/user/routines/${activeTrackerRoutine._id}/log`, payload);
      if (res.data && res.data.success) {
        toast.success(res.data.message || "Daily progress check-in logged! 🌸");
        if (res.data.stats?.badges) {
          setActiveTrackerRoutine(prev => prev ? { ...prev, badges: res.data.stats.badges } : null);
        }
        // Reload logs list to update graphs
        await fetchRoutineLogs(activeTrackerRoutine._id);
        fetchMyRoutines(); // Refresh index compliance rates
      }
    } catch (err) {
      console.error("Save log error:", err);
      if (err.response?.data) {
        console.error("Server validation error details:", err.response.data);
      }
      toast.error(err.response?.data?.message || "Failed to save progress check-in.");
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
  const handleAutoSort = async () => {
    if (steps.length <= 1) return;
    const cleanSteps = steps.map((s, idx) => ({
      product: s.product,
      productName: s.productName,
      stepOrder: idx + 1
    })).filter(s => s.product);

    if (cleanSteps.length === 0) return;

    try {
      setValidatingOrder(true);
      const res = await axiosInstance.post("/api/user/routines/validate-order", { steps: cleanSteps });
      if (res.data && res.data.success) {
        const { orderWarnings, correctedOrder } = res.data;
        if (orderWarnings && orderWarnings.length > 0) {
          setLayeringWarnings(orderWarnings);

          // Map correctedOrder back to customizer state structure (preserving notes, images, etc.)
          const mappedCorrected = correctedOrder.map((cs) => {
            const originalStep = steps.find(os => String(os.product) === String(cs.product)) || {};
            return {
              ...originalStep,
              stepOrder: cs.stepOrder,
              productName: cs.productName
            };
          });
          setValidatedCorrectedOrder(mappedCorrected);
          toast.info("Layering discrepancies found. See warnings below.");
        } else {
          setLayeringWarnings([]);
          setValidatedCorrectedOrder(null);
          toast.success("Perfect sequence! Steps are in correct layering order.");
        }
      }
    } catch (err) {
      console.error("Layering order validation error:", err);
      // Fallback to local guessSkincarePriority sorting
      const sorted = [...steps].sort((a, b) => {
        const matchedA = allProducts.find(p => String(p._id) === String(a.product)) || {};
        const matchedB = allProducts.find(p => String(p._id) === String(b.product)) || {};

        const priorityA = guessSkincarePriority(a.productName, matchedA.productTags || matchedA.tags);
        const priorityB = guessSkincarePriority(b.productName, matchedB.productTags || matchedB.tags);
        return priorityA - priorityB;
      });
      setSteps(sorted);
      toast.success("Steps sorted locally! 🧴✨");
    } finally {
      setValidatingOrder(false);
    }
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

    const unownedRequired = steps.filter(s => s.isRequired !== false && !s.isOwned);
    if (unownedRequired.length > 0) {
      toast.error("❌ Cannot create routine! You must buy the required products first or check 'I already own this product' for all required steps to start.", {
        autoClose: 8000
      });
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
      timeOfDay: s.timeOfDay,
      isOwned: s.isOwned ?? false,
      isRequired: s.isRequired ?? true,
      ownershipType: s.isOwned ? (s.ownershipType || "purchased_from_us") : null,
      purchaseSource: s.isOwned ? (s.purchaseSource || "Joyory Store") : null
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
    setAiBudgetSummary(null);
    setAiSafetyAdvice("");
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
    if (!calendarGrid || calendarGrid.length === 0) return "";
    const dayData = calendarGrid.find(d => d.day === dayNum);
    if (!dayData) return "";

    const isToday = dayData.date === getTodayDateString();

    let statusClass = "";
    if (dayData.status === "Green") statusClass = "both";
    else if (dayData.status === "Yellow") statusClass = "half";
    else if (dayData.status === "Red") statusClass = "none";
    else if (dayData.status === "Upcoming") statusClass = "";

    return `${statusClass}${isToday ? " today" : ""}`;
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
                  {(publicRoutine.user?.name || "J")[0].toUpperCase()}
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

              <div className="mt-4 d-flex align-items-center justify-content-center gap-3 flex-wrap">
                <button className="rb-btn-primary d-inline-flex align-items-center gap-2" onClick={() => handleAddRoutineToCart()}>
                  <FaCartPlus /> Add Entire Routine to Cart
                </button>
                <button className="rb-btn-secondary d-inline-flex align-items-center gap-2" onClick={handleClonePublicRoutine}>
                  <FaPlus /> Clone Routine to Profile
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
                          {step.stepLabel || `Step ${idx + 1}`}
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
                          <div className="rb-allergen-alert-box">
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
          <h3 className="ua-title ms-4 page-title-main-name" style={{ display: "inline-flex", alignItems: "center" }}>
            Routine Builder
            <button
              type="button"
              className="rb-global-help-btn"
              title="How Routine Builder Works"
              onClick={() => setShowGuidance(true)}
            >
              <FaLightbulb />
            </button>
          </h3>
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
                        className={`rb-tab-btn ${activeTab === "templates" ? "active" : ""}`}
                        onClick={() => { resetForm(); setActiveTab("templates"); }}
                      >
                        Routine Templates ({templates.length})
                      </button>
                      <button
                        className={`rb-tab-btn ${activeTab === "builder" ? "active" : ""}`}
                        onClick={() => { resetForm(); setActiveTab("builder"); }}
                      >
                        {editingRoutineId ? "Edit Routine" : "Custom Builder"}
                      </button>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="rb-notif-bell-btn position-relative"
                        onClick={() => setShowReminderDrawer(true)}
                        title="View Reminders"
                      >
                        🔔
                        {activeReminders.length > 0 && (
                          <span className="rb-notif-badge">{activeReminders.length}</span>
                        )}
                      </button>

                      {(activeTab === "my" || activeTab === "templates") && (
                        <button className="rb-create-btn" onClick={() => { resetForm(); setActiveTab("builder"); }}>
                          <FaPlus /> Build Custom
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab Content: My Saved Routines Dashboard */}
                {activeTab === "my" && (
                  <div>

                    {/* AI Skincare Coach Card */}
                    <div className="rb-ai-banner d-flex flex-column align-items-stretch gap-3 mb-4 p-4 rounded-lg shadow-sm" style={{ background: "#ffffff", border: "1px solid var(--joyory-border)" }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div className="rb-ai-banner-content">
                          <h4 className="mb-1 font-weight-bold d-flex align-items-center gap-2" style={{ fontSize: "1.25rem", color: "var(--joyory-charcoal)" }}>
                            <FaMagic style={{ color: "var(--joyory-gold)" }} /> Joyory AI Skincare Coach
                          </h4>
                          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>Let our AI build a personalized skin goal journey matching your profile & quiz tags.</p>
                        </div>
                        <button
                          type="button"
                          className="rb-icon-btn"
                          title="View Guide"
                          style={{ background: "#eaeaea", width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
                          onClick={() => setShowGuidance(true)}
                        >
                          <FaLightbulb style={{ color: "var(--joyory-gold)", fontSize: "1.1rem" }} />
                        </button>
                      </div>

                      <div className="pt-2 border-top">
                        <form onSubmit={handleAIDetectSubmit} className="d-flex flex-column gap-2">
                          <textarea
                            placeholder="Describe your skin concerns (e.g., 'I have oily skin with blackheads and severe acne breakouts on my cheeks. I'm also looking to clear acne marks.')"
                            value={aiPromptQuery}
                            onChange={(e) => setAiPromptQuery(e.target.value)}
                            className="rb-textarea w-100"
                            rows={3}
                            style={{ minHeight: "80px", resize: "none", background: "white", padding: "12px", borderRadius: "8px", border: "1px solid var(--joyory-border)", fontSize: "0.9rem" }}
                          />
                          <button
                            type="submit"
                            className="rb-create-btn justify-content-center align-self-end mt-1"
                            style={{ width: "fit-content", padding: "10px 24px", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px" }}
                            disabled={aiDetectLoading}
                          >
                            {aiDetectLoading ? (
                              <>
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                <span>Analyzing...</span>
                              </>
                            ) : (
                              <>
                                <FaMagic />
                                <span>Ask Coach</span>
                              </>
                            )}
                          </button>
                        </form>
                      </div>
                    </div>

                    {/* Routines Grid */}
                    {routines.length === 0 ? (
                      <div className="text-center py-5 border rounded-lg bg-light" style={{ borderStyle: "dashed !important" }}>
                        <FaCalendarAlt style={{ fontSize: "3rem", color: "#cccccc", marginBottom: "15px" }} />
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
                              <div className="d-flex justify-content-between align-items-start gap-2">
                                <div style={{ flex: 1 }}>
                                  <h3 onClick={() => handleOpenTracker(routine)} style={{ cursor: "pointer" }}>{routine.name}</h3>
                                  {routine.milestoneTitle && (
                                    <div className="rb-card-milestone">🎯 {routine.milestoneTitle}</div>
                                  )}
                                  {routine.description && (
                                    <p className="rb-card-desc" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{routine.description}</p>
                                  )}
                                </div>
                                <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: "55px", height: "55px", flexShrink: 0 }} title="Compliance Consistency Rate">
                                  <svg className="w-100 h-100" viewBox="0 0 36 36">
                                    <path
                                      strokeWidth="3"
                                      stroke="#eee"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      strokeWidth="3"
                                      strokeDasharray={`${routine.complianceRate || 0}, 100`}
                                      strokeLinecap="round"
                                      stroke="var(--joyory-gold)"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="position-absolute font-weight-bold" style={{ fontSize: "0.85rem", color: "#333" }}>
                                    {routine.complianceRate || 0}%
                                  </div>
                                </div>
                              </div>

                              <div className="rb-card-progress mt-3">
                                <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.85rem" }}>
                                  <span>Compliance Progress:</span>
                                  <strong>Day {routine.currentDay || 1} of {routine.durationDays}</strong>
                                </div>
                                <div className="rb-progress-bar-bg">
                                  <div
                                    className="rb-progress-bar-fill"
                                    style={{ width: `${Math.min(100, ((routine.currentDay || 1) / routine.durationDays) * 100)}%` }}
                                  />
                                </div>
                              </div>

                              <div className="rb-card-progress-meta mt-2" style={{ fontSize: "0.82rem", color: "#555" }}>
                                <span>📈 Compliance Rate:</span>
                                <span>{routine.complianceRate || 0}% Consistency</span>
                              </div>

                              <div className="rb-card-progress-meta mt-2" style={{ fontSize: "0.82rem", color: "#555" }}>
                                <span>📦 Products Owned:</span>
                                <strong>{routine.ownedProductsCount || 0} of {routine.requiredProductsCount || routine.steps?.length || 0} ({routine.completionPercentage || 0}%)</strong>
                              </div>

                              {routine.completionPercentage < 100 && (
                                <div className="rb-allergen-alert-box mt-2" style={{ background: "#ffffff", border: "1px dashed #000000", color: "#000000", padding: "6px 12px", fontSize: "0.78rem" }}>
                                  <strong>Missing Products:</strong> You need to buy {(routine.requiredProductsCount || routine.steps?.length || 0) - (routine.ownedProductsCount || 0)} product(s) to complete this routine.
                                </div>
                              )}


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

                {/* Tab Content: Starter Templates */}
                {activeTab === "templates" && (
                  <div>
                    {templatesLoading ? (
                      <div className="rb-loader-container page-title-main-name">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading Templates...</span>
                        </div>
                        <p className="mt-3">Fetching routine templates...</p>
                      </div>
                    ) : templates.length === 0 ? (
                      <div className="text-center py-5 border rounded-lg bg-light" style={{ borderStyle: "dashed !important" }}>
                        <span style={{ fontSize: "3rem" }}>📋</span>
                        <h4 className="mt-3">No templates found</h4>
                      </div>
                    ) : (
                      <div className="rb-routines-grid">
                        {templates.map((template) => (
                          <div key={template.id} className="rb-routine-card">
                            <div className="rb-card-header">
                              <div>
                                <div className="rb-card-badges">
                                  <span className="rb-badge rb-badge-time">
                                    {template.durationDays} Days
                                  </span>
                                  <span className="rb-badge rb-badge-type">
                                    {template.difficulty}
                                  </span>

                                </div>
                              </div>
                            </div>

                            <div className="rb-card-body">
                              <h3 style={{ cursor: "default" }}>{template.name}</h3>

                              <div className="d-flex gap-1 flex-wrap mt-2 mb-3">
                                {template.goals?.map((goal, idx) => (
                                  <span key={idx} className="rb-badge rb-badge-goal">{goal}</span>
                                ))}
                              </div>

                              {template.timeline && (
                                <div className="p-3 mb-3 rounded bg-light border" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                                  <strong>Timeline Expectation:</strong>
                                  <div className="mt-1 text-muted" style={{ whiteSpace: "pre-wrap" }}>{template.timeline}</div>
                                </div>
                              )}

                              <div className="mb-2" style={{ fontSize: "0.9rem" }}>
                                <strong>Required steps:</strong>
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                  {template.requiredCategories?.map((cat, idx) => (
                                    <span key={idx} className="rb-badge rb-badge-time" style={{ background: "#eaeaea", color: "#555" }}>
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div style={{ fontSize: "0.9rem" }}>
                                <strong>Recommended products:</strong>
                                <div className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                                  {template.recommendedProducts?.join(", ")}
                                </div>
                              </div>
                            </div>

                            <div className="rb-card-footer justify-content-end">
                              <button
                                type="button"
                                className="rb-create-btn"
                                onClick={() => loadTemplateIntoBuilder(template)}
                              >
                                Use Template
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
                        <h2 className="mb-0 font-weight-bold" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                          {activeTrackerRoutine.name}
                          {trackerStats?.streakCount > 0 && (
                            <span className="rb-streak-badge" style={{ background: "#000000", color: "#ffffff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              🔥 {trackerStats.streakCount} Day Streak!
                            </span>
                          )}
                        </h2>
                        <span className="text-muted font-weight-bold" style={{ fontSize: "0.9rem" }}>
                          🎯 Goal: {formatGoalName(activeTrackerRoutine.goal)} | Milestone: {activeTrackerRoutine.milestoneTitle}
                        </span>
                      </div>
                    </div>

                    {/* Tracker Tabs */}
                    <div className="rb-tabs mb-4 flex-wrap gap-2">
                      <button
                        className={`rb-tab-btn ${trackerTab === "checkin" ? "active" : ""}`}
                        onClick={() => handleTrackerTabChange("checkin")}
                      >
                        <FaCalendarAlt style={{ marginRight: "6px" }} /> Daily Check-In
                      </button>
                      <button
                        className={`rb-tab-btn ${trackerTab === "trends" ? "active" : ""}`}
                        onClick={() => handleTrackerTabChange("trends")}
                      >
                        <FaChartLine style={{ marginRight: "6px" }} /> Skin Trends
                      </button>
                      <button
                        className={`rb-tab-btn ${trackerTab === "diary" ? "active" : ""}`}
                        onClick={() => handleTrackerTabChange("diary")}
                      >
                        <FaImages style={{ marginRight: "6px" }} /> Progress Diary
                      </button>
                      <button
                        className={`rb-tab-btn ${trackerTab === "coach" ? "active" : ""}`}
                        onClick={() => handleTrackerTabChange("coach")}
                      >
                        <FaMagic style={{ marginRight: "6px" }} /> AI Coach
                      </button>
                      <button
                        className={`rb-tab-btn ${trackerTab === "audit" ? "active" : ""}`}
                        onClick={() => handleTrackerTabChange("audit")}
                      >
                        <FaExclamationTriangle style={{ marginRight: "6px" }} /> Routine Audit
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
                            <span>Products Owned:</span>
                            <strong>{activeTrackerRoutine.ownedProductsCount || 0} / {activeTrackerRoutine.requiredProductsCount || activeTrackerRoutine.steps?.length || 0}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Ownership Rate:</span>
                            <strong>{activeTrackerRoutine.completionPercentage || 0}%</strong>
                          </div>
                        </div>

                        {activeTrackerRoutine?.badges?.length > 0 && (
                          <div className="rb-tracker-stat-box text-left">
                            <div className="font-weight-bold mb-2" style={{ fontSize: "0.9rem" }}>🏆 Awarded Badges:</div>
                            <div className="d-flex flex-wrap gap-1">
                              {activeTrackerRoutine.badges.map(b => (
                                <span key={b} className="rb-badge" style={{ background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", color: "#0d47a1", fontWeight: "bold", fontSize: "0.75rem", padding: "4px 8px" }}>
                                  {BADGE_MAP[b] || b}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

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
                                <label className="rb-label mb-2">
                                  Visual Skin Diary (Progress Photos)
                                </label>

                                <div className="rb-photo-upload-area p-3 mb-3 text-center">
                                  <div className="d-flex justify-content-center gap-3">
                                    <button
                                      type="button"
                                      className="btn rb-btn-secondary d-flex align-items-center gap-2 m-0"
                                      onClick={startCamera}
                                      disabled={photoUploading}
                                      style={{ cursor: "pointer" }}
                                    >
                                      📷 Take Selfie
                                    </button>
                                    <label className="btn rb-btn-secondary d-flex align-items-center gap-2 m-0" style={{ cursor: "pointer" }}>
                                      🖼️ Upload Photo
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleProgressPhotoUpload}
                                        disabled={photoUploading}
                                      />
                                    </label>
                                  </div>

                                  {photoUploading && (
                                    <div className="text-muted mt-2 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "0.8rem" }}>
                                      <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: "12px", height: "12px" }} />
                                      Uploading to Cloudinary...
                                    </div>
                                  )}
                                </div>

                                {progressPhotos.filter(Boolean).length > 0 && (
                                  <div className="d-flex flex-wrap gap-2 mt-2">
                                    {progressPhotos.filter(Boolean).map((url, idx) => (
                                      <div key={idx} className="position-relative rb-photo-preview" style={{ width: "80px", height: "80px" }}>
                                        <img
                                          src={url}
                                          alt={`Progress ${idx + 1}`}
                                          style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                                        />
                                        <button
                                          type="button"
                                          className="position-absolute d-flex align-items-center justify-content-center bg-danger text-white border-0"
                                          style={{
                                            top: "-5px",
                                            right: "-5px",
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            fontSize: "0.75rem",
                                            cursor: "pointer"
                                          }}
                                          onClick={() => setProgressPhotos(progressPhotos.filter((_, i) => i !== idx))}
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
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

                            {trackerLogs.filter(l => (l.photoUrl || (l.progressPhotos && l.progressPhotos.length > 0))).length === 0 ? (
                              <div className="text-center py-5 border rounded-lg bg-light mt-3">
                                <span style={{ fontSize: "2rem" }}>📷</span>
                                <p className="text-muted mt-2">No progress photos logged. Attach photo URLs when doing check-ins to build your diary.</p>
                              </div>
                            ) : (
                              <div className="rb-photo-diary-grid">
                                {trackerLogs.filter(l => (l.photoUrl || (l.progressPhotos && l.progressPhotos.length > 0))).map((log, idx) => {
                                  const rawPhotos = log.progressPhotos && log.progressPhotos.length > 0 ? log.progressPhotos : [log.photoUrl];
                                  const photos = rawPhotos.map(p => typeof p === 'object' && p.photoUrl ? p.photoUrl : p).filter(Boolean);
                                  return photos.map((photo, pIdx) => (
                                    <div key={`${idx}-${pIdx}`} className="rb-diary-card">
                                      <img src={photo} alt={`Progress ${log.dateString}`} className="rb-diary-img" />
                                      <div className="rb-diary-content">
                                        <div className="rb-diary-date">{log.dateString}</div>
                                        {log.notes && (
                                          <p className="rb-diary-notes mt-2">"{log.notes}"</p>
                                        )}
                                      </div>
                                    </div>
                                  ));
                                })}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Tab 4: AI Skincare Coach Review */}
                        {trackerTab === "coach" && (
                          <div className="rb-checkin-card">
                            <h3>AI Skincare Coach Advice</h3>
                            <div className="rb-guarantee-banner mb-3 mt-2">
                              <span>⭐ <strong>99% Guarantee:</strong> 99% of users who followed this routine with Joyory products saw visible improvement within 30 days.</span>
                            </div>
                            {coachLoading ? (
                              <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status" />
                                <p className="mt-2 text-muted">Consulting Skincare Coach...</p>
                              </div>
                            ) : coachAdvice ? (
                              <div className="d-flex flex-column gap-3">
                                <div className="d-flex gap-3 align-items-start bg-light p-3 rounded-lg border">
                                  <span style={{ fontSize: "2.2rem" }}>💆</span>
                                  <div>
                                    <h5 className="font-weight-bold mb-1" style={{ fontSize: "0.95rem", color: "var(--joyory-gold)" }}>Joyory AI Coach</h5>
                                    <div className="lh-base" style={{ fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>{coachAdvice}</div>
                                  </div>
                                </div>

                                {coachTips?.length > 0 && (
                                  <div className="mt-3">
                                    <h4 style={{ fontSize: "1.1rem", fontWeight: "700" }} className="mb-3">Daily Coaching Tips</h4>
                                    <div className="d-flex flex-column gap-2">
                                      {coachTips.map((tip, idx) => (
                                        <div key={idx} className="d-flex align-items-center gap-2 p-2 border rounded" style={{ background: "#ffffff", borderColor: "#000000", color: "#000000" }}>
                                          <span>💡</span>
                                          <span style={{ fontSize: "0.9rem" }}>{tip}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-center text-muted">No coach feedback available. Keep logging daily routines to get personalized coach audits!</p>
                            )}
                          </div>
                        )}

                        {/* Tab 5: Routine Health Audit Scorecard */}
                        {trackerTab === "audit" && (
                          <div className="rb-checkin-card">
                            <h3>Routine Health Audit Scorecard</h3>
                            {auditLoading ? (
                              <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status" />
                                <p className="mt-2 text-muted">Auditing routine steps...</p>
                              </div>
                            ) : auditData ? (
                              <div className="d-flex flex-column gap-4">
                                <div className="d-flex align-items-center gap-4 flex-wrap p-3 rounded bg-light border">
                                  <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: "90px", height: "90px" }}>
                                    <svg className="w-100 h-100" viewBox="0 0 36 36">
                                      <path
                                        className="text-secondary"
                                        strokeWidth="3"
                                        stroke="#eee"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                      <path
                                        className="text-primary"
                                        strokeWidth="3"
                                        strokeDasharray={`${auditData.auditScore || 0}, 100`}
                                        strokeLinecap="round"
                                        stroke="var(--joyory-gold)"
                                        fill="none"
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                      />
                                    </svg>
                                    <div className="position-absolute font-weight-bold" style={{ fontSize: "1.2rem" }}>
                                      {auditData.auditScore || 0}%
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="mb-1" style={{ fontSize: "1.15rem", fontWeight: "700" }}>Skin Compatibility Score</h4>
                                    <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                                      Analyzed based on ingredients compatibility, ordering priority, and goal alignment.
                                    </p>
                                  </div>
                                </div>

                                <div className="rb-audit-grid d-flex flex-column gap-3">
                                  {auditData.warnings?.length > 0 && (
                                    <div className="rb-audit-section p-3 rounded" style={{ background: "#ffffff", border: "1px solid #000000" }}>
                                      <h5 className="font-weight-bold mb-2" style={{ fontSize: "0.95rem" }}>Warnings / Risks</h5>
                                      <ul className="mb-0 pl-3" style={{ fontSize: "0.9rem" }}>
                                        {auditData.warnings.map((w, idx) => <li key={idx} className="mb-1">{w}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                  {auditData.missingItems?.length > 0 && (
                                    <div className="rb-audit-section p-3 rounded" style={{ background: "#ffffff", border: "1px dashed #777777" }}>
                                      <h5 className="font-weight-bold mb-2" style={{ fontSize: "0.95rem", color: "#333333" }}>Missing Essentials</h5>
                                      <ul className="mb-0 pl-3" style={{ fontSize: "0.9rem", color: "#333333" }}>
                                        {auditData.missingItems.map((mi, idx) => <li key={idx} className="mb-1">{mi}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                  {auditData.strengths?.length > 0 && (
                                    <div className="rb-audit-section p-3 rounded" style={{ background: "#ffffff", border: "1px solid #000000" }}>
                                      <h5 className="font-weight-bold mb-2" style={{ fontSize: "0.95rem" }}>Key Strengths</h5>
                                      <ul className="mb-0 pl-3" style={{ fontSize: "0.9rem", color: "#333333" }}>
                                        {auditData.strengths.map((s, idx) => <li key={idx} className="mb-1">{s}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                  {auditData.recommendations?.length > 0 && (
                                    <div className="rb-audit-section p-3 rounded border" style={{ background: "#ffffff", borderColor: "#000000" }}>
                                      <h5 className="font-weight-bold mb-2" style={{ fontSize: "0.95rem", color: "var(--joyory-charcoal)" }}>Strategic Recommendations</h5>
                                      <ul className="mb-0 pl-3" style={{ fontSize: "0.9rem", color: "#333333" }}>
                                        {auditData.recommendations.map((r, idx) => <li key={idx} className="mb-1">{r}</li>)}
                                      </ul>
                                    </div>
                                  )}

                                </div>
                              </div>
                            ) : (
                              <p className="text-center text-muted">No audit data generated yet.</p>
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
                      <p className="text-muted text-journey">Outline your step-by-step product layering. Customize allergen slots and tracking durations.</p>
                    </div>

                    {/* New AI Budget & Optimization Insights Dashboard */}
                    {isAISuggested && aiBudgetSummary && (
                      <div className="mb-4" style={{
                        background: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid #e1e8ed",
                        borderRadius: "16px",
                        padding: "20px",
                        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.05)",
                        backdropFilter: "blur(10px)"
                      }}>
                        <div className="d-flex justify-content-between align-items-center mb-3" style={{ borderBottom: "1px solid #f1f4f6", paddingBottom: "12px" }}>
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontWeight: "700",
                            fontSize: "0.95rem",
                            color: "#1e293b",
                            letterSpacing: "-0.01em"
                          }}>
                            <span style={{ fontSize: "1.2rem" }}>✨</span> Joyory Smart Optimizer
                          </span>
                          <span style={{
                            background: aiBudgetSummary.withinBudget ? "#ecfdf5" : "#fffbeb",
                            color: aiBudgetSummary.withinBudget ? "#065f46" : "#92400e",
                            border: `1px solid ${aiBudgetSummary.withinBudget ? "#a7f3d0" : "#fde68a"}`,
                            borderRadius: "20px",
                            padding: "4px 12px",
                            fontSize: "0.85rem",
                            fontWeight: "600"
                          }}>
                            Routine Cost: <strong>₹{aiBudgetSummary.totalEstimated}</strong> {aiBudgetSummary.budgetINR && `(Limit: ₹${aiBudgetSummary.budgetINR})`}
                          </span>
                        </div>
                        
                        <div style={{
                          background: aiBudgetSummary.withinBudget ? "#f0fdf4" : "#fffdf5",
                          borderLeft: `4px solid ${aiBudgetSummary.withinBudget ? "#22c55e" : "#eab308"}`,
                          borderRadius: "8px",
                          padding: "16px",
                          marginBottom: "16px"
                        }}>
                          <div className="d-flex align-items-start gap-2">
                            <span style={{ fontSize: "1.2rem", lineHeight: "1.4" }}>
                              {aiBudgetSummary.withinBudget ? "✅" : "⚠️"}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{
                                margin: 0,
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                color: aiBudgetSummary.withinBudget ? "#166534" : "#854d0e",
                                lineHeight: "1.5"
                              }}>
                                {aiBudgetSummary.budgetNote}
                              </p>
                              {aiBudgetSummary.budgetRecommendation && (
                                <p style={{
                                  margin: "8px 0 0 0",
                                  fontSize: "0.85rem",
                                  color: "#475569",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}>
                                  <span style={{ fontSize: "1.1rem" }}>💡</span>
                                  {aiBudgetSummary.budgetRecommendation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {aiSafetyAdvice && (
                          <div style={{
                            background: "#fff1f2",
                            borderLeft: "4px solid #f43f5e",
                            borderRadius: "8px",
                            padding: "12px 16px",
                            marginBottom: "16px"
                          }}>
                            <div className="d-flex align-items-start gap-2">
                              <span style={{ fontSize: "1.2rem", lineHeight: "1.3" }}>🛡️</span>
                              <div style={{ flex: 1 }}>
                                <div style={{
                                  fontWeight: "700",
                                  fontSize: "0.85rem",
                                  color: "#9f1239",
                                  marginBottom: "4px",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.03em"
                                }}>
                                  Clinical Safety Warning & Patch Testing Guidance:
                                </div>
                                <p style={{
                                  margin: 0,
                                  fontSize: "0.85rem",
                                  color: "#be123c",
                                  lineHeight: "1.4"
                                }}>
                                  {aiSafetyAdvice}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}


                        {aiBudgetSummary.priorityPurchaseOrder && (
                          <div style={{ marginBottom: "16px" }}>
                            <div style={{
                              fontWeight: "600",
                              fontSize: "0.8rem",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              marginBottom: "8px"
                            }}>
                              Clinical Priority Purchase Sequence:
                            </div>
                            <div style={{
                              display: "flex",
                              flexWrap: "wrap",
                              alignItems: "center",
                              gap: "8px"
                            }}>
                              {aiBudgetSummary.priorityPurchaseOrder.split(" → ").map((step, sIdx) => (
                                <React.Fragment key={sIdx}>
                                  {sIdx > 0 && <span style={{ color: "#cbd5e1", fontWeight: "bold" }}>→</span>}
                                  <span style={{
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                    color: "#334155"
                                  }}>
                                    {step}
                                  </span>
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiBudgetSummary.droppedSteps && aiBudgetSummary.droppedSteps.length > 0 && (
                          <div>
                            <div style={{
                              fontWeight: "600",
                              fontSize: "0.8rem",
                              color: "#64748b",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              marginBottom: "8px"
                            }}>
                              Skipped Steps (Add when budget allows):
                            </div>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                              gap: "10px"
                            }}>
                              {aiBudgetSummary.droppedSteps.map((step, dIdx) => (
                                <div key={dIdx} style={{
                                  background: "#fdfdfd",
                                  border: "1px dashed #cbd5e1",
                                  borderRadius: "10px",
                                  padding: "10px 14px",
                                  position: "relative"
                                }}>
                                  <span style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "10px",
                                    fontSize: "0.7rem",
                                    fontWeight: "700",
                                    textTransform: "uppercase",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    background: step.timeOfDay === "AM" ? "#fff7ed" : "#f1f5f9",
                                    color: step.timeOfDay === "AM" ? "#c2410c" : "#475569"
                                  }}>
                                    {step.timeOfDay}
                                  </span>
                                  <div style={{
                                    fontWeight: "600",
                                    fontSize: "0.85rem",
                                    color: "#334155",
                                    marginBottom: "4px"
                                  }}>
                                    {step.stepLabel}
                                  </div>
                                  <div style={{
                                    fontSize: "0.75rem",
                                    color: "#64748b",
                                    lineHeight: "1.3"
                                  }}>
                                    {step.purpose}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}


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
                      <div className="steps-btns">
                        {steps.length > 0 && (
                          <button
                            type="button"
                            className="rb-btn-secondary"
                            style={{ padding: "6px 14px", fontSize: "0.85rem", background: "#ffffff", border: "1px solid #000000", color: "#000000" }}
                            onClick={handleCheckConflicts}
                            disabled={conflictChecking}
                          >
                            {conflictChecking ? "Checking conflicts..." : "Check Conflicts"}
                          </button>

                        )}
                        {steps.length > 1 && (
                          <button type="button" className="rb-btn-secondary" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={handleAutoSort} disabled={validatingOrder}>
                            <FaMagic /> {validatingOrder ? "Validating sequence..." : "Auto-Sort Layers"}
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
                      <div className="rb-steps-container-layout">
                        {/* Define the local step card renderer to avoid duplicating code */}
                        {(() => {
                          const renderStepCard = (step, idx, displayOrder) => (
                            <div key={idx} className={`rb-step-card ${step.allergenAlert ? "allergen-warning-border" : ""} ${(!step.isOwned && step.isRequired !== false) ? "rb-step-unowned-highlight" : ""}`} style={{ marginBottom: "16px" }}>
                              <div className="rb-step-number">{displayOrder}</div>

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
                                        
                                        {step.product && steps.filter(s => String(s.product) === String(step.product)).length > 1 && (
                                          <div style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            background: "#ecfdf5",
                                            color: "#059669",
                                            fontSize: "0.72rem",
                                            fontWeight: "600",
                                            padding: "2px 8px",
                                            borderRadius: "12px",
                                            marginTop: "4px",
                                            border: "1px solid #a7f3d0",
                                            width: "fit-content"
                                          }}>
                                            <span>✨</span> Shared AM/PM Product
                                          </div>
                                        )}

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

                                        <div className="d-flex align-items-center gap-2 mt-2 alr-chk">
                                          <input
                                            type="checkbox"
                                            id={`step-own-${idx}`}
                                            checked={step.isOwned || false}
                                            onChange={(e) => handleStepTextChange(idx, "isOwned", e.target.checked)}
                                            style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                          />
                                          <label htmlFor={`step-own-${idx}`} style={{ margin: 0, fontSize: "0.85rem", cursor: "pointer", fontWeight: "600", color: "var(--joyory-charcoal)" }}>
                                            I already own this product
                                          </label>
                                        </div>
                                      </div>
                                      <div className="d-flex flex-column gap-2 alt-rmv">
                                        <button
                                          type="button"
                                          className="rb-remove-selected-btn"
                                          style={{ color: "#000000", fontWeight: "600", fontSize: "0.80rem" }}
                                          onClick={() => handleOpenAlternatives(step.product, idx)}
                                        >
                                          Alternatives
                                        </button>

                                        <button
                                          type="button"
                                          className="rb-remove-selected-btn"
                                          onClick={() => handleStepProductSelect(idx, { _id: "", name: "", variants: [] })}
                                        >
                                          Remove
                                        </button>
                                      </div>
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
                                                <img src={prod.variants?.[0]?.images?.[0] || prod.image || "/placeholder.png"} alt={prod.name} className="rb-search-item-img" />
                                                <div className="rb-search-item-info">
                                                  <div className="rb-search-item-name">{prod.name}</div>
                                                  <div className="rb-search-item-brand">{typeof prod.brand === "string" ? prod.brand : prod.brand?.name}</div>
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

                                {/* Product Ownership Panel */}
                                {step.product && (
                                  <div className="rb-step-ownership-panel mt-3 p-3 rounded-lg bg-light border">
                                    <div className="rb-step-fields-row" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                                      <div className="rb-form-group">
                                        <label className="rb-label">Step Importance</label>
                                        <select
                                          value={step.isRequired !== false ? "true" : "false"}
                                          onChange={(e) => handleStepTextChange(idx, "isRequired", e.target.value === "true")}
                                          className="rb-select"
                                          style={{ padding: "8px 12px" }}
                                        >
                                          <option value="true">Required Step (Crucial)</option>
                                          <option value="false">Optional Step (Flexible)</option>
                                        </select>
                                      </div>
                                      <div className="rb-form-group">
                                        <label className="rb-label">Do you already own this product?</label>
                                        <select
                                          value={step.isOwned ? "true" : "false"}
                                          onChange={(e) => handleStepTextChange(idx, "isOwned", e.target.value === "true")}
                                          className="rb-select"
                                          style={{ padding: "8px 12px" }}
                                        >
                                          <option value="false">No (Need to Buy)</option>
                                          <option value="true">Yes (Already Owned)</option>
                                        </select>
                                      </div>
                                      {step.isOwned && (
                                        <>
                                          <div className="rb-form-group">
                                            <label className="rb-label">Where did you buy it?</label>
                                            <select
                                              value={step.ownershipType || "purchased_from_us"}
                                              onChange={(e) => handleStepTextChange(idx, "ownershipType", e.target.value || null)}
                                              className="rb-select"
                                              style={{ padding: "8px 12px" }}
                                            >
                                              <option value="purchased_from_us">Joyory Store</option>
                                              <option value="purchased_elsewhere">Elsewhere / Other Brand</option>
                                              <option value="">Received as Gift / Other</option>
                                            </select>
                                          </div>
                                          <div className="rb-form-group">
                                            <label className="rb-label">Purchase Source</label>
                                            <input
                                              type="text"
                                              placeholder="e.g. Website, Store, Gifted"
                                              value={step.purchaseSource || ""}
                                              onChange={(e) => handleStepTextChange(idx, "purchaseSource", e.target.value)}
                                              className="rb-input"
                                              style={{ padding: "8px 12px" }}
                                            />
                                          </div>
                                        </>
                                      )}
                                    </div>

                                    {!step.isOwned && (
                                      <div className="d-flex align-items-center justify-content-between p-3 mt-3 rounded bg-white flex-wrap gap-2" style={{ fontSize: "0.85rem", border: "1px dashed #000000", color: "#000000" }}>
                                        <div className="d-flex align-items-center gap-2 n-own">
                                          <span><strong>Not Owned:</strong> Buy from Joyory to unlock our 99% Satisfaction Guarantee, custom AI Coach tips, and daily progress analytics!</span>
                                        </div>
                                        <button
                                          type="button"
                                          className="rb-create-btn"
                                          style={{ padding: "6px 14px", fontSize: "0.8rem", background: "var(--joyory-charcoal)", color: "white", border: "none", borderRadius: "20px" }}
                                          onClick={async () => {
                                            try {
                                              const matchedProd = allProducts.find(p => String(p._id) === String(step.product));
                                              if (matchedProd) {
                                                const res = await axiosInstance.post("/api/user/cart/add", {
                                                  productId: step.product,
                                                  quantity: 1,
                                                  variants: step.selectedSku ? [{ variantSku: step.selectedSku, quantity: 1 }] : []
                                                });
                                                if (res.data && res.data.success) {
                                                  toast.success("Added product to cart! 🛍️");
                                                }
                                              }
                                            } catch (err) {
                                              console.error("Cart error", err);
                                              toast.error(err.response?.data?.message || "Failed to add product to cart.");
                                            }
                                          }}
                                        >
                                          Buy Now
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )}

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
                          );

                          // Calculate the AM and PM steps
                          const amStepsList = steps.map((s, i) => ({ step: s, index: i })).filter(item => item.step.timeOfDay === "AM" || item.step.timeOfDay === "both");
                          const pmStepsList = steps.map((s, i) => ({ step: s, index: i })).filter(item => item.step.timeOfDay === "PM" || item.step.timeOfDay === "both");

                          return (
                            <div style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "24px",
                              width: "100%",
                              marginTop: "20px"
                            }}>
                              {/* Morning Routine Column */}
                              <div style={{
                                flex: "1 1 450px",
                                background: "rgba(255, 255, 255, 0.6)",
                                borderRadius: "16px",
                                padding: "20px",
                                border: "1px solid #e2e8f0"
                              }}>
                                <div style={{
                                  background: "#fefce8",
                                  border: "1px solid #fef08a",
                                  borderRadius: "12px",
                                  padding: "12px 16px",
                                  marginBottom: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  fontWeight: "700",
                                  color: "#854d0e",
                                  fontSize: "1rem"
                                }}>
                                  <span style={{ fontSize: "1.3rem" }}>☀️</span> Morning Sequence (AM)
                                </div>
                                {amStepsList.length === 0 ? (
                                  <p className="text-muted text-center py-4">No morning steps defined.</p>
                                ) : (
                                  amStepsList.map((item, amIdx) => renderStepCard(item.step, item.index, amIdx + 1))
                                )}
                              </div>

                              {/* Evening Routine Column */}
                              <div style={{
                                flex: "1 1 450px",
                                background: "rgba(255, 255, 255, 0.6)",
                                borderRadius: "16px",
                                padding: "20px",
                                border: "1px solid #e2e8f0"
                              }}>
                                <div style={{
                                  background: "#f8fafc",
                                  border: "1px solid #cbd5e1",
                                  borderRadius: "12px",
                                  padding: "12px 16px",
                                  marginBottom: "20px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                  fontWeight: "700",
                                  color: "#334155",
                                  fontSize: "1rem"
                                }}>
                                  <span style={{ fontSize: "1.3rem" }}>🌙</span> Evening Sequence (PM)
                                </div>
                                {pmStepsList.length === 0 ? (
                                  <p className="text-muted text-center py-4">No evening steps defined.</p>
                                ) : (
                                  pmStepsList.map((item, pmIdx) => renderStepCard(item.step, item.index, pmIdx + 1))
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}


                    {/* Layering Validation Warnings */}
                    {layeringWarnings.length > 0 && (
                      <div className="rb-conflict-report mt-4 p-3 rounded-lg border" style={{ borderColor: "#000000", background: "#ffffff" }}>
                        <h4 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "1.10rem", fontWeight: "700", color: "#000000" }}>
                          <FaInfoCircle /> Smart Layering Sequence Alerts
                        </h4>
                        <ul className="pl-3 mb-3">
                          {layeringWarnings.map((warning, wIdx) => (
                            <li key={wIdx} className="mb-2" style={{ color: "#000000" }}>{warning}</li>
                          ))}
                        </ul>

                        <button
                          type="button"
                          className="rb-create-btn"
                          style={{ background: "var(--joyory-charcoal)", color: "white" }}
                          onClick={() => {
                            if (validatedCorrectedOrder) {
                              setSteps(validatedCorrectedOrder);
                              setLayeringWarnings([]);
                              setValidatedCorrectedOrder(null);
                              toast.success("Corrected order applied! 🧴✨");
                            }
                          }}
                        >
                          Apply Corrected Sequence
                        </button>
                      </div>
                    )}

                    {/* Ingredient Conflicts report */}
                    {(conflicts.length > 0 || conflictRecommendations.length > 0) && (
                      <div className="rb-conflict-report mt-4 p-3 rounded-lg border" style={{ borderColor: "#000000", background: "#ffffff" }}>
                        <h4 className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "1.10rem", fontWeight: "700" }}>
                          <FaExclamationTriangle style={{ color: "#000000" }} />
                          Regimen Compatibility Audit
                        </h4>
                        {conflicts.map((c, cIdx) => (
                          <div key={cIdx} className="mb-2 p-3 border d-flex flex-column gap-1" style={{ background: "#ffffff", borderColor: "#000000", borderStyle: "dashed" }}>
                            <strong>Conflict detected: {c.ingredients.join(" + ")}</strong>
                            <div>{c.warning}</div>
                            <div className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                              <strong>Suggested Fix:</strong> {c.suggestedFix}
                            </div>
                          </div>
                        ))}
                        {conflictRecommendations.map((rec, rIdx) => (
                          <div key={rIdx} className="mb-0 p-2 border" style={{ background: "#ffffff", borderColor: "#000000", color: "#000000" }}>
                            {rec}
                          </div>
                        ))}
                      </div>
                    )}

                    {steps.some(s => s.isRequired !== false && !s.isOwned) && (
                      <div className="d-flex align-items-center gap-2 mt-3 mb-3 p-3 rounded-lg border" style={{ background: "#ffffff", borderColor: "#000000", borderStyle: "dashed", color: "#000000" }}>
                        <FaExclamationTriangle style={{ color: "#000000", fontSize: "1.2rem" }} />
                        <span style={{ fontSize: "0.85rem" }}>
                          <strong>Product Ownership Warning:</strong> You have required steps in this routine that you do not own. Please purchase them or mark them as owned to complete your routine.
                        </span>
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

      {/* GLOBAL HELP GUIDE MODAL */}
      {showGuidance && (
        <div className="rb-modal-overlay" onClick={() => setShowGuidance(false)}>
          <div className="rb-modal-content rb-guide-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
              <div className="d-flex align-items-center gap-2">
                <FaLightbulb style={{ color: "var(--joyory-gold)", fontSize: "1.5rem" }} />
                <h3 className="font-weight-bold mb-0" style={{ fontFamily: "'Outfit', sans-serif" }}>Joyory Routine Builder & Tracker Guide</h3>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowGuidance(false)}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="rb-modal-steps-scroll" style={{ maxHeight: "550px", overflowY: "auto", paddingRight: "10px" }}>
              <p className="text-muted mb-4" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                Welcome to the Joyory Routine Builder! This tool is your digital skincare companion, helping you sequence products scientifically, manage layering conflicts, track daily check-ins, and achieve skin transformation.
              </p>

              <div className="rb-guide-sections-grid">

                {/* Section 1: What is it? */}
                <div className="rb-guide-section-card">
                  <h4 className="rb-guide-section-title">✨ What is the Routine Builder?</h4>
                  <p className="mb-0">
                    It is an advanced digital composer designed to sequence your skincare, cosmetic, and hair regimens into systematic morning (AM) and evening (PM) timeline steps.
                  </p>
                </div>

                {/* Section 2: Why is it here? */}
                <div className="rb-guide-section-card">
                  <h4 className="rb-guide-section-title">🛡️ Why use it? (Key Benefits)</h4>
                  <ul className="rb-guide-list mb-0">
                    <li>
                      <strong>Layering Conflict Prevention:</strong> Prevents harmful cosmetic layering (e.g. Retinol + Vitamin C) and arranges steps in correct molecular weight order.
                    </li>
                    <li>
                      <strong>Joyory 99% Satisfaction Guarantee:</strong> Logging daily progress tracks skin healing. Unlocks our guarantee when recommended routine sets are used.
                    </li>
                    <li>
                      <strong>Allergen Alerts:</strong> Automatically highlights steps that match ingredients from your quiz allergen profile.
                    </li>
                    <li>
                      <strong>Visual Skin Analytics:</strong> Tracks skin scores, compliance percentages, and stores before/after progress photos.
                    </li>
                  </ul>
                </div>

                {/* Section 3: How to use it? */}
                <div className="rb-guide-section-card">
                  <h4 className="rb-guide-section-title">🚀 How to use it?</h4>
                  <div className="rb-guide-steps-timeline">
                    <div className="rb-guide-step-item">
                      <div className="rb-guide-step-badge">1</div>
                      <div>
                        <strong>Compose Your Sequence:</strong> Manual-build using the <strong>Custom Builder</strong> tab or use <strong>Ask Coach</strong> to prompt our AI Beauty Advisor to draft a regimen. Or, load a pre-configured <strong>Starter Template</strong>.
                      </div>
                    </div>
                    <div className="rb-guide-step-item">
                      <div className="rb-guide-step-badge">2</div>
                      <div>
                        <strong>Verify Order & Compatibility:</strong> Click <strong>Auto-Sort Steps</strong> to correct layering order. Click <strong>Check Conflicts</strong> to scan active ingredients compatibility. Use <strong>Alternatives</strong> on steps to swap matches.
                      </div>
                    </div>
                    <div className="rb-guide-step-item">
                      <div className="rb-guide-step-badge">3</div>
                      <div>
                        <strong>Confirm Ownership:</strong> Check "I already own this" for steps you have, or buy missing items directly from our catalog to unlock full compliance tracking and satisfaction guarantee coverage.
                      </div>
                    </div>
                    <div className="rb-guide-step-item">
                      <div className="rb-guide-step-badge">4</div>
                      <div>
                        <strong>Track Your Journey:</strong> Visit the <strong>Tracker</strong> to complete daily AM/PM check-ins, rate your satisfaction, take progress photos/selfies, and consult the AI coach's daily skin tips.
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="rb-guarantee-banner mt-4">
                <span>⭐ <strong>99% Satisfaction Guarantee:</strong> 99% of users who maintained a daily routine consistency streak of over 30 days saw visible texture & tone improvements.</span>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4 pt-3 border-top">
              <button
                type="button"
                className="rb-btn-primary"
                onClick={() => setShowGuidance(false)}
                style={{ padding: "10px 30px" }}
              >
                Let's Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: AI Suggested Customizer Options Select */}
      {showAIDetectModal && aiDetectResult && (
        <div className="rb-modal-overlay">
          <div className="rb-modal-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-weight-bold mb-0">Personalized AI Regimen Builder</h3>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAIDetectModal(false)}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <h5 className="font-weight-bold" style={{ fontSize: "0.95rem" }}>Detected Goals:</h5>
              <div className="d-flex gap-2 flex-wrap mt-2">
                {aiDetectResult.goals?.map((g, idx) => (
                  <span key={idx} className="rb-badge rb-badge-goal">{formatGoalName(g)}</span>
                ))}
              </div>
            </div>

            <div className="rb-modal-steps-scroll" style={{ maxHeight: "450px", overflowY: "auto" }}>
              {aiDetectResult.recommendedCategories?.map((cat, idx) => {
                const recs = aiDetectRecommendations[cat];
                if (!recs) return null;
                const activeSelection = selectedAIMatches[cat] || "bestMatch";

                return (
                  <div key={idx} className="mb-4 p-3 rounded border bg-light">
                    <h5 className="font-weight-bold mb-3" style={{ fontSize: "1rem", color: "var(--joyory-charcoal)" }}>
                      Step {idx + 1}: {cat}
                    </h5>

                    <div className="rb-alternatives-row">
                      {/* Best Match */}
                      {recs.bestMatch && (
                        <div
                          className={`rb-alternative-card ${activeSelection === "bestMatch" ? "active" : ""}`}
                          onClick={() => setSelectedAIMatches(prev => ({ ...prev, [cat]: "bestMatch" }))}
                        >
                          <div className="rb-alt-label text-white" style={{ background: "#000000" }}>Recommended</div>
                          <img src={recs.bestMatch.variants?.[0]?.images?.[0] || recs.bestMatch.image || ""} alt={recs.bestMatch.name} />
                          <div className="rb-alt-name">{recs.bestMatch.name}</div>
                          <div className="rb-alt-price">₹{recs.bestMatch.price}</div>
                          <div className="rb-alt-rating">★ {recs.bestMatch.avgRating || 5}</div>
                        </div>
                      )}

                      {/* Budget Match */}
                      {recs.budgetMatch && (
                        <div
                          className={`rb-alternative-card ${activeSelection === "budgetMatch" ? "active" : ""}`}
                          onClick={() => setSelectedAIMatches(prev => ({ ...prev, [cat]: "budgetMatch" }))}
                        >
                          <div className="rb-alt-label text-white" style={{ background: "#555555" }}>Budget Match</div>
                          <img src={recs.budgetMatch.variants?.[0]?.images?.[0] || recs.budgetMatch.image || ""} alt={recs.budgetMatch.name} />
                          <div className="rb-alt-name">{recs.budgetMatch.name}</div>
                          <div className="rb-alt-price">₹{recs.budgetMatch.price}</div>
                          <div className="rb-alt-rating">★ {recs.budgetMatch.avgRating || 5}</div>
                        </div>
                      )}

                      {/* Premium Match */}
                      {recs.premiumMatch && (
                        <div
                          className={`rb-alternative-card ${activeSelection === "premiumMatch" ? "active" : ""}`}
                          onClick={() => setSelectedAIMatches(prev => ({ ...prev, [cat]: "premiumMatch" }))}
                        >
                          <div className="rb-alt-label text-white" style={{ background: "#222222" }}>Premium Match</div>
                          <img src={recs.premiumMatch.variants?.[0]?.images?.[0] || recs.premiumMatch.image || ""} alt={recs.premiumMatch.name} />
                          <div className="rb-alt-name">{recs.premiumMatch.name}</div>
                          <div className="rb-alt-price">₹{recs.premiumMatch.price}</div>
                          <div className="rb-alt-rating">★ {recs.premiumMatch.avgRating || 5}</div>
                        </div>
                      )}
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top">
                      <input
                        type="checkbox"
                        id={`ai-own-${cat}`}
                        checked={aiStepOwnership[cat] || false}
                        onChange={(e) => setAiStepOwnership(prev => ({ ...prev, [cat]: e.target.checked }))}
                        style={{ cursor: "pointer", width: "16px", height: "16px" }}
                      />
                      <label htmlFor={`ai-own-${cat}`} style={{ margin: 0, fontSize: "0.85rem", cursor: "pointer", fontWeight: "600", color: "var(--joyory-charcoal)" }}>
                        I already own a suitable product for this step
                      </label>
                    </div>

                    {!(aiStepOwnership[cat]) && (
                      <div className="mt-2 p-2 rounded text-left" style={{ fontSize: "0.8rem", background: "#ffffff", color: "#000000", border: "1px dashed #000000" }}>
                        <strong>Joyory Benefit:</strong> Buy this recommended product from us to unlock our 99% Satisfaction Guarantee, custom AI Skincare Coach tips, and automatic routine compliance scoring! (If you already bought it elsewhere, toggle above).
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            <div className="rb-guarantee-banner mb-3 mt-3">
              <span>⭐ <strong>99% Guarantee:</strong> 99% of users who followed this routine with Joyory products saw visible improvement within 30 days.</span>
            </div>

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button type="button" className="rb-btn-secondary" onClick={() => setShowAIDetectModal(false)}>
                Cancel
              </button>
              <button type="button" className="rb-create-btn" onClick={loadAIDetectedRoutine}>
                Load suggested routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Product Alternatives & Swap */}
      {showAlternativesModal && alternativesProduct && (
        <div className="rb-modal-overlay">
          <div className="rb-modal-content" style={{ maxWidth: "750px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="font-weight-bold mb-0">Alternative Suggestions</h3>
                <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
                  Swapping alternative products for: <strong>{alternativesProduct.productName}</strong>
                </p>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => { setShowAlternativesModal(false); setAlternativesData(null); }}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="rb-modal-steps-scroll" style={{ overflowY: "auto", flex: 1, paddingRight: "5px" }}>
              {alternativesLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" />
                  <p className="mt-2 text-muted">Searching catalog for suitable swaps...</p>
                </div>
              ) : alternativesData ? (
                <div className="rb-alternatives-row mt-4">
                  {/* Budget Option */}
                  {alternativesData.budgetMatch ? (
                    <div className="rb-alternative-card select-swap">
                      <div className="rb-alt-label text-white" style={{ background: "#555555" }}>Budget Swap</div>
                      <img src={alternativesData.budgetMatch.variants?.[0]?.images?.[0] || alternativesData.budgetMatch.image || ""} alt={alternativesData.budgetMatch.name} />
                      <div className="rb-alt-name">{alternativesData.budgetMatch.name}</div>
                      <div className="rb-alt-price">₹{alternativesData.budgetMatch.price}</div>
                      <div className="rb-alt-rating">★ {alternativesData.budgetMatch.avgRating || 5}</div>
                      <button
                        type="button"
                        className="rb-create-btn justify-content-center w-100 mt-2"
                        style={{ padding: "8px", fontSize: "0.8rem" }}
                        onClick={() => handleSwapProduct(alternativesData.budgetMatch)}
                      >
                        Swap Product
                      </button>
                    </div>
                  ) : (
                    <div className="rb-alternative-card disabled select-swap">
                      <p className="text-muted m-0 p-3">No budget match alternative available in this category.</p>
                    </div>
                  )}

                  {/* Premium Option */}
                  {alternativesData.premiumMatch ? (
                    <div className="rb-alternative-card select-swap">
                      <div className="rb-alt-label text-white" style={{ background: "#222222" }}>Premium Swap</div>
                      <img src={alternativesData.premiumMatch.variants?.[0]?.images?.[0] || alternativesData.premiumMatch.image || ""} alt={alternativesData.premiumMatch.name} />
                      <div className="rb-alt-name">{alternativesData.premiumMatch.name}</div>
                      <div className="rb-alt-price">₹{alternativesData.premiumMatch.price}</div>
                      <div className="rb-alt-rating">★ {alternativesData.premiumMatch.avgRating || 5}</div>
                      <button
                        type="button"
                        className="rb-create-btn justify-content-center w-100 mt-2"
                        style={{ padding: "8px", fontSize: "0.8rem" }}
                        onClick={() => handleSwapProduct(alternativesData.premiumMatch)}
                      >
                        Swap Product
                      </button>
                    </div>
                  ) : (
                    <div className="rb-alternative-card disabled select-swap">
                      <p className="text-muted m-0 p-3">No premium match alternative available in this category.</p>
                    </div>
                  )}

                  {/* Sensitive Skin friendly Option */}
                  {alternativesData.sensitiveMatch ? (
                    <div className="rb-alternative-card select-swap">
                      <div className="rb-alt-label text-white" style={{ background: "#888888" }}>Gentle Swap</div>
                      <img src={alternativesData.sensitiveMatch.variants?.[0]?.images?.[0] || alternativesData.sensitiveMatch.image || ""} alt={alternativesData.sensitiveMatch.name} />
                      <div className="rb-alt-name">{alternativesData.sensitiveMatch.name}</div>
                      <div className="rb-alt-price">₹{alternativesData.sensitiveMatch.price}</div>
                      <div className="rb-alt-rating">★ {alternativesData.sensitiveMatch.avgRating || 5}</div>
                      <button
                        type="button"
                        className="rb-create-btn justify-content-center w-100 mt-2"
                        style={{ padding: "8px", fontSize: "0.8rem" }}
                        onClick={() => handleSwapProduct(alternativesData.sensitiveMatch)}
                      >
                        Swap Product
                      </button>
                    </div>
                  ) : (
                    <div className="rb-alternative-card disabled select-swap">
                      <p className="text-muted m-0 p-3">No gentle match alternative available in this category.</p>
                    </div>
                  )}
                </div>

              ) : (
                <p className="text-center text-muted">No alternative products found in this category.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Webcam Selfie Camera Modal */}
      {showCameraModal && (
        <div className="rb-modal-overlay d-flex align-items-center justify-content-center" style={{ zIndex: 2000 }}>
          <div className="rb-modal-content text-center" style={{ maxWidth: "500px", padding: "24px", borderRadius: "16px", background: "white" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className="font-weight-bold mb-0" style={{ fontSize: "1.2rem" }}>Take Selfie</h3>
              <button
                type="button"
                className="btn-close"
                onClick={stopCamera}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="position-relative overflow-hidden rounded-lg mb-3" style={{ background: "#000", height: "320px", border: "2px solid var(--joyory-border)" }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}
              />
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button
                type="button"
                className="rb-btn-secondary"
                onClick={stopCamera}
                style={{ padding: "10px 20px" }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rb-create-btn d-flex align-items-center gap-2"
                onClick={captureSelfie}
                style={{ padding: "10px 24px", background: "var(--joyory-charcoal)" }}
              >
                📸 Capture Photo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer: Active Reminders / Notifications */}
      {showReminderDrawer && (
        <>
          <div className="rb-notif-overlay" onClick={() => setShowReminderDrawer(false)} />
          <div className={`rb-notif-drawer ${showReminderDrawer ? "open" : ""}`}>
            <div className="rb-notif-drawer-header">
              <h4 className="m-0 font-weight-bold" style={{ fontSize: "1.1rem" }}>Notifications & Reminders</h4>
              <button
                type="button"
                className="rb-notif-close-btn"
                onClick={() => setShowReminderDrawer(false)}
                style={{ border: "none", background: "none", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="rb-notif-drawer-body">
              {activeReminders.length === 0 ? (
                <div className="text-center py-5">
                  <span style={{ fontSize: "2rem" }}>🎉</span>
                  <p className="text-muted mt-2">All caught up! No active reminders.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {activeReminders.map((reminder, idx) => (
                    <div
                      key={idx}
                      className="rb-notif-card"
                      style={{
                        borderColor: reminder.type === "AM" ? "#90caf9" : "#b39ddb",
                        background: reminder.type === "AM" ? "#f1f8ff" : "#fbf9ff"
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex gap-2">
                          <span style={{ fontSize: "1.25rem" }}>
                            {reminder.type === "AM" ? "☀️" : "🌙"}
                          </span>
                          <div>
                            <h5 className="rb-notif-title">{reminder.routineName}</h5>
                            <p className="rb-notif-msg">{reminder.message}</p>

                            {/* Streak Badge */}
                            {reminder.streakCount > 0 && (
                              <span className="rb-notif-streak-badge">
                                🔥 {reminder.streakCount} day streak
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="rb-notif-card-dismiss"
                          onClick={() => handleDismissReminder(idx)}
                          title="Dismiss"
                          style={{ border: "none", background: "none", fontSize: "0.95rem", cursor: "pointer", opacity: 0.6 }}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="d-flex justify-content-end mt-3">
                        <button
                          type="button"
                          className="rb-notif-cta-btn"
                          style={{
                            background: reminder.type === "AM" ? "#0d47a1" : "#4a148c"
                          }}
                          onClick={async () => {
                            const fullRoutine = routines.find(r => String(r._id) === String(reminder.routineId));
                            if (fullRoutine) {
                              await handleOpenTracker(fullRoutine, reminder.type);
                              setShowReminderDrawer(false);
                            }
                          }}
                        >
                          {reminder.cta || "Check In"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default RoutineBuilder;




