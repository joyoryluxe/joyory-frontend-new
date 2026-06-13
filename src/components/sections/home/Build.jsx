import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/Build.css";

const FEATURE_BANNER_API = "https://beauty.joyory.com/api/user/categories/category/skin/landing";

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
      
      const { data } = await axios.get(FEATURE_BANNER_API, { withCredentials: true });
      
      console.log("Feature Banners API Response:", data);

      // Handle different possible response structures
      const featureBanners = data.featureBanners || data.data?.featureBanners || [];
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
  const handleBannerClick = useCallback((banner) => {
    console.log("Banner clicked:", banner);

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
  }, [navigate]);

  // Get banner image URL safely
  const getBannerImage = (banner) => {
    if (banner.image?.[0]?.url) return banner.image[0].url;
    if (typeof banner.image === "string") return banner.image;
    return "/placeholder-banner.jpg";
  };

  if (loading) {
    return (
      <section className="py-5">
        <div className="container text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading banners...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error || banners.length === 0) {
    return null; // Hide section if error or no banners
  }

  return (
    <section className="feature-banners py-2 bg-white">
      <div className="container-fluid-lg p-0 ms-lg-4">
        {banners.map((banner, index) => (
          <div
            key={banner._id || index}
            className="feature-banner-card mb-5 mobile-responsive-code"
            onClick={() => handleBannerClick(banner)}
            style={{ cursor: "pointer" }}
          >
            <div className="border-0 overflow-hidden">
              <div className="row g-0">
                <div className="col-12">
                  <img
                    src={getBannerImage(banner)}
                    alt={banner.title || "Feature"}
                    className="w-100 img-fluid"
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder-banner.jpg";
                      e.target.style.objectFit = "contain";
                      e.target.style.padding = "40px";
                      e.target.style.background = "#f8f9fa";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureBanners;