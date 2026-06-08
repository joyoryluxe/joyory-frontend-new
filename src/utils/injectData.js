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