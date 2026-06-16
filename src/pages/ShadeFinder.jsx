import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { Container } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import "../styles/ShadeFinder.css";

export default function SkinToneSelector() {
  const [tones, setTones] = useState([]);
  const [selectedShade, setSelectedShade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Fetch tones from API
  useEffect(() => {
    const fetchTones = async () => {
      try {
        const res = await fetch(
          "https://beauty.joyory.com/api/user/shadefinder/tones"
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.tones)) {
          // Clean up the data - trim spaces from URLs
          const cleanedTones = data.tones.map(tone => ({
            ...tone,
            heroImages: (tone.heroImages || []).map(url => url.trim()).filter(url => url)
          }));

          setTones(cleanedTones);

          // Find first tone index with images
          const firstWithImagesIdx = cleanedTones.findIndex(t =>
            t.heroImages && t.heroImages.length > 0
          );

          if (firstWithImagesIdx >= 0) {
            setCurrentIndex(firstWithImagesIdx);
            setSelectedShade(cleanedTones[firstWithImagesIdx]);
          } else if (cleanedTones.length > 0) {
            setCurrentIndex(0);
            setSelectedShade(cleanedTones[0]);
          }
        } else {
          throw new Error("Invalid data structure from API");
        }
      } catch (err) {
        console.error("Error fetching tones:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTones();
  }, []);

  // Update selectedShade when currentIndex changes
  useEffect(() => {
    if (tones.length > 0 && tones[currentIndex]) {
      setSelectedShade(tones[currentIndex]);
    }
  }, [currentIndex, tones]);

  // Handle Label Click
  const handleLabelClick = (index) => {
    setCurrentIndex(index);
  };

  // Handle Slider Change
  const handleSliderChange = (e) => {
    setCurrentIndex(parseInt(e.target.value));
  };

  const handleNext = async () => {
    if (!selectedShade) return;

    try {
      const res = await fetch(
        `https://beauty.joyory.com/api/user/shadefinder/undertones?toneKey=${selectedShade.key}`
      );
      const data = await res.json();

      navigate("/shadefinderundertone", {
        state: {
          shade: selectedShade,
          undertones: data.undertones || [],
        },
      });
    } catch (err) {
      console.error("Error fetching undertones:", err);
    }
  };


  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">Loading shades...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="bg-white py-5" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="text-center text-danger">
            <h4>Error Loading Shades</h4>
            <p>{error}</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="shadefinder-wrapper bg-white" >
        <Container className="d-flex flex-column align-items-center">
          {/* Header Section */}
          <header className="text-center mb-4 mb-md-5">
            <h1 className="display-6 fw-normal mb-2" style={{ color: "#333" }}>
              Find your Shade Range
            </h1>
            <p className="text-secondary small">
              Choose the group that best represents your skin tone
            </p>
          </header>

          {/* Slider & Labels Section */}
          <div className="slider-labels-container w-100 mb-4 mb-md-5">
            <div className="d-flex align-items-end mb-2 mb-md-3 px-1" style={{ width: '100%' }}>
              {tones.map((tone, idx) => (
                <div
                  key={tone._id}
                  style={{ width: `${100 / tones.length}%` }}
                  className="text-center"
                >
                  <button
                    onClick={() => handleLabelClick(idx)}
                    className={`slider-label-btn ${currentIndex === idx ? 'active' : ''}`}
                  >
                    {tone.name}
                  </button>
                </div>
              ))}
            </div>

            <div
              className="position-relative"
              style={{
                height: '5px',
                left: `${100 / (2 * (tones.length || 1))}%`,
                width: `${100 * ((tones.length || 1) - 1) / (tones.length || 1)}%`
              }}
            >
              <div
                className="position-absolute top-0 start-0 w-100 h-100 rounded-pill"
                style={{
                  background: 'linear-gradient(to right, #f9e4d4, #e8c1a0, #d4a373, #a67c52, #7b4b2a, #3d1d11)'
                }}
              />
              <input
                type="range"
                min="0"
                max={tones.length > 0 ? tones.length - 1 : 0}
                value={currentIndex}
                onChange={handleSliderChange}
                className="position-absolute top-0 start-0 w-100 h-100 opacity-0 cursor-pointer"
                style={{ zIndex: 10 }}
              />
              <Motion.div
                className="position-absolute rounded-circle shadow-sm"
                animate={{
                  left: `${tones.length > 1 ? (currentIndex / (tones.length - 1)) * 100 : 0}%`,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  width: '24px',
                  height: '24px',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#000',
                  border: '2px solid #fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              />
            </div>
          </div>

          {/* Horizontal Scroll Grid Section */}
          <div className="tones-horizontal-scroll-container">
            <div
              className="tones-scroll-track"
              style={{ transform: `translateX(calc(25% - ${currentIndex * 50}%))` }}
            >
              {tones.map((tone, toneIdx) => (
                <div
                  key={tone._id}
                  className={`tone-section ${currentIndex !== toneIdx ? 'inactive' : ''}`}
                >
                  <div className="tone-images-grid">
                    {(tone.heroImages || []).slice(0, 6).map((imgUrl, imgIdx) => (
                      <div key={imgIdx} className="tone-image-item shadow-sm">
                        <img
                          src={imgUrl}
                          alt={`${tone.name} focus ${imgIdx + 1}`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                    {/* Placeholder images if less than 6 */}
                    {[...Array(Math.max(0, 6 - (tone.heroImages?.length || 0)))].map((_, i) => (
                      <div key={`placeholder-${i}`} className="tone-image-item opacity-25"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="slider-labels-container w-100 position-relative d-flex justify-content-center align-items-center mt-3 mt-md-4 action-footer">
            {/* Pagination Dots (Optional, matching Rare Beauty) */}
            <div className="d-flex gap-2">
              {tones.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className="p-2 border-0 bg-transparent d-flex align-items-center justify-content-center"
                  style={{
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                  aria-label={`Go to shade ${idx + 1}`}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: currentIndex === idx ? '#000' : '#ddd',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </button>
              ))}
            </div>

            <button
              className="btn-next-rectangular position-absolute end-0"
              onClick={handleNext}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}