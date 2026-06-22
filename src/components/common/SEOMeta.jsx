// import { useEffect } from "react";
// import axiosInstance from "../../utils/axiosInstance";

// // Fallback metadata for robustness
// const FALLBACKS = {
//   home: {
//     title: "Joyory - India's Premium Beauty & Cosmetics Store",
//     description: "Shop India's best beauty & cosmetics at Joyory. Explore top brands in makeup, skincare, haircare. Try our AI Virtual Try-On and AI Beauty Concierge today!",
//     canonical: "https://joyory.com",
//     image: "https://joyory.com/logo.png",
//     type: "website"
//   },
//   product: {
//     title: "Buy Premium Beauty Products Online | Joyory",
//     description: "Shop authentic cosmetics, luxury makeup, clean skincare, and haircare online at Joyory. 100% genuine products, free delivery over ₹499.",
//     canonical: "https://joyory.com/products",
//     image: "https://joyory.com/logo.png",
//     type: "product"
//   },
//   category: {
//     title: "Buy Beauty Products Online | Joyory",
//     description: "Explore the best beauty and cosmetic collections at Joyory. Authentic global brands, best prices, fast delivery.",
//     canonical: "https://joyory.com/categories",
//     image: "https://joyory.com/logo.png",
//     type: "website"
//   },
//   brand: {
//     title: "Shop Premium Beauty Brands Online | Joyory",
//     description: "Discover luxury makeup and skincare brands online at Joyory. Shop 100% authentic cosmetics with easy returns.",
//     canonical: "https://joyory.com/brands",
//     image: "https://joyory.com/logo.png",
//     type: "website"
//   },
//   blog: {
//     title: "Joyory Beauty Blog - Makeup & Skincare Tips",
//     description: "Get the latest expert beauty guides, clean skincare tips, makeup tutorials, and product advice from the Joyory Beauty Blog.",
//     canonical: "https://joyory.com/blogs",
//     image: "https://joyory.com/logo.png",
//     type: "article"
//   }
// };

// const SEOMeta = ({ type = "home", slug = "", page = "" }) => {
//   useEffect(() => {
//     let isMounted = true;

//     // Helper to find or create a meta tag
//     const updateOrCreateMeta = (attr, name, content) => {
//       if (!content) return;
//       let el = document.querySelector(`meta[${attr}="${name}"]`);
//       if (!el) {
//         el = document.createElement("meta");
//         el.setAttribute(attr, name);
//         document.head.appendChild(el);
//       }
//       el.setAttribute("content", content);
//     };

//     // Helper to find or create link tag
//     const updateOrCreateLink = (rel, href) => {
//       if (!href) return;
//       let el = document.querySelector(`link[rel="${rel}"]`);
//       if (!el) {
//         el = document.createElement("link");
//         el.setAttribute("rel", rel);
//         document.head.appendChild(el);
//       }
//       el.setAttribute("href", href);
//     };

//     // Clean up any existing dynamically injected JSON-LD scripts
//     const cleanupJsonLd = () => {
//       const scripts = document.querySelectorAll(".joyory-jsonld");
//       scripts.forEach((script) => script.remove());
//     };

//     // Inject new JSON-LD schemas
//     const injectJsonLd = (schemas) => {
//       cleanupJsonLd();
//       if (!Array.isArray(schemas)) return;

//       schemas.forEach((schema) => {
//         try {
//           const script = document.createElement("script");
//           script.type = "application/ld+json";
//           script.className = "joyory-jsonld";
//           script.innerHTML = JSON.stringify(schema);
//           document.head.appendChild(script);
//         } catch (e) {
//           console.error("Failed to inject JSON-LD schema:", e);
//         }
//       });
//     };

//     // Apply the metadata values to the DOM
//     const applyMetadata = (data) => {
//       const fallback = FALLBACKS[type] || FALLBACKS.home;
//       const title = data.title || fallback.title;
//       const description = data.description || fallback.description;
//       const canonical = data.canonical || fallback.canonical;
//       const ogTitle = data.openGraph?.title || title;
//       const ogDescription = data.openGraph?.description || description;
//       const ogImage = data.openGraph?.image || fallback.image;
//       const ogType = data.openGraph?.type || fallback.type;

//       // 1. Title
//       document.title = title;

//       // 2. Canonical URL
//       updateOrCreateLink("canonical", canonical);

//       // 3. Meta Description
//       updateOrCreateMeta("name", "description", description);

//       // 4. Open Graph tags
//       updateOrCreateMeta("property", "og:title", ogTitle);
//       updateOrCreateMeta("property", "og:description", ogDescription);
//       updateOrCreateMeta("property", "og:image", ogImage);
//       updateOrCreateMeta("property", "og:type", ogType);
//       updateOrCreateMeta("property", "og:url", canonical);

//       // 5. Twitter Card tags
//       updateOrCreateMeta("name", "twitter:card", "summary_large_image");
//       updateOrCreateMeta("name", "twitter:title", ogTitle);
//       updateOrCreateMeta("name", "twitter:description", ogDescription);
//       updateOrCreateMeta("name", "twitter:image", ogImage);

