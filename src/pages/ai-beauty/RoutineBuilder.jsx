import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaClock, FaPlus, FaCartPlus, FaMagic, FaCalendarAlt, FaLightbulb, FaInfoCircle
} from "react-icons/fa";
import {
  getMyRoutines,
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getPublicRoutine,
  shareRoutine,
  getActiveReminders,
  getRoutineTemplates,
  aiBuildRoutine,
  checkRoutineConflicts,
  validateRoutineOrder,
  getRoutineAudit,
  getRoutineCoach,
  getRoutineLogs,
  getRoutineCalendar,
  uploadProgressPhoto,
  getProductAlternatives,
  cloneRoutine,
  getRoutineSuggestions,
  addRoutineToCart,
  logRoutineStep,
} from "../../api/routineApi";
import { getAllProducts } from "../../api/productApi";
import { addToCart as apiAddToCart } from "../../api/cartApi";
import { getErrorMessage } from "../../utils/errorHandler";
import { UserContext } from "../../context/UserContext";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import Sidebarcomon from "../../components/common/SidebarCommon";
import "../../styles/RoutineBuilder.css";

// Modular subcomponents
import RoutineCard from "../../components/sections/routines/RoutineCard";
import RoutineStepEditor from "../../components/sections/routines/RoutineStepEditor";
import RoutineTracker from "../../components/sections/routines/RoutineTracker";
import RoutineAlternativesModal from "../../components/sections/routines/RoutineAlternativesModal";

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
  return SKINCARE_LAYER_ORDER.length;
}

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
  const [activeTab, setActiveTab] = useState("my"); // "my", "templates", "builder", or "tracker"
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

  // Goal Fields
  const [routineGoal, setRoutineGoal] = useState("general_wellness");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [durationDays, setDurationDays] = useState(30);
  const [startDate, setStartDate] = useState(getTodayDateString());

  // Search States
  const [searchQueries, setSearchQueries] = useState({});
  const [showDropdown, setShowDropdown] = useState({});

  // Tracker States
  const [activeTrackerRoutine, setActiveTrackerRoutine] = useState(null);
  const [trackerTab, setTrackerTab] = useState("checkin");
  const [trackerLogs, setTrackerLogs] = useState([]);
  const [trackerStats, setTrackerStats] = useState({
    currentDay: 1,
    durationDays: 30,
    complianceRate: 0,
    amCompletedCount: 0,
    pmCompletedCount: 0,
  });
  const [ratingsTrend, setRatingsTrend] = useState([]);
  const [calendarGrid, setCalendarGrid] = useState([]);
  const [progressPhotos, setProgressPhotos] = useState([""]);
  const [showGuidance, setShowGuidance] = useState(false);

  // Checkin Entry Form
  const [logDate, setLogDate] = useState(getTodayDateString());
  const [amCompleted, setAmCompleted] = useState(false);
  const [pmCompleted, setPmCompleted] = useState(false);
  const [skinRating, setSkinRating] = useState(0);
  const [diaryNote, setDiaryNote] = useState("");
  const [isSavingLog, setIsSavingLog] = useState(false);

  // Templates
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // AI & Reminders
  const [activeReminders, setActiveReminders] = useState([]);
  const [aiPromptQuery, setAiPromptQuery] = useState("");
  const [aiDetectLoading, setAiDetectLoading] = useState(false);
  const [aiBudgetSummary, setAiBudgetSummary] = useState(null);
  const [aiSafetyAdvice, setAiSafetyAdvice] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

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
      const res = await getMyRoutines();
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

  // --- Load Catalog Products ---
  const fetchCatalogProducts = async () => {
    if (allProducts.length > 0 || productsLoading) return;
    try {
      setProductsLoading(true);
      const res = await getAllProducts({ limit: 100 });
      let products = [];
      if (res.data && Array.isArray(res.data.products)) {
        products = res.data.products;
      } else if (Array.isArray(res.data)) {
        products = res.data;
      }

      const productMap = new Map();
      products.forEach(p => {
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
      const res = await getPublicRoutine(shareToken);
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

  const fetchActiveReminders = async () => {
    if (!user || user.guest) return;
    try {
      const res = await getActiveReminders();
      if (res.data && res.data.success) {
        setActiveReminders(res.data.reminders || []);
      }
    } catch (err) {
      console.error("Error fetching active reminders:", err);
    }
  };

  const fetchRoutineTemplates = async () => {
    try {
      setTemplatesLoading(true);
      const res = await getRoutineTemplates();
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
      const res = await aiBuildRoutine(aiPromptQuery);
      if (res.data && res.data.success) {
        const data = res.data;
        const newSteps = [];

        const processStep = (s) => {
          if (!s.productFound || !s.product) {
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

          const product = s.product;
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

        if (data.amSteps && data.amSteps.length > 0) {
          data.amSteps.forEach(s => newSteps.push(processStep(s)));
        }
        if (data.pmSteps && data.pmSteps.length > 0) {
          data.pmSteps.forEach(s => newSteps.push(processStep(s)));
        }

        setSteps(newSteps);

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
      const res = await checkRoutineConflicts(productIds);
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
        const res = await getRoutineAudit(activeTrackerRoutine._id);
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
        const res = await getRoutineCoach(activeTrackerRoutine._id);
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

      const res = await getProductAlternatives(productId);
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
      const res = await cloneRoutine(shareToken);
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

  useEffect(() => {
    if (activeReminders.length > 0) {
      const sessionOpened = sessionStorage.getItem("rb_reminders_auto_opened");
      if (!sessionOpened) {
        setShowReminderDrawer(true);
        sessionStorage.setItem("rb_reminders_auto_opened", "true");
      }
    }
  }, [activeReminders]);

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

      const res = await addRoutineToCart(id);
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
      const res = await shareRoutine(id);
      if (res.data && res.data.shareToken) {
        const shareUrl = `${window.location.origin}/routines/${res.data.shareToken}`;
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Routine link copied to clipboard! ✨");
      }
    } catch (err) {
      console.error("Share error:", err);
      toast.error("Failed to generate share link.");
    }
  };

  // --- Delete Routine ---
  const handleDeleteRoutine = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this routine?");
    if (!confirm) return;

    try {
      const res = await deleteRoutine(id);
      if (res.data && res.data.success) {
        toast.success("Routine deleted.");
        setRoutines(routines.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete routine.");
    }
  };

  // --- Edit Routine ---
  const handleEditRoutine = (routine) => {
    setEditingRoutineId(routine._id);
    setRoutineName(routine.name);
    setRoutineDesc(routine.description || "");
    setRoutineType(routine.routineType || "skincare");
    setTimeOfDay(routine.timeOfDay || "AM");
    setEstimatedMinutes(routine.estimatedMinutes || "");
    setRoutineGoal(routine.goal || "general_wellness");
    setMilestoneTitle(routine.milestoneTitle || "");
    setDurationDays(routine.durationDays || 30);
    setStartDate(routine.startDate ? routine.startDate.split('T')[0] : getTodayDateString());
    setIsAISuggested(routine.isAISuggested || false);

    const formSteps = (routine.steps || []).map(s => {
      const matched = allProducts.find(p => String(p._id) === String(s.product?._id || s.product)) || {};
      return {
        stepOrder: s.stepOrder,
        stepLabel: s.stepLabel || "",
        product: s.product?._id || s.product,
        productName: s.product?.name || s.productName,
        productImage: s.productImage || s.product?.variants?.[0]?.images?.[0] || matched.image || "",
        selectedSku: s.selectedSku,
        note: s.note || "",
        applicationTip: s.applicationTip || "",
        timeOfDay: s.timeOfDay || "both",
        allergenAlert: s.allergenAlert || false,
        allergenAlertMessage: s.allergenAlertMessage || null,
        variants: matched.variants || s.product?.variants || [],
        isOwned: s.isOwned ?? false,
        isRequired: s.isRequired ?? true,
        ownershipType: s.ownershipType || null,
        purchaseSource: s.purchaseSource || null
      };
    });

    setSteps(formSteps);
    setActiveTab("builder");
  };

  // --- Open Tracker View ---
  const handleOpenTracker = async (routine, initialType = null) => {
    setActiveTrackerRoutine(routine);
    setActiveTab("tracker");
    setTrackerTab("checkin");
    setLogDate(getTodayDateString());

    if (initialType === "AM") {
      setAmCompleted(true);
      setPmCompleted(false);
    } else if (initialType === "PM") {
      setAmCompleted(false);
      setPmCompleted(true);
    }

    try {
      const logsRes = await getRoutineLogs(routine._id);
      if (logsRes.data && logsRes.data.success) {
        setTrackerLogs(logsRes.data.logs || []);
        setTrackerStats(logsRes.data.stats || {
          currentDay: 1,
          durationDays: routine.durationDays || 30,
          complianceRate: 0
        });
        setRatingsTrend(logsRes.data.ratingsTrend || []);
      }

      const calRes = await getRoutineCalendar(routine._id);
      if (calRes.data && calRes.data.success) {
        setCalendarGrid(calRes.data.calendar || []);
      }
    } catch (err) {
      console.error("Tracker fetch error:", err);
      toast.error("Failed to load routine logs.");
    }
  };

  const handleTrackerDateChange = (newDate) => {
    setLogDate(newDate);
    const existingLog = trackerLogs.find(l => l.dateString === newDate);
    if (existingLog) {
      setAmCompleted(existingLog.amCompleted);
      setPmCompleted(existingLog.pmCompleted);
      setSkinRating(existingLog.skinSatisfactionRating || 0);
      setDiaryNote(existingLog.notes || "");
      if (existingLog.progressPhotos && existingLog.progressPhotos.length > 0) {
        setProgressPhotos(existingLog.progressPhotos.map(p => typeof p === 'object' && p.photoUrl ? p.photoUrl : p));
      } else if (existingLog.photoUrl) {
        setProgressPhotos([existingLog.photoUrl]);
      } else {
        setProgressPhotos([""]);
      }
    } else {
      setAmCompleted(false);
      setPmCompleted(false);
      setSkinRating(0);
      setDiaryNote("");
      setProgressPhotos([""]);
    }
  };

  // --- Save Daily Log ---
  const handleSaveDailyLog = async (e) => {
    e.preventDefault();
    if (!activeTrackerRoutine) return;

    try {
      setIsSavingLog(true);
      const cleanPhotos = progressPhotos.filter(Boolean).map(url => ({
        photoUrl: url,
        caption: diaryNote ? diaryNote.substring(0, 40) : "Daily check-in photo"
      }));

      const payload = {
        routineId: activeTrackerRoutine._id,
        date: logDate,
        amCompleted,
        pmCompleted,
        skinSatisfactionRating: skinRating || null,
        notes: diaryNote.trim() || null,
        progressPhotos: cleanPhotos,
        photoUrl: cleanPhotos[0]?.photoUrl || null
      };

      const res = await logRoutineStep(payload);
      if (res.data && res.data.success) {
        toast.success("Daily routine log recorded! ✨");
        if (res.data.newBadges?.length > 0) {
          toast.success(`🎉 New Badge Unlocked: ${res.data.newBadges.join(", ")}!`);
        }
        await handleOpenTracker(activeTrackerRoutine);
      }
    } catch (err) {
      console.error("Daily log error:", err);
      toast.error(err.response?.data?.message || "Failed to save daily check-in.");
    } finally {
      setIsSavingLog(false);
    }
  };

  // --- Progress Photo Upload ---
  const handleProgressPhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setPhotoUploading(true);
      const formData = new FormData();
      formData.append("photo", file);

      const res = await uploadProgressPhoto(formData);
      if (res.data && res.data.success) {
        const uploadedUrl = res.data.photoUrl;
        setProgressPhotos(prev => [...prev.filter(Boolean), uploadedUrl]);
        toast.success("Progress photo uploaded successfully!");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      toast.error("Failed to upload progress photo.");
    } finally {
      setPhotoUploading(false);
    }
  };

  // --- Selfie Camera Functions ---
  const startCamera = async () => {
    try {
      setShowCameraModal(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      toast.error("Could not access camera. Please check permissions.");
      setShowCameraModal(false);
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
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      stopCamera();
      try {
        setPhotoUploading(true);
        const formData = new FormData();
        formData.append("photo", blob, "selfie.jpg");

        const res = await uploadProgressPhoto(formData);
        if (res.data && res.data.success) {
          const uploadedUrl = res.data.photoUrl;
          setProgressPhotos(prev => [...prev.filter(Boolean), uploadedUrl]);
          toast.success("Selfie captured and attached! 📸");
        }
      } catch (err) {
        console.error("Selfie upload error:", err);
        toast.error("Failed to upload selfie.");
      } finally {
        setPhotoUploading(false);
      }
    }, "image/jpeg", 0.9);
  };

  // --- Step Editing Handlers ---
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
        variants: [],
        isOwned: false,
        isRequired: true,
        ownershipType: null,
        purchaseSource: null
      }
    ]);
  };

  const handleRemoveStep = (idx) => {
    setSteps(steps.filter((_, i) => i !== idx));
  };

  const handleMoveStep = (idx, dir) => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const updated = [...steps];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSteps(updated);
  };

  const handleStepProductSelect = (stepIdx, product) => {
    const updated = [...steps];
    const image = product.variants?.[0]?.images?.[0] || product.image || "";
    const sku = product.variants?.[0]?.sku || "";
    const tip = product.howToUse?.[0] || "";

    updated[stepIdx] = {
      ...updated[stepIdx],
      product: product._id,
      productName: product.name,
      productImage: image,
      selectedSku: sku,
      applicationTip: tip || updated[stepIdx].applicationTip,
      variants: product.variants || []
    };

    setSteps(updated);
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
      const res = await validateRoutineOrder(cleanSteps);
      if (res.data && res.data.success) {
        const { orderWarnings, correctedOrder } = res.data;
        if (orderWarnings && orderWarnings.length > 0) {
          setLayeringWarnings(orderWarnings);
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
        const res = await updateRoutine(editingRoutineId, payload);
        if (res.data && res.data.success) {
          toast.success("Routine updated successfully ✨");
        }
      } else {
        const res = await createRoutine(payload);
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

  // Public Shared Routine View
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
                <span className="rb-badge rb-badge-time">{publicRoutine.timeOfDay}</span>
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
                          <div className="rb-public-step-variant">SKU: {step.selectedSku}</div>
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

  // Dashboard Flow
  return (
    <>
      <Header />
      <div className="ua-page mt-0 mt-lg-0 pt-lg-3 pt-md-5">
        <section className="Heading-Name mt-lg-5 mt-0 pt-lg-3 mt-md-0 pt-md-0">
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

                {/* My Routines List */}
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
                          <RoutineCard
                            key={routine._id}
                            routine={routine}
                            formatGoalName={formatGoalName}
                            onOpenTracker={handleOpenTracker}
                            onEditRoutine={handleEditRoutine}
                            onShareRoutine={handleShareRoutine}
                            onDeleteRoutine={handleDeleteRoutine}
                            onAddRoutineToCart={handleAddRoutineToCart}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Templates Tab */}
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
                                  <span className="rb-badge rb-badge-time">{template.durationDays} Days</span>
                                  <span className="rb-badge rb-badge-type">{template.difficulty}</span>
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

                {/* Tracker View */}
                {activeTab === "tracker" && activeTrackerRoutine && (
                  <RoutineTracker
                    activeTrackerRoutine={activeTrackerRoutine}
                    trackerStats={trackerStats}
                    trackerTab={trackerTab}
                    onTabChange={handleTrackerTabChange}
                    onBack={() => { setActiveTrackerRoutine(null); setActiveTab("my"); }}
                    formatGoalName={formatGoalName}
                    onAddRoutineToCart={handleAddRoutineToCart}
                    logDate={logDate}
                    onTrackerDateChange={handleTrackerDateChange}
                    amCompleted={amCompleted}
                    setAmCompleted={setAmCompleted}
                    pmCompleted={pmCompleted}
                    setPmCompleted={setPmCompleted}
                    skinRating={skinRating}
                    setSkinRating={setSkinRating}
                    diaryNote={diaryNote}
                    setDiaryNote={setDiaryNote}
                    progressPhotos={progressPhotos}
                    setProgressPhotos={setProgressPhotos}
                    photoUploading={photoUploading}
                    onStartCamera={startCamera}
                    onProgressPhotoUpload={handleProgressPhotoUpload}
                    onSaveDailyLog={handleSaveDailyLog}
                    isSavingLog={isSavingLog}
                    calendarGrid={calendarGrid}
                    getCellClassName={getCellClassName}
                    ratingsTrend={ratingsTrend}
                    trackerLogs={trackerLogs}
                    coachLoading={coachLoading}
                    coachAdvice={coachAdvice}
                    coachTips={coachTips}
                    auditLoading={auditLoading}
                    auditData={auditData}
                  />
                )}

                {/* Custom Builder Tab */}
                {activeTab === "builder" && (
                  <form onSubmit={handleSaveRoutine} className="rb-form-card">
                    <div className="rb-form-header">
                      <h2>{editingRoutineId ? "Edit Routine Journey" : "Design A Goal Skincare Journey"}</h2>
                      <p className="text-muted text-journey">Outline your step-by-step product layering. Customize allergen slots and tracking durations.</p>
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
                          <button
                            type="button"
                            className="rb-btn-secondary"
                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                            onClick={handleAutoSort}
                            disabled={validatingOrder}
                          >
                            <FaMagic /> {validatingOrder ? "Validating sequence..." : "Auto-Sort Layers"}
                          </button>
                        )}
                        <button
                          type="button"
                          className="rb-create-btn"
                          style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                          onClick={handleAddStep}
                        >
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
                        {(() => {
                          const amStepsList = steps.map((s, i) => ({ step: s, index: i })).filter(item => item.step.timeOfDay === "AM" || item.step.timeOfDay === "both");
                          const pmStepsList = steps.map((s, i) => ({ step: s, index: i })).filter(item => item.step.timeOfDay === "PM" || item.step.timeOfDay === "both");

                          return (
                            <div className="rb-sequences-layout-grid">
                              {/* Morning Routine Column */}
                              <div className="rb-sequence-column morning-col">
                                <div className="rb-sequence-header morning-header">
                                  <span>🟡</span> Morning Sequence (AM)
                                </div>
                                {amStepsList.length === 0 ? (
                                  <div className="text-muted text-center py-4 bg-white rounded border" style={{ fontSize: "0.88rem" }}>
                                    No morning steps defined.
                                  </div>
                                ) : (
                                  amStepsList.map((item, amIdx) => (
                                    <RoutineStepEditor
                                      key={item.index}
                                      step={item.step}
                                      idx={item.index}
                                      displayIndex={amIdx + 1}
                                      allProducts={allProducts}
                                      searchQueries={searchQueries}
                                      showDropdown={showDropdown}
                                      onSearchChange={(i, text) => {
                                        setSearchQueries(prev => ({ ...prev, [i]: text }));
                                        setShowDropdown(prev => ({ ...prev, [i]: true }));
                                      }}
                                      onStepProductSelect={handleStepProductSelect}
                                      onStepVariantChange={handleStepVariantChange}
                                      onStepTextChange={handleStepTextChange}
                                      onOpenAlternatives={handleOpenAlternatives}
                                      onRemoveStep={handleRemoveStep}
                                      onMoveStep={handleMoveStep}
                                      onAddToCart={async (st) => {
                                        try {
                                          const matchedProd = allProducts.find(p => String(p._id) === String(st.product));
                                          if (matchedProd) {
                                            const res = await apiAddToCart({
                                              productId: st.product,
                                              quantity: 1,
                                              variants: st.selectedSku ? [{ variantSku: st.selectedSku, quantity: 1 }] : []
                                            });
                                            if (res.data && res.data.success) {
                                              toast.success("Added product to cart! 🛍️");
                                            }
                                          }
                                        } catch (err) {
                                          console.error("Cart error", err);
                                          toast.error(getErrorMessage(err, "Failed to add product to cart."));
                                        }
                                      }}
                                      totalSteps={steps.length}
                                      getFilteredProducts={getFilteredProducts}
                                    />
                                  ))
                                )}
                              </div>

                              {/* Evening Routine Column */}
                              <div className="rb-sequence-column evening-col">
                                <div className="rb-sequence-header evening-header">
                                  <span>🌙</span> Evening Sequence (PM)
                                </div>
                                {pmStepsList.length === 0 ? (
                                  <div className="text-muted text-center py-4 bg-white rounded border" style={{ fontSize: "0.88rem" }}>
                                    No evening steps defined.
                                  </div>
                                ) : (
                                  pmStepsList.map((item, pmIdx) => (
                                    <RoutineStepEditor
                                      key={item.index}
                                      step={item.step}
                                      idx={item.index}
                                      displayIndex={pmIdx + 1}
                                      allProducts={allProducts}
                                      searchQueries={searchQueries}
                                      showDropdown={showDropdown}
                                      onSearchChange={(i, text) => {
                                        setSearchQueries(prev => ({ ...prev, [i]: text }));
                                        setShowDropdown(prev => ({ ...prev, [i]: true }));
                                      }}
                                      onStepProductSelect={handleStepProductSelect}
                                      onStepVariantChange={handleStepVariantChange}
                                      onStepTextChange={handleStepTextChange}
                                      onOpenAlternatives={handleOpenAlternatives}
                                      onRemoveStep={handleRemoveStep}
                                      onMoveStep={handleMoveStep}
                                      onAddToCart={async (st) => {
                                        try {
                                          const matchedProd = allProducts.find(p => String(p._id) === String(st.product));
                                          if (matchedProd) {
                                            const res = await apiAddToCart({
                                              productId: st.product,
                                              quantity: 1,
                                              variants: st.selectedSku ? [{ variantSku: st.selectedSku, quantity: 1 }] : []
                                            });
                                            if (res.data && res.data.success) {
                                              toast.success("Added product to cart! 🛍️");
                                            }
                                          }
                                        } catch (err) {
                                          console.error("Cart error", err);
                                          toast.error(getErrorMessage(err, "Failed to add product to cart."));
                                        }
                                      }}
                                      totalSteps={steps.length}
                                      getFilteredProducts={getFilteredProducts}
                                    />
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* Layering Warnings */}
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

                    <div className="d-flex justify-content-end align-items-center gap-3 mt-4 pt-4 border-top">
                      <button
                        type="button"
                        onClick={() => { resetForm(); setActiveTab("my"); }}
                        style={{
                          height: "44px",
                          minWidth: "150px",
                          padding: "10px 24px",
                          margin: 0,
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          background: "#000000",
                          color: "#ffffff",
                          border: "none",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          height: "44px",
                          minWidth: "150px",
                          padding: "10px 24px",
                          margin: 0,
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "600",
                          background: "#000000",
                          color: "#ffffff",
                          border: "none",
                          cursor: loading ? "not-allowed" : "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {editingRoutineId ? "Update Routine" : "Save Routine"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Alternatives Modal */}
      <RoutineAlternativesModal
        show={showAlternativesModal}
        alternativesProduct={alternativesProduct}
        alternativesLoading={alternativesLoading}
        alternativesData={alternativesData}
        onClose={() => { setShowAlternativesModal(false); setAlternativesData(null); }}
        onSwapProduct={handleSwapProduct}
      />

      {/* Selfie Camera Modal */}
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
              <button type="button" className="rb-btn-secondary" onClick={stopCamera} style={{ padding: "10px 20px" }}>
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

      {/* Reminders Drawer */}
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
