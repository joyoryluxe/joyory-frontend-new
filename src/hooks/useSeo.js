import { useEffect, useState } from "react";

const API_BASE = "https://beauty.joyory.com/api/seo";

export const useSeo = (type, slug = "", page = 1) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSeo = async () => {
      try {
        let url = `${API_BASE}?type=${type}`;

        if (slug) url += `&slug=${slug}`;
        if (page > 1) url += `&page=${page}`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();

        setSeo(data);
      } catch (err) {
        console.error("SEO Fetch Error:", err);
      }
    };

    fetchSeo();

    return () => controller.abort();
  }, [type, slug, page]);

  return seo;
};