//       // 6. JSON-LD Structured Data
//       if (data.jsonLd) {
//         injectJsonLd(data.jsonLd);
//       } else if (fallback.jsonLd) {
//         injectJsonLd(fallback.jsonLd);
//       }
//     };

//     const fetchSEO = async () => {
//       try {
//         const response = await axiosInstance.get("/api/seo", {
//           params: { type, slug, page }
//         });
//         if (isMounted && response.data) {
//           applyMetadata(response.data);
//         }
//       } catch (err) {
//         console.error("Error fetching SEO metadata:", err);
//         // Fall back gracefully to preset values
//         if (isMounted) {
//           const fallback = FALLBACKS[type] || FALLBACKS.home;
//           applyMetadata(fallback);
//         }
//       }
//     };

//     // Fetch and apply SEO metadata
//     fetchSEO();

//     return () => {
//       isMounted = false;
//       cleanupJsonLd();
//     };
//   }, [type, slug, page]);

//   return null; // This component handles side effects, no UI needed
// };

// export default SEOMeta;















import { useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

// Fallback metadata for robustness
const FALLBACKS = {
  home: {
    title: "Joyory: Shop Makeup, Skin & Beauty Products Online",
    description: "Joyory - An exciting beauty shopping experience. Buy the best of makeup, skincare & more. 100% Authentic Products. Try our AI Virtual Try-On today!",
    canonical: "https://joyory.com",
    image: "https://joyory.com/logo.png",
    type: "website",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Joyory",
        "url": "https://joyory.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://joyory.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Joyory Luxe",
        "url": "https://joyory.com",
        "logo": "https://joyory.com/logo.png"
      }
    ]
  },
  product: {
    title: "Buy Premium Beauty Products Online | Joyory",
    description: "Shop authentic cosmetics, luxury makeup, clean skincare, and haircare online at Joyory. 100% genuine products, free delivery over ₹499.",
    canonical: "https://joyory.com/product",
    image: "https://joyory.com/logo.png",
    type: "product"
  },
  category: {
    title: "Buy Beauty Products Online | Joyory",
    description: "Explore the best beauty and cosmetic collections at Joyory. Authentic global brands, best prices, fast delivery.",
    canonical: "https://joyory.com/category",
    image: "https://joyory.com/logo.png",
    type: "website"
  },
  brand: {
    title: "Shop Premium Beauty Brands Online | Joyory",
    description: "Discover luxury makeup and skincare brands online at Joyory. Shop 100% authentic cosmetics with easy returns.",
    canonical: "https://joyory.com/brand",
    image: "https://joyory.com/logo.png",
    type: "website"
  },
  bloglist: {
    title: "Joyory Beauty Blog - Makeup & Skincare Tips",
    description: "Get the latest expert beauty guides, clean skincare tips, makeup tutorials, and product advice from the Joyory Beauty Blog.",
    canonical: "https://joyory.com/blog",
    image: "https://joyory.com/logo.png",
    type: "website"
  },
  vtoproducts: {
    title: "Virtual Try-On Products | Try Makeup Online | Joyory",
    description: "Browse beauty and makeup products compatible with our AI Virtual Try-On tool. Try lipsticks, eyeshadows, and foundations in real-time.",
    canonical: "https://joyory.com/vto-products",
    image: "https://joyory.com/logo.png",
    type: "website"
  },
  aboutus: {
    title: "About Us | Joyory Luxe",
    description: "Learn about Joyory, India's upcoming beauty-tech destination combining curated cosmetics with intelligent personalization tools.",
    canonical: "https://joyory.com/Aboutus",
    image: "https://joyory.com/logo.png",
    type: "website"
  }
};

