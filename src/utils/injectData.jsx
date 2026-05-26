// export const injectData = () => {
//   // 1. Meta Tags (SEO, Open Graph, Twitter)
//   const metaTags = [
//     { name: "keywords", content: "buy makeup online, beauty products India, skincare online, haircare, fragrances" },
//     { name: "author", content: "Joyory" },
//     { name: "robots", content: "index, follow" },
//     { name: "googlebot", content: "index, follow" },
//     { name: "google-site-verification", content: "3eLhp3hQ1nN5sDRcP6yQiDW81k_JpbcHuUt6nj3fIgA" },
//     { name: "description", content: "Discover authentic makeup, skincare, haircare, fragrances and fashion on Joyory. India’s trusted beauty store with fast delivery and secure payments." },
//     // Open Graph
//     { property: "og:title", content: "Joyory | Premium Beauty & Fashion Shopping Online" },
//     { property: "og:description", content: "Shop 100% authentic makeup, skincare, haircare, fashion & fragrances. Fast delivery, secure payments & exclusive offers." },
//     { property: "og:image", content: "https://joyory.com/assets/Logo-CNNoPrGh.png" },
//     { property: "og:url", content: "https://joyory.com/" },
//     { property: "og:type", content: "website" },
//     { property: "og:site_name", content: "Joyory" },
//     { property: "og:see_also", content: "https://www.instagram.com/joyory_luxe" },
//     { property: "og:see_also", content: "https://www.facebook.com/people/Joyory/61578381750346/" },
//     { property: "og:see_also", content: "https://www.linkedin.com/company/joyory-luxe-pvt-ltd" },
//     // Twitter
//     { name: "twitter:card", content: "summary_large_image" },
//     { name: "twitter:title", content: "Joyory | Premium Beauty & Fashion Shopping Online" },
//     { name: "twitter:description", content: "Discover trusted beauty essentials. 100% genuine products, fast delivery & exciting offers." },
//     { name: "twitter:image", content: "https://joyory.com/assets/Logo-CNNoPrGh.png" },
//     { name: "twitter:url", content: "https://joyory.com/" }
//   ];

//   metaTags.forEach(tag => {
//     const m = document.createElement('meta');
//     Object.keys(tag).forEach(key => m.setAttribute(key, tag[key]));
//     document.head.appendChild(m);
//   });

//   // 2. Links (Canonical, CSS, Prefetch)
//   const links = [
//     { rel: "canonical", href: "https://joyory.com/" },
//     { rel: "apple-touch-icon", href: "https://joyory.com/assets/Logo-CNNoPrGh.png" },
//     { rel: "dns-prefetch", href: "//joyory.com" },
//     { rel: "dns-prefetch", href: "//www.google-analytics.com" },
//     { rel: "preconnect", href: "https://joyory.com" },
//     // External Styles
//     // { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css" },
//     // { rel: "stylesheet", href: "https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css" }
//   ];

//   links.forEach(link => {
//     const l = document.createElement('link');
//     Object.keys(link).forEach(key => l.setAttribute(key, link[key]));
//     document.head.appendChild(l);
//   });

//   // 3. Inject Inline Font Styles (Alice)
//   const style = document.createElement('style');
//   style.innerHTML = `@import url('https://fonts.googleapis.com/css2?family=Alice&display=swap');`;
//   document.head.appendChild(style);

//   // 4. JSON-LD Schema (Organization & Website)
//   const schemas = [
//     {
//       "@context": "https://schema.org",
//       "@type": "Organization",
//       "name": "Joyory",
//       "url": "https://joyory.com",
//       "logo": "/src/assets/Logo.png",
//       "sameAs": [
//         "https://www.instagram.com/joyory_luxe",
//         "https://www.facebook.com/people/Joyory/61578381750346/",
//         "https://www.linkedin.com/company/joyory-luxe-pvt-ltd"
//       ],
//       "address": { "@type": "PostalAddress", "addressCountry": "IN" },
//       "priceRange": "₹199 - ₹4999"
//     },
//     {
//       "@context": "https://schema.org",
//       "@type": "WebSite",
//       "name": "Joyory",
//       "url": "https://joyory.com",
//       "potentialAction": {
//         "@type": "SearchAction",
//         "target": "https://joyory.com/search?q={search_term_string}",
//         "query-input": "required name=search_term_string"
//       }
//     }
//   ];

//   schemas.forEach(schema => {
//     const s = document.createElement('script');
//     s.type = "application/ld+json";
//     s.text = JSON.stringify(schema);
//     document.head.appendChild(s);
//   });

//   // 5. Google Analytics (gtag.js)
//   const gaScript = document.createElement('script');
//   gaScript.async = true;
//   gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-C088200GWY";
//   document.head.appendChild(gaScript);

//   const gaConfig = document.createElement('script');
//   gaConfig.innerHTML = `
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'G-C088200GWY');
//   `;
//   document.head.appendChild(gaConfig);

//   // 6. Google Tag Manager (GTM)
//   const gtmScript = document.createElement('script');
//   gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
//     new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
//     j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
//     'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
//     })(window,document,'script','dataLayer','GTM-TZJHTN2K');`;
//   document.head.appendChild(gtmScript);
// };

















export const injectData = () => {
  // 1. Meta Tags
  const metaTags = [
    { name: "keywords", content: "buy makeup online, beauty products India, skincare online, haircare, fragrances" },
    { name: "author", content: "Joyory" },
    { name: "description", content: "Discover authentic makeup, skincare, haircare, fragrances and fashion on Joyory." },
    { property: "og:title", content: "Joyory | Premium Beauty & Fashion Shopping Online" },
    { property: "og:image", content: "https://joyory.com/assets/Logo-CNNoPrGh.png" },
    { property: "og:url", content: "https://joyory.com/" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" }
  ];

  metaTags.forEach(tag => {
    const m = document.createElement('meta');
    Object.keys(tag).forEach(key => m.setAttribute(key, tag[key]));
    document.head.appendChild(m);
  });

  // 2. JSON-LD Schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Joyory",
    "url": "https://joyory.com",
    "logo": "/src/assets/Logo.png"
  };
  const script = document.createElement('script');
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);

  // 3. Canonical Link
  const canonical = document.createElement('link');
  canonical.rel = "canonical";
  canonical.href = "https://joyory.com/";
  document.head.appendChild(canonical);
};