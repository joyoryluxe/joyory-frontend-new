/**
 * src/utils/endpoints.js
 * Centralized API endpoints registry for the entire web application.
 * Categorized by page, section, and feature domain.
 * All paths verified against actual backend route files in server.js.
 */

export const endpoints = {
  // ── 1. Authentication & Security (Login, Signup, OTP, Passwords) ──
  auth: {
    login: "/api/user/login",
    signup: "/api/user/signup",
    logout: "/api/user/logout",
    deleteAccount: "/api/user/delete-account",
    forgotPassword: "/api/security/forgot-password",
    resetPassword: "/api/security/reset-password",
    sendOtp: "/api/security/send-otp",
    verifyOtp: "/api/security/verify-otp",
    // Phone-first OTP Auth (mounted at /api/user)
    phoneOtpSend: "/api/user/otp/send",
    phoneOtpVerify: "/api/user/otp/verify",
    phoneCompleteProfile: "/api/user/otp/complete-profile",
  },

  // ── 2. User Account & Profile ──
  //    (userProfileRoutes mounted at /api/user/profile)
  user: {
    getProfile: "/api/user/profile",
    updateProfile: "/api/user/profile",          // PATCH
    avatar: "/api/user/profile/avatar",           // GET / POST / DELETE
    addresses: "/api/user/profile/address",       // GET / POST
    updateAddress: (id) => `/api/user/profile/address/${id}`,  // PATCH
    deleteAddress: (id) => `/api/user/profile/address/${id}`,  // DELETE
    profileSendOtp: "/api/user/profile/send-otp",
    profileVerifyOtp: "/api/user/profile/verify-otp",
  },

  // ── 3. Wallet ──
  //    (userWalletRoutes mounted at /api/user/wallet)
  wallet: {
    get: "/api/user/wallet",
    createOrder: "/api/user/wallet/create-order",
    verifyPayment: "/api/user/wallet/verify-payment",
    redeem: "/api/user/wallet/redeem",
    refund: "/api/user/wallet/refund",
    addReward: "/api/user/wallet/add-reward",
  },

  // ── 4. Products Catalog & Discovery Pages ──
  //    (userProductRoutes mounted at /api/user/products)
  products: {
    all: "/api/user/products/all",
    details: (idOrSlug) => `/api/user/products/${idOrSlug}`,
    topSellers: "/api/user/products/top-sellers",
    topCategories: "/api/user/products/top-categories",
    filters: "/api/user/products/filters",
    skinTypes: "/api/user/products/skin-types",
    byCategory: (slug) => `/api/user/products/category/${slug}/products`,
    bySkinType: (slug) => `/api/user/products/skintype/${slug}`,
    byIngredient: (slug) => `/api/user/products/ingredient/${slug}`,
  },

  // ── 5. Categories & Brands Navigation ──
  //    (userCategoryRoutes at /api/user/categories, userBrandRoutes at /api/user/brands)
  categories: {
    tree: "/api/user/categories/tree",
    landing: (slug) => `/api/user/categories/category/${slug}/landing`,
    products: (slug) => `/api/user/categories/category/${slug}/products`,
  },
  brands: {
    list: "/api/user/brands",
    bySlug: (slug) => `/api/user/brands/${slug}`,
    categoryProducts: (brandSlug, categorySlug) => `/api/user/brands/${brandSlug}/${categorySlug}`,
  },

  // ── 6. Cart Page & Operations ──
  //    (userCartAndOrderRoutes mounted at /api/user/cart)
  cart: {
    get: "/api/user/cart",
    add: "/api/user/cart/add",
    update: "/api/user/cart/update",
    remove: (productId) => `/api/user/cart/remove/${productId}`,
    summary: "/api/user/cart/summary",
    applyCoupon: "/api/user/cart/apply-coupon",
    removeCoupon: "/api/user/cart/remove-coupon",
  },

  // ── 7. Wishlist ──
  //    (wishlist routes mounted at /api/user via userRoutes.js)
  wishlist: {
    get: "/api/user/wishlist",
    add: (productId) => `/api/user/wishlist/${productId}`,
    remove: (productId) => `/api/user/wishlist/${productId}`,
    moveToCart: (productId) => `/api/user/wishlist/${productId}/move-to-cart`,
    moveToWishlist: (productId) => `/api/user/cart/${productId}/move-to-wishlist`,
  },

  // ── 8. Orders & Post-Purchase Pages ──
  //    (All order routes under /api/user/cart in the backend)
  orders: {
    myOrders: "/api/user/cart/orders",
    initiateFromCart: "/api/user/cart/order/initiate",
    tracking: (orderId) => `/api/user/cart/tracking/${orderId}`,
    cancel: (orderId) => `/api/user/cart/cancel/${orderId}`,
    shipment: (shipmentId) => `/api/user/cart/shipment/${shipmentId}`,
    cancelShipment: (shipmentId) => `/api/user/cart/shipment/cancel/${shipmentId}`,
    invoice: (invoiceId) => `/api/user/cart/invoice/${invoiceId}`,
    discount: (discountId) => `/api/user/cart/discount/${discountId}`,
    byId: (orderId) => `/api/user/orders/${orderId}`,
    paymentSuccess: (orderId) => `/api/payment/success/${orderId}`,
  },

  // ── 9. Returns ──
  //    (returnRoutes mounted at /api/returns)
  returns: {
    request: (shipmentId) => `/api/returns/request/${shipmentId}`,  // POST (multipart)
    myReturns: "/api/returns/my",
    details: (shipmentId, returnId) => `/api/returns/details/${shipmentId}/${returnId}`,
    cancel: (shipmentId, returnId) => `/api/returns/cancel/${shipmentId}/${returnId}`,
  },

  // ── 10. Payment Processing ──
  //    (paymentRoutes mounted at /api/payment)
  payment: {
    methods: "/api/payment/methods",
    setPaymentMethod: "/api/payment/set-payment-method",
    cod: "/api/payment/cod",
    codConfirm: "/api/payment/cod/confirm",
    razorpayOrder: "/api/payment/razorpay/order",
    razorpayVerify: "/api/payment/razorpay/verify",
    wallet: "/api/payment/wallet",
    giftcard: "/api/payment/giftcard",
    refundMethods: "/api/payment/refund-methods",
    setRefundMethod: "/api/payment/refund-method",
  },

  // ── 11. Reviews ──
  //    (reviewRoutes mounted at /api/reviews)
  reviews: {
    add: "/api/reviews/add",                                          // POST (multipart)
    byProduct: (productId) => `/api/reviews/product/${productId}`,
    topByProduct: (productId) => `/api/reviews/product/${productId}/top`,
    voteHelpful: (reviewId) => `/api/reviews/${reviewId}/vote-helpful`,
    react: (reviewId) => `/api/reviews/${reviewId}/react`,
    report: (reviewId) => `/api/reviews/${reviewId}/report`,
  },

  // ── 12. Ingredients & Compatibility Section ──
  //    (ingredientRoutes mounted at /api/ingredients)
  ingredients: {
    list: "/api/ingredients",
    byName: (name) => `/api/ingredients/${encodeURIComponent(name)}`,
    compatibility: "/api/ingredients/compatibility",
    productsByIngredient: (name) => `/api/ingredients/${encodeURIComponent(name)}/products`,
    ingredientScan: (productId) => `/api/ingredients/scan/product/${productId}`,
    userAllergens: "/api/ingredients/user/allergens",
    productCompatibility: "/api/ingredients/product-compatibility",
    productSafetyScore: (productId) => `/api/ingredients/product-safety/${productId}`,
    scanText: "/api/ingredients/scan-text",
  },

  // ── 13. AI Beauty Concierge Page / Widget ──
  //    (beautyConciergeRoutes mounted at /api/user/beauty-concierge)
  beautyConcierge: {
    chat: "/api/user/beauty-concierge/chat",
    history: "/api/user/beauty-concierge/history",
    quickRecs: "/api/user/beauty-concierge/quick-recs",
  },

  // ── 14. AI Skin Diagnosis Page ──
  //    (skinDiagnosisRoutes mounted at /api/user/skin-diagnosis)
  skinDiagnosis: {
    analyze: "/api/user/skin-diagnosis/analyze",
    exportRoutine: "/api/user/skin-diagnosis/export-routine",
    history: "/api/user/skin-diagnosis/history",
    getById: (id) => `/api/user/skin-diagnosis/${id}`,
  },

  // ── 15. Routine Builder Page ──
  //    (routineBuilderRoutes mounted at /api/user/routines)
  routines: {
    myRoutines: "/api/user/routines/my",
    create: "/api/user/routines/create",
    getById: (routineId) => `/api/user/routines/${routineId}`,
    update: (routineId) => `/api/user/routines/${routineId}`,
    delete: (routineId) => `/api/user/routines/${routineId}`,
    publicRoutine: (shareToken) => `/api/user/routines/public/${shareToken}`,
    share: (routineId) => `/api/user/routines/${routineId}/share`,
    reminders: "/api/user/routines/reminders/active",
    templates: "/api/user/routines/templates",
    aiBuild: "/api/user/routines/ai-build",
    checkConflicts: "/api/user/routines/check-conflicts",
    validateOrder: "/api/user/routines/validate-order",
    audit: (routineId) => `/api/user/routines/${routineId}/audit`,
    coach: (routineId) => `/api/user/routines/${routineId}/coach`,
    logs: (routineId) => `/api/user/routines/${routineId}/logs`,
    log: (routineId) => `/api/user/routines/${routineId}/log`,
    calendar: (routineId) => `/api/user/routines/${routineId}/calendar`,
    uploadProgressPhoto: "/api/user/routines/upload-progress-photo",
    alternatives: (productId) => `/api/user/routines/products/${productId}/alternatives`,
    clone: (shareToken) => `/api/user/routines/clone/${shareToken}`,
    suggest: "/api/user/routines/suggest",
    addToCart: (routineId) => `/api/user/routines/${routineId}/add-to-cart`,
  },

  // ── 16. Virtual Try-On (VTO) & Shade Finder Pages ──
  //    (virtualTryOnRoutes at /api/vto, userShadeFinderRoutes at /api/user/shadefinder)
  vto: {
    enabled: "/api/vto/enabled",
    workflow: "/api/vto/workflow",
  },
  shadeFinder: {
    tones: "/api/user/shadefinder/tones",
    undertones: (toneKey) => `/api/user/shadefinder/undertones?toneKey=${toneKey}`,
    families: (toneKey, undertoneKey) =>
      `/api/user/shadefinder/families?toneKey=${toneKey}&undertoneKey=${undertoneKey}`,
    formulations: "/api/shadefinder/formulations",
    recommendations: "/api/user/shadefinder/recommendations",
  },

  // ── 17. Gift Cards ──
  //    (userGiftCardRoutes mounted at /api/user/giftcards)
  giftCards: {
    createOrder: "/api/user/giftcards/create-order",
    verifyPayment: "/api/user/giftcards/verify-payment",
    redeem: "/api/user/giftcards/redeem",
    balance: (code, pin) => `/api/user/giftcards/balance/${code}/${pin}`,
    list: "/api/user/giftcards/list",
    details: (id) => `/api/user/giftcards/details/${id}`,
    templates: "/api/user/giftcards/templates",
  },

  // ── 18. Promotions & Offers ──
  //    (userPromotionRoutes mounted at /api/user/promotions)
  promotions: {
    active: "/api/user/promotions/active",
    offersPage: "/api/user/promotions/offers-page",
    products: (idOrSlug) => `/api/user/promotions/${idOrSlug}/products`,
  },

  // ── 19. Discounts ──
  //    (userDiscountRoutes mounted at /api/user/discounts)
  discounts: {
    eligible: "/api/user/discounts/eligible",
    validate: "/api/user/discounts/validate",
  },

  // ── 20. Videos ──
  //    (userVideoRoutes mounted at /api/user/videos)
  videos: {
    list: "/api/user/videos",
    bySlug: (slug) => `/api/user/videos/${slug}`,
    recordView: (id) => `/api/user/videos/${id}/view`,
  },

  // ── 21. For You / Skincare Quiz ──
  //    (userQuizRoutes mounted at /api/user/for-you)
  forYou: {
    intro: "/api/user/for-you/intro",
    makeupGuide: "/api/user/for-you/makeup-guide",
    skincareQuestions: "/api/user/for-you/skincare/questions",
    skincareSubmit: "/api/user/for-you/skincare/submit",
    skincareProfile: "/api/user/for-you/skincare/profile",
    recommendations: "/api/user/for-you/recommendations",
  },

  // ── 22. Feature Banners (Home page) ──
  //    (userFeatureBannerRoutes mounted at /api/user/feature-banners)
  featureBanners: {
    active: "/api/user/feature-banners",
  },

  // ── 23. Referral ──
  //    (referralRoutes mounted at /api/referral)
  referral: {
    code: "/api/referral/code",
    history: "/api/referral/history",
  },

  // ── 24. Affiliate ──
  //    (affiliateRoutes mounted at /api/affiliate)
  affiliate: {
    signup: "/api/affiliate/signup",
    login: "/api/affiliate/login",
  },

  // ── 25. Recommendations (Personalized) ──
  //    (recommendationRoutes mounted at /api/user/recommendations)
  recommendations: {
    get: "/api/user/recommendations",
    cart: "/api/user/recommendations/cart",
    personalSummary: "/api/user/recommendations/personal-summary",
    personalized: "/api/user/recommendations/personalized",
  },

  // ── 26. Content, SEO & Blog Pages ──
  //    (seoRoutes mounted at /, blogRoutes at /api/blogs)
  seo: {
    meta: "/api/seo",
  },
  blogs: {
    list: "/api/blogs",
    landing: "/api/blogs/landing",
    details: (idOrSlug) => `/api/blogs/${idOrSlug}`,
    bySlug: (slug) => `/api/blogs/slug/${slug}`,
  },
  // ── 27. Media (Hero Slider) ──
  media: {
    list: "/api/media",
  },
  // ── 28. Tracking & Analytics ──
  tracking: {
    duration: "/api/tracking/duration",
    pageview: "/api/tracking/pageview",
    consent: "/api/tracking/consent",
  },
};

export default endpoints;
