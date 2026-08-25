import { useEffect, useState } from "react";
import { getSeoMeta } from "../api/seoBlogApi";

export const useSeo = (type, slug = "", page = 1) => {
  const [seo, setSeo] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchSeo = async () => {
      try {
        const params = { type };
        if (slug) params.slug = slug;
        if (page > 1) params.page = page;

        const res = await getSeoMeta(params, { signal: controller.signal });
        setSeo(res.data);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("SEO Fetch Error:", err);
        }
      }
    };

    fetchSeo();

    return () => controller.abort();
  }, [type, slug, page]);

  return seo;
};