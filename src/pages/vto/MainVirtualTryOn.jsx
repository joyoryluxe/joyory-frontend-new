import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import "../../styles/MainVirtualTryOn.css";

import { UserContext } from "../../context/UserContext.jsx";
import { getWishlist, addToWishlist, removeFromWishlist } from "../../api/wishlistApi";
import { addToCart as apiAddToCart } from "../../api/cartApi";
import { getVtoWorkflow } from "../../api/vtoApi";
import { getProductDetails } from "../../api/productApi";
import { toast } from "react-toastify";

import { applyMakeup, applyAdaptiveSmoothing } from "../../utils/vtoCanvasMath";
import VtoLandingView from "../../components/sections/tryon/VtoLandingView";
import VtoInstructionsModal from "../../components/sections/tryon/VtoInstructionsModal";
import VtoSidebarPanels from "../../components/sections/tryon/VtoSidebarPanels";
import VtoCanvasViewport from "../../components/sections/tryon/VtoCanvasViewport";
import VtoShadePopup from '../../components/sections/tryon/VtoShadePopup';

const MainVirtualTryon = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vtoStep, setVtoStep] = useState('landing');
  const [mode, setMode] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [activeProduct, setActiveProduct] = useState(null);
  const [activeShade, setActiveShade] = useState(null);
  const { user } = useContext(UserContext);
  const [activeShadeObj, setActiveShadeObj] = useState(null);
  const [wishlistData, setWishlistData] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [intensity, setIntensity] = useState(80);
  const [compareMode, setCompareMode] = useState(false);
  const [baPos, setBaPos] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [statusMsg, setStatusMsg] = useState('Initializing...');

  const [vtoTypes, setVtoTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [shades, setShades] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingShades, setLoadingShades] = useState(false);

  const [landingImages, setLandingImages] = useState({
    heroBanner: null,
    cardBackground: null,
    phoneView: null,
    stepImages: []
  });

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [sidePanel, setSidePanel] = useState('types');
  const [uploadedImage, setUploadedImage] = useState(null);

  const S = useRef({
    lipC: 'none', lOp: 0.8,
    linerC: 'none', linerStyle: 'thin', linerPlacement: 'upper', linerOp: 0.85, linerThick: 1.0,
    browC: 'none', browStyle: 'natural', browOp: 0.55, browThick: 0.55,
    foundC: '#fce9d8', fOn: false, fOp: 0.18,
    blushC: null, blushOp: 0.8
  });
  const smoothedLms = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const fetchWishlistData = useCallback(async () => {
    try {
      if (user && !user.guest) {
        const { data } = await getWishlist();
        if (data.success) setWishlistData(data.wishlist || []);
      } else {
        const local = JSON.parse(localStorage.getItem("guestWishlist") || "[]");
        setWishlistData(local.map((it) => ({ ...it, productId: it._id })));
      }
    } catch (e) {
      console.error("Error fetching wishlist", e);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlistData();
  }, [fetchWishlistData]);

  const isInWishlist = (pid, sku) => {
    if (!pid || !sku) return false;
    return wishlistData.some((it) => (it.productId === pid || it._id === pid) && it.sku === sku);
  };

  const toggleWishlist = async (prod, shade) => {
    if (!prod || !shade) return toast.error("Select a shade first");
    const pid = prod._id;
    const sku = shade.sku || shade.variantSku || shade._id;
    if (!sku) return toast.error("Selected shade has no SKU");

    if (!user || user.guest) {
      toast.error("Please login to use wishlist");
      localStorage.setItem("pendingWishlistAction", JSON.stringify({ productId: pid, sku }));
      navigate("/login", { state: { from: "/wishlist" } });
      return;
    }

    try {
      const inWl = isInWishlist(pid, sku);
      if (inWl) {
        await removeFromWishlist(pid, { sku });
        toast.success("Removed from wishlist!");
      } else {
        await addToWishlist(pid, { sku });
        toast.success("Added to wishlist!");
      }
      await fetchWishlistData();
    } catch (e) {
      toast.error(e.response?.data?.message || "Wishlist error");
    }
  };

  const handleAddToCart = async () => {
    if (!activeProduct || !activeShadeObj) {
      toast.error("Please select a product and shade first.");
      return;
    }

    setAddingToCart(true);
    const sku = activeShadeObj.sku || activeShadeObj.variantSku || activeShadeObj._id;
    const pid = activeProduct._id;

    try {
      const payload = {
        productId: pid,
        variants: [{ variantSku: sku, quantity: 1 }]
      };

      const { data } = await apiAddToCart(payload);
      if (!data.success) throw new Error(data.message || "Cart add failed");

      toast.success("Product added to cart!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add to cart");
      if (e.response?.status === 401) {
        navigate("/login", { state: { from: window.location.pathname } });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const removeShade = () => {
    setActiveShade(null);
    setActiveShadeObj(null);

    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lipC = 'none'; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = 'none'; }
    else if (type.includes('found')) { S.current.foundC = 'none'; S.current.fOn = false; }
    else if (type.includes('blush')) { S.current.blushC = null; }
    else if (type.includes('brow')) { S.current.browC = 'none'; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
      img.src = uploadedImage;
    }
  };

  const getShadeThumbnail = () => {
    if (activeShadeObj) {
      if (activeShadeObj.image) return activeShadeObj.image;
      if (activeShadeObj.images && activeShadeObj.images.length > 0) return activeShadeObj.images[0];
    }
    if (activeProduct) {
      if (activeProduct.image) return activeProduct.image;
      if (activeProduct.images && activeProduct.images.length > 0) return activeProduct.images[0];
    }
    return "https://via.placeholder.com/56";
  };

  useEffect(() => {
    const fetchTypes = async () => {
      setLoadingTypes(true);
      try {
        const res = await getVtoWorkflow();
        setVtoTypes(res.data.types || []);
      } catch (err) {
        console.error("Error fetching types", err);
      } finally {
        setLoadingTypes(false);
        setStatusMsg('Ready ✓');
      }
    };
    fetchTypes();
  }, []);

  const queryProductId = searchParams.get('productId');
  const queryProductSlug = searchParams.get('productSlug');
  const querySku = searchParams.get('sku');
  const queryVtoType = searchParams.get('vtoType');

  useEffect(() => {
    const targetProductIdentifier = queryProductSlug || queryProductId;
    if (targetProductIdentifier) {
      const loadProductFromQuery = async () => {
        setStatusMsg('Loading your product...');
        setVtoStep('engine');
        setMode('live');
        setSidePanel('shades');
        setLoadingShades(true);
        try {
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(targetProductIdentifier);
          let product = null;
          let shadesList = [];

          if (isObjectId) {
            const res = await getVtoWorkflow({ productId: targetProductIdentifier });
            product = res.data.product;
            shadesList = product?.shades || [];
          } else {
            const res = await getProductDetails(targetProductIdentifier);
            product = res.data;
            if (product) {
              shadesList = (product.variants || product.shadeOptions || []).map(v => ({
                shadeName: v.shadeName || v.name || "Default",
                hex: v.hex || v.color,
                image: v.image || (v.images && v.images[0]) || product.image || (product.images && product.images[0]),
                sku: v.sku || v.variantSku || v._id,
                displayPrice: v.displayPrice || product.price,
                originalPrice: v.originalPrice || product.mrp || product.price
              }));
            }
          }

          if (product) {
            setActiveProduct(product);
            setShades(shadesList);

            const rawType = queryVtoType || product.vtoType || product.type || (typeof product.category === 'object' ? product.category.name : product.category) || 'lipstick';
            const normalizedType = rawType.toLowerCase();
            setActiveType(normalizedType);

            let chosenShade = null;
            if (querySku) {
              chosenShade = shadesList.find(s => (s.sku === querySku || s.variantSku === querySku || s._id === querySku));
            }
            if (!chosenShade && shadesList.length > 0) {
              chosenShade = shadesList[0];
            }

            if (chosenShade) {
              setActiveShade(chosenShade.sku || chosenShade._id || chosenShade.name);
              setActiveShadeObj(chosenShade);
              let hex = chosenShade.hex || chosenShade.color;
              if (hex) {
                if (!hex.startsWith('#')) hex = '#' + hex;
                const typeLower = normalizedType.toLowerCase();
                if (typeLower.includes('lip')) { S.current.lipC = hex; }
                else if (typeLower.includes('eye') && !typeLower.includes('brow')) { S.current.linerC = hex; }
                else if (typeLower.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
                else if (typeLower.includes('blush')) { S.current.blushC = hex; }
                else if (typeLower.includes('brow')) { S.current.browC = hex; }
              }
            }

            setLoadingProducts(true);
            const pRes = await getVtoWorkflow({ type: normalizedType });
            setProducts(pRes.data.products || []);
          }
        } catch (err) {
          console.error("Error loading direct VTO product", err);
          setStatusMsg('Error loading product');
        } finally {
          setLoadingShades(false);
          setLoadingProducts(false);
          setStatusMsg('Ready ✓');
        }
      };
      loadProductFromQuery();
    }
  }, [queryProductId, queryProductSlug, querySku]);

  useEffect(() => {
    const fetchLandingImages = async () => {
      try {
        const res = await getVtoWorkflow({ section: "landing" });
        const data = res.data;
        setLandingImages({
          heroBanner: data.heroBanner || data.landing?.heroBanner || null,
          cardBackground: data.cardBackground || data.landing?.cardBackground || null,
          phoneView: data.phoneView || data.landing?.phoneView || null,
          stepImages: data.stepImages || data.landing?.stepImages || []
        });
      } catch (err) {
        console.error("Error fetching landing images", err);
      }
    };
    fetchLandingImages();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
    };
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setVtoStep('landing');
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Initialize MediaPipe FaceMesh
  useEffect(() => {
    if (vtoStep === 'engine') {
      try {
        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`,
        });
        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults((results) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          const videoWidth = results.image.width;
          const videoHeight = results.image.height;
          canvas.width = videoWidth;
          canvas.height = videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

          if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
            let lms = results.multiFaceLandmarks[0];
            if (mode === 'live') {
              lms = applyAdaptiveSmoothing(lms, smoothedLms.current, canvas.width, canvas.height);
              smoothedLms.current = lms;
            }
            applyMakeup(ctx, lms, canvas.width, canvas.height, S.current);
          } else {
            if (mode === 'live') smoothedLms.current = null;
          }
        });

        faceMeshRef.current = faceMesh;

        if (mode === 'live') {
          if (webcamRef.current && webcamRef.current.video) {
            const camera = new Camera(webcamRef.current.video, {
              onFrame: async () => {
                if (webcamRef.current?.video && faceMeshRef.current) {
                  await faceMeshRef.current.send({ image: webcamRef.current.video });
                }
              },
              width: 640,
              height: 480
            });
            camera.start();
            cameraRef.current = camera;
            setStatusMsg('Live Mode Active');
          } else {
            setTimeout(() => {
              if (webcamRef.current && webcamRef.current.video) {
                const camera = new Camera(webcamRef.current.video, {
                  onFrame: async () => {
                    if (webcamRef.current?.video && faceMeshRef.current) {
                      await faceMeshRef.current.send({ image: webcamRef.current.video });
                    }
                  },
                  width: 640,
                  height: 480
                });
                camera.start();
                cameraRef.current = camera;
                setStatusMsg('Live Mode Active');
              }
            }, 1000);
          }
        }
      } catch (err) {
        console.error("FaceMesh initialization error", err);
      }
    } else {
      if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
      if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
    }
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (faceMeshRef.current) faceMeshRef.current.close();
    }
  }, [vtoStep, mode]);

  useEffect(() => {
    if (vtoStep === 'engine' && mode === 'photo' && uploadedImage && faceMeshRef.current) {
      setStatusMsg('Processing Photo...');
      const img = new Image();
      img.onload = async () => {
        try {
          await faceMeshRef.current.send({ image: img });
          setStatusMsg('Photo Ready!');
        } catch (e) {
          console.error(e);
        }
      };
      img.src = uploadedImage;
    }
  }, [vtoStep, mode, uploadedImage]);

  const handleTypeSelect = async (type) => {
    setActiveType(type);
    setSidePanel('products');
    setLoadingProducts(true);
    try {
      const res = await getVtoWorkflow({ type });
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSelect = async (product) => {
    setActiveProduct(product);
    setSidePanel('shades');
    setLoadingShades(true);
    try {
      const res = await getVtoWorkflow({ productId: product._id });
      setShades(res.data.product?.shades || []);
    } catch (err) {
      console.error("Error fetching shades", err);
    } finally {
      setLoadingShades(false);
    }
  };

  const applyShade = (shade) => {
    setActiveShade(shade.sku || shade._id || shade.name);
    setActiveShadeObj(shade);
    let hex = shade.hex || shade.color;
    if (!hex) return;
    if (!hex.startsWith('#')) hex = '#' + hex;

    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lipC = hex; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerC = hex; }
    else if (type.includes('found')) { S.current.foundC = hex; S.current.fOn = true; }
    else if (type.includes('blush')) { S.current.blushC = hex; }
    else if (type.includes('brow')) { S.current.browC = hex; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
      img.src = uploadedImage;
    }
  };

  const handleIntensityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    setIntensity(val);
    const alpha = val / 100;
    const type = (activeType || '').toLowerCase();
    if (type.includes('lip')) { S.current.lOp = alpha; }
    else if (type.includes('eye') && !type.includes('brow')) { S.current.linerOp = alpha; }
    else if (type.includes('found')) { S.current.fOp = alpha; }
    else if (type.includes('blush')) { S.current.blushOp = alpha; }
    else if (type.includes('brow')) { S.current.browOp = alpha; }

    if (mode === 'photo' && faceMeshRef.current && uploadedImage) {
      const img = new Image();
      img.onload = async () => { await faceMeshRef.current.send({ image: img }); };
      img.src = uploadedImage;
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setMode('photo');
      setVtoStep('engine');
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'joyory-vto.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleBaDragCalc = useCallback((e) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let clientX;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else if (e.clientX !== undefined) {
      clientX = e.clientX;
    } else {
      return;
    }
    let newPos = (clientX - rect.left) / rect.width;
    newPos = Math.max(0.05, Math.min(0.95, newPos));
    setBaPos(newPos);
  }, []);

  const handleBaDragStart = (e) => {
    if (!compareMode) return;
    setIsDragging(true);
    handleBaDragCalc(e);
  };

  const handleBaDragEnd = () => {
    if (!compareMode) return;
    setIsDragging(false);
  };

  const handleBaDragMove = (e) => {
    if (!compareMode || !isDragging) return;
    handleBaDragCalc(e);
  };

  const goBackToLandingWithScroll = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (faceMeshRef.current) {
      faceMeshRef.current.close();
      faceMeshRef.current = null;
    }
    setCompareMode(false);
    setMode(null);
    setActiveType(null);
    setActiveProduct(null);
    setActiveShade(null);
    setActiveShadeObj(null);
    setSidePanel('types');
    setSearchParams({}, { replace: true });
    setVtoStep('landing');
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 100);
  }, [setSearchParams]);

  const handleConfirmExit = useCallback(() => {
    setShowExitConfirm(false);
    if (cameraRef.current) { cameraRef.current.stop(); cameraRef.current = null; }
    if (faceMeshRef.current) { faceMeshRef.current.close(); faceMeshRef.current = null; }
    navigate('/Virtualtryon');
  }, [navigate]);

  return (
    <div className={`vto-main-wrapper ${vtoStep === 'landing' ? 'vto-landing-mode-wrapper' : ''}`}>
      <div className={`vto-app-container ${vtoStep === 'landing' ? 'vto-landing-mode' : ''}`}>
        {/* Step 1: Landing screen */}
        {vtoStep === 'landing' && (
          <VtoLandingView
            landingImages={landingImages}
            onStartSelfie={() => {
              window.history.pushState({ vto: true }, "");
              setMode('live');
              setVtoStep('engine');
            }}
            onStartPhotoUpload={() => {
              setMode('photo');
              setVtoStep('instructions');
            }}
            onClose={() => navigate(-1)}
          />
        )}

        {/* Step 2: Try-On Engine workspace */}
        {vtoStep === 'engine' && (
          <div className='vto-engine-bg-wrapper'>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.75)',
              zIndex: 0
            }} />

            <div className="vto-workspace">
              {/* Category, Product, & Shade Side Panels */}
              {!compareMode && (
                <VtoSidebarPanels
                  sidePanel={sidePanel}
                  setSidePanel={setSidePanel}
                  vtoTypes={vtoTypes}
                  activeType={activeType}
                  onTypeSelect={handleTypeSelect}
                  loadingTypes={loadingTypes}
                  products={products}
                  activeProduct={activeProduct}
                  setActiveType={setActiveType}
                  setProducts={setProducts}
                  onProductSelect={handleProductSelect}
                  loadingProducts={loadingProducts}
                  shades={shades}
                  activeShade={activeShade}
                  onApplyShade={applyShade}
                  loadingShades={loadingShades}
                />
              )}

              {/* Central Webcam & Canvas Viewport */}
              <VtoCanvasViewport
                containerRef={containerRef}
                webcamRef={webcamRef}
                canvasRef={canvasRef}
                imageRef={imageRef}
                mode={mode}
                uploadedImage={uploadedImage}
                compareMode={compareMode}
                setCompareMode={setCompareMode}
                baPos={baPos}
                isDragging={isDragging}
                statusMsg={statusMsg}
                intensity={intensity}
                onIntensityChange={handleIntensityChange}
                onBaDragStart={handleBaDragStart}
                onBaDragMove={handleBaDragMove}
                onBaDragEnd={handleBaDragEnd}
                onBackFromCompare={() => {
                  setCompareMode(false);
                  setBaPos(0.5);
                }}
                onCloseEngine={goBackToLandingWithScroll}
                onDownloadImage={downloadImage}
                activeShadeObj={activeShadeObj}
              />
            </div>

            {/* Selected Shade and Product Bottom Drawer */}
            <VtoShadePopup
              activeProduct={activeProduct}
              activeShadeObj={activeShadeObj}
              getShadeThumbnail={getShadeThumbnail}
              onRemoveShade={removeShade}
              isInWishlist={isInWishlist}
              onToggleWishlist={toggleWishlist}
              onAddToCart={handleAddToCart}
              addingToCart={addingToCart}
            />
          </div>
        )}

        {/* Step 3: Photo Instructions modal */}
        {vtoStep === 'instructions' && (
          <VtoInstructionsModal
            showExitConfirm={showExitConfirm}
            onCancelExit={() => setShowExitConfirm(false)}
            onConfirmExit={handleConfirmExit}
            onInstrBack={goBackToLandingWithScroll}
            onInstrClose={() => setShowExitConfirm(true)}
            fileInputRef={fileInputRef}
            onPhotoUpload={handlePhotoUpload}
          />
        )}
      </div>
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught VTO error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px 20px', color: '#b91c1c', background: '#fff', zIndex: 10000, position: 'fixed', inset: 0, overflow: 'auto', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Something went wrong.</h2>
          <p style={{ fontSize: '14px', color: '#555', marginBottom: '20px' }}>Please see the error details below:</p>
          <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', overflowX: 'auto', fontSize: '12px', border: '1px solid #e0e0e0', lineHeight: '1.5' }}>
            {this.state.error?.stack || this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MainVirtualTryOnWithErrorBoundary(props) {
  return (
    <ErrorBoundary>
      <MainVirtualTryon {...props} />
    </ErrorBoundary>
  );
}
