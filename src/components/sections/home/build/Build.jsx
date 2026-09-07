/**
 * Build.jsx
 * ─────────────────────────────────────────────────────────────
 * Feature banners section component using BuildCard sub-component.
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoryLanding } from "../../../../api/categoryApi";
import Loader from "../../../common/Loader";
import "../../../../styles/Build.css";
import BuildCard from "./BuildCard";

const FeatureBanners = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch banners
  const fetchFeatureBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await getCategoryLanding("skin");
      const featureBanners =
        data.featureBanners || data.data?.featureBanners || [];
      setBanners(Array.isArray(featureBanners) ? featureBanners : []);
    } catch (err) {
      console.error("Failed to fetch feature banners:", err);
      setError("Failed to load banners. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatureBanners();
  }, [fetchFeatureBanners]);

  // Handle banner click with smart navigation
  const handleBannerClick = useCallback(
    (banner) => {
      const link = banner.link || banner.image?.[0]?.link;
      if (!link) {
        console.warn("No link found for banner:", banner.title);
        return;
      }
      if (link.startsWith("http")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        navigate(link);
      }
    },
    [navigate]
  );

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <Loader text="Loading banners..." height={100} />
        </div>
      </section>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  return (
    <section className="feature-banners py-2 px-4 bg-white">
      <div className="container-fluid-lg p-0">
        {banners.map((banner, index) => (
          <BuildCard
            key={banner._id || index}
            banner={banner}
            onClick={() => handleBannerClick(banner)}
          />
        ))}
      </div>
    </section>
  );
};

export default FeatureBanners;
export { BuildCard };