const SEOMeta = ({ type = "home", slug = "", page = "" }) => {
  useEffect(() => {
    let isMounted = true;

    // Helper to find or create a meta tag
    const updateOrCreateMeta = (attr, name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper to find or create link tag
    const updateOrCreateLink = (rel, href) => {
      if (!href) return;
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // Clean up any existing dynamically injected JSON-LD scripts
    const cleanupJsonLd = () => {
      const scripts = document.querySelectorAll(".joyory-jsonld");
      scripts.forEach((script) => script.remove());
    };

    // Inject new JSON-LD schemas
    const injectJsonLd = (schemas) => {
      cleanupJsonLd();
      if (!Array.isArray(schemas)) return;

      schemas.forEach((schema) => {
        try {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.className = "joyory-jsonld";
          script.innerHTML = JSON.stringify(schema);
          document.head.appendChild(script);
        } catch (e) {
          console.error("Failed to inject JSON-LD schema:", e);
        }
      });
    };

    // Apply the metadata values to the DOM
    // const applyMetadata = (data) => {
    //   const fallback = FALLBACKS[type] || FALLBACKS.home;
    //   const title = data.title || fallback.title;
    //   const description = data.description || fallback.description;
    //   const canonical = data.canonical || fallback.canonical;
    //   const ogTitle = data.openGraph?.title || title;
    //   const ogDescription = data.openGraph?.description || description;
    //   const ogImage = data.openGraph?.image || fallback.image;
    //   const ogType = data.openGraph?.type || fallback.type;

    //   // 1. Title
    //   document.title = title;

    //   // 2. Canonical URL
    //   updateOrCreateLink("canonical", canonical);

    //   // 3. Meta Description
    //   updateOrCreateMeta("name", "description", description);

    //   // 4. Open Graph tags
    //   updateOrCreateMeta("property", "og:title", ogTitle);
    //   updateOrCreateMeta("property", "og:description", ogDescription);
    //   updateOrCreateMeta("property", "og:image", ogImage);
    //   updateOrCreateMeta("property", "og:type", ogType);
    //   updateOrCreateMeta("property", "og:url", canonical);

    //   // 5. Twitter Card tags
    //   updateOrCreateMeta("name", "twitter:card", "summary_large_image");
    //   updateOrCreateMeta("name", "twitter:title", ogTitle);
    //   updateOrCreateMeta("name", "twitter:description", ogDescription);
    //   updateOrCreateMeta("name", "twitter:image", ogImage);

    //   // 6. JSON-LD Structured Data
    //   if (data.jsonLd) {
    //     injectJsonLd(data.jsonLd);
    //   } else if (fallback.jsonLd) {
    //     injectJsonLd(fallback.jsonLd);
    //   }
    // };

    // Update the applyMetadata function logic
    const applyMetadata = (data) => {
      let fallback = FALLBACKS[type] || FALLBACKS.home;

      // Check category pages for custom skincare and makeup metadata
      if (type === "category") {
        if (slug === "skincare" || slug === "skin") {
          fallback = {
            title: "Buy Clean Skincare Products Online | Joyory",
            description: "Shop premium, clean skincare products online at Joyory. Explore serums, moisturizers, sunscreens, and face washes curated for all skin types.",
            canonical: "https://joyory.com/category/skin",
            image: "https://joyory.com/logo.png",
            type: "website"
          };
        } else if (slug === "makeup") {
          fallback = {
            title: "Buy Premium Makeup & Cosmetics Online | Joyory",
            description: "Shop high-quality makeup products online at Joyory. Find foundation, lipstick, eyeshadow, eyeliner, and cosmetics from premium brands.",
            canonical: "https://joyory.com/category/makeup",
            image: "https://joyory.com/logo.png",
            type: "website"
          };
        }
      }

      const title = data.title || fallback.title;
      const description = data.description || fallback.description;
      const canonical = data.canonical || fallback.canonical;
      const ogTitle = data.openGraph?.title || title;
      const ogDescription = data.openGraph?.description || description;
      const ogImage = data.openGraph?.image || fallback.image;
      const ogType = data.openGraph?.type || fallback.type;

      // 1. Title
      document.title = title;

      // 2. Canonical URL
      updateOrCreateLink("canonical", canonical);

      // 3. Meta Description
      updateOrCreateMeta("name", "description", description);

      // 4. Open Graph tags
      updateOrCreateMeta("property", "og:title", ogTitle);
      updateOrCreateMeta("property", "og:description", ogDescription);
      updateOrCreateMeta("property", "og:image", ogImage);
      updateOrCreateMeta("property", "og:type", ogType);
      updateOrCreateMeta("property", "og:url", canonical);

      // 5. Twitter Card tags
      updateOrCreateMeta("name", "twitter:card", "summary_large_image");
      updateOrCreateMeta("name", "twitter:title", ogTitle);
      updateOrCreateMeta("name", "twitter:description", ogDescription);
      updateOrCreateMeta("name", "twitter:image", ogImage);

      // 6. Dynamic Indexing Control (robots) for staging/dev privacy
      const isProduction = window.location.hostname === "joyory.com" || window.location.hostname === "www.joyory.com";
      updateOrCreateMeta("name", "robots", isProduction ? "index, follow" : "noindex, nofollow");

      // 7. JSON-LD Structured Data
      if (data.jsonLd) {
        injectJsonLd(data.jsonLd);
      } else if (fallback.jsonLd) {
        injectJsonLd(fallback.jsonLd);
      }
    };


    const fetchSEO = async () => {
      try {
        const response = await axiosInstance.get("/api/seo", {
          params: { type, slug, page }
        });
        if (isMounted && response.data) {
          applyMetadata(response.data);
        }
      } catch (err) {
        console.error("Error fetching SEO metadata:", err);
        // Fall back gracefully to preset values
        if (isMounted) {
          const fallback = FALLBACKS[type] || FALLBACKS.home;
          applyMetadata(fallback);
        }
      }
    };

    // Fetch and apply SEO metadata
    fetchSEO();

    return () => {
      isMounted = false;
      cleanupJsonLd();
    };
  }, [type, slug, page]);

  return null; // This component handles side effects, no UI needed
};

export default SEOMeta;