// src/components/CustomerReviews.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaStar, FaThumbsUp, FaCheckCircle } from "react-icons/fa";
import "../../styles/ProductDetail.css";

const CustomerReviews = ({
  product,
  reviews,
  reviewSummary,
  variantsList,
  filters,
  setFilters,
  likedReviews,
  showReviewForm,
  setShowReviewForm,
  newReview,
  setNewReview,
  reviewImages,
  setReviewImages,
  submitting,
  handleReviewVariantSelect,
  handleReviewSubmit,
  handleHelpfulVote
}) => {
  const [selectOpen, setSelectOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [shadeDropdownOpen, setShadeDropdownOpen] = useState(false);
  const shadeRef = useRef(null);

  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const ratingRef = useRef(null);

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectOpen(false);
      }
      if (shadeRef.current && !shadeRef.current.contains(event.target)) {
        setShadeDropdownOpen(false);
      }
      if (ratingRef.current && !ratingRef.current.contains(event.target)) {
        setRatingDropdownOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectOption = (variant) => {
    if (variant) {
      handleReviewVariantSelect({ target: { value: variant.sku || variant.variantSku } });
    } else {
      setNewReview((prev) => ({
        ...prev,
        variantSku: "",
        shadeName: "",
      }));
    }
    setSelectOpen(false);
  };

  // Calculate percentages for rating bars
  const getRatingPercentage = (count) => {
    if (!reviewSummary?.totalReviews || reviewSummary.totalReviews === 0) return 0;
    return Math.round((count / reviewSummary.totalReviews) * 100);
  };

  // Get total reviews count
  const totalReviews = reviewSummary?.totalReviews || reviews?.length || 0;
  const avgRating = reviewSummary?.avgRating || product?.avgRating || 0;

  // Fallback client-side filtering to guarantee filter functionality
  const filteredReviews = (reviews || []).filter((r) => {
    // Shade filter
    if (filters.shade && filters.shade !== "All") {
      const reviewShade = r.shadeName ? r.shadeName.trim().toLowerCase() : "";
      const filterShade = filters.shade.trim().toLowerCase();
      if (reviewShade !== filterShade) return false;
    }
    // Rating filter
    if (filters.rating && filters.rating !== "All") {
      if (r.rating !== parseInt(filters.rating)) return false;
    }
    // Photos only filter
    if (filters.photosOnly) {
      if (!r.images || r.images.length === 0) return false;
    }
    return true;
  }).sort((a, b) => {
    // Sort filter
    if (filters.sort === "Most Helpful") {
      return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
    } else if (filters.sort === "Newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  return (
    <section className="reviews-section mt-lg-5 mt-0">
      <h2 className="mb-4 text-heading-review-setion">Customer Reviews</h2>

      {/* ============================================ */}
      {/* RATING SUMMARY SECTION - Added from backend */}
      {/* ============================================ */}
      {totalReviews > 0 && (
        <div className="rating-summary-card mb-4">
          <div className="row align-items-center">
            {/* Left: Average Rating */}
            <div className="col-md-4 text-center border-end d-flex flex-column align-items-center justify-content-center">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="d-flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      size={20}
                      color={i < Math.round(avgRating) ? "#ffc107" : "#eee"}
                    />
                  ))}
                </div>
                <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>
                  {avgRating.toFixed(2)} out of 5
                </span>
              </div>
              <div className="text-muted small">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Middle: Rating Distribution Bars */}
            <div className="col-md-4 px-md-4 py-3 py-md-0">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewSummary?.ratingDistribution?.[star] || 0;
                const percentage = getRatingPercentage(count);

                return (
                  <div key={star} className="d-flex align-items-center mb-4 gap-2">
                    <div className="d-flex gap-0.5" style={{ width: '68px', justifyContent: 'flex-start' }}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={15}
                          color={i < star ? "#ffc107" : "#eee"}
                        />
                      ))}
                    </div>
                    <div className="progress flex-grow-1" style={{ height: '5px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${percentage}%`, backgroundColor: '#000000', borderRadius: '3px' }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="text-muted small text-end" style={{ width: '25px', fontSize: '12px' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Write Review Button */}
            <div className="col-md-4 text-center border-start d-flex align-items-center justify-content-center">
              <button
                className="review-write-pill-btn"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>
          </div>
        </div>
      )}















      {showReviewForm && (
        <div className="review-form-container mt-4 mb-5">
          <form className="review-form-card" onSubmit={handleReviewSubmit}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="review-form-title m-0">Write a Review</h3>
              <button
                type="button"
                className="btn-close-form"
                onClick={() => setShowReviewForm(false)}
                title="Cancel"
              >
                &times;
              </button>
            </div>

            <div className="row g-4 mb-4">
              {/* Variant Selection Dropdown for Review */}
              {variantsList.length > 0 && (
                <div className="col-12">
                  <label className="review-field-label">Select Variant</label>
                  <div className="review-custom-select-wrapper" ref={dropdownRef}>
                    <button
                      type="button"
                      className="form-select review-select-input review-custom-select-trigger text-start"
                      onClick={() => setSelectOpen(!selectOpen)}
                    >
                      {newReview.shadeName || "Choose a variant..."}
                    </button>
                    {selectOpen && (
                      <ul className="review-custom-select-options">
                        <li
                          className={!newReview.variantSku ? "selected" : ""}
                          onClick={() => handleSelectOption(null)}
                        >
                          Choose a variant...
                        </li>
                        {variantsList.map((variant) => {
                          const skuVal = variant.sku || variant.variantSku;
                          const shadeText = variant.shadeName || variant.name || "Default";
                          const isSelected = newReview.variantSku === skuVal;
                          return (
                            <li
                              key={skuVal}
                              className={isSelected ? "selected" : ""}
                              onClick={() => handleSelectOption(variant)}
                            >
                              {shadeText}
                              {variant.stock <= 0 ? " (Out of Stock)" : ""}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                  {newReview.shadeName && (
                    <div className="mt-2 small text-muted font-montserrat">
                      Selected: <span className="fw-semibold text-dark">{newReview.shadeName}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Rating Section */}
              <div className="col-12">
                <label className="review-field-label">Rating</label>
                <div className="d-flex align-items-center h-100 py-1">
                  <div className="d-flex gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                      <FaStar
                        key={n}
                        size="28"
                        style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
                        color={n <= newReview.rating ? "#ffc107" : "#e0e0e0"}
                        onClick={() => setNewReview({ ...newReview, rating: n })}
                      />
                    ))}
                  </div>
                  <span className="ms-3 text-muted small font-montserrat">
                    {newReview.rating ? `${newReview.rating} Star${newReview.rating !== 1 ? 's' : ''}` : 'Select Rating'}
                  </span>
                </div>
              </div>

              {/* Comment Section */}
              <div className="col-12">
                <label className="review-field-label">Review Comment</label>
                <textarea
                  className="form-control review-textarea"
                  placeholder="What did you like or dislike? How does it feel?"
                  rows="5"
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  value={newReview.comment}
                  required
                ></textarea>
              </div>

              {/* File Upload Section */}
              <div className="col-12">
                <label className="review-field-label">Upload Photos (Optional)</label>
                <div className="review-file-upload-zone">
                  <input
                    type="file"
                    multiple
                    id="review-image-upload"
                    className="review-file-input"
                    onChange={(e) => setReviewImages(Array.from(e.target.files))}
                    accept="image/*"
                  />
                  <label htmlFor="review-image-upload" className="review-file-upload-label">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-muted">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <span>Click to choose or drag images here</span>
                    {reviewImages.length > 0 ? (
                      <span className="mt-2 fw-semibold text-dark font-montserrat" style={{ fontSize: '13px' }}>
                        {reviewImages.length} image{reviewImages.length !== 1 ? 's' : ''} selected
                      </span>
                    ) : (
                      <span className="text-muted small mt-1">JPEG, PNG, or WEBP up to 5MB</span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Buttons & Alerts */}
            {!newReview.variantSku && (
              <div className="alert alert-warning py-2 mb-3 border-0 font-montserrat" style={{ backgroundColor: '#fffbeb', color: '#b45309', fontSize: '13px', borderRadius: '8px' }}>
                ⚠️ Please select a variant before submitting your review.
              </div>
            )}

            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                type="button"
                className="review-form-cancel-btn"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="review-form-submit-btn"
                disabled={submitting || !newReview.variantSku}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      )}
















      {/* Premium Empty State */}
      {totalReviews === 0 && !showReviewForm && (
        <div className="empty-reviews-container text-center my-4">
          <div className="empty-reviews-icon mb-3">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto" }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3 className="empty-reviews-heading font-montserrat mb-2">
            No Reviews Yet
          </h3>
          <p className="empty-reviews-text font-montserrat">
            Be the first to review this product and share your experience with others!
          </p>
          <button
            className="review-write-pill-btn"
            onClick={() => setShowReviewForm(true)}
          >
            Write a Review
          </button>
        </div>
      )}
      {/* ============================================ */}
      {/* END RATING SUMMARY SECTION */}
      {/* ============================================ */}

      {totalReviews > 0 && (
        <>
          <div className="filter-bar d-flex justify-content-center gap-3 mb-4 flex-wrap">
            {/* Shades Custom Select */}
            <div className="review-custom-select-wrapper review-filter-shade" ref={shadeRef}>
              <button
                type="button"
                className="form-select review-filter-item review-custom-select-trigger text-start"
                onClick={() => setShadeDropdownOpen(!shadeDropdownOpen)}
              >
                {filters.shade === "All" ? "All Shades" : filters.shade}
              </button>
              {shadeDropdownOpen && (
                <ul className="review-custom-select-options">
                  <li
                    className={filters.shade === "All" ? "selected" : ""}
                    onClick={() => {
                      setFilters({ ...filters, shade: "All" });
                      setShadeDropdownOpen(false);
                    }}
                  >
                    All Shades
                  </li>
                  {variantsList.map((v) => {
                    const isSelected = filters.shade === v.shadeName;
                    return (
                      <li
                        key={v.sku || v.variantSku}
                        className={isSelected ? "selected" : ""}
                        onClick={() => {
                          setFilters({ ...filters, shade: v.shadeName });
                          setShadeDropdownOpen(false);
                        }}
                      >
                        {v.shadeName || "Default"}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Ratings Custom Select */}
            <div className="review-custom-select-wrapper review-filter-rating" ref={ratingRef}>
              <button
                type="button"
                className="form-select review-filter-item review-custom-select-trigger text-start"
                onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
              >
                {filters.rating === "All" ? "All Ratings" : `${filters.rating} Stars`}
              </button>
              {ratingDropdownOpen && (
                <ul className="review-custom-select-options">
                  <li
                    className={filters.rating === "All" ? "selected" : ""}
                    onClick={() => {
                      setFilters({ ...filters, rating: "All" });
                      setRatingDropdownOpen(false);
                    }}
                  >
                    All Ratings
                  </li>
                  {[5, 4, 3, 2, 1].map((n) => {
                    const isSelected = filters.rating === String(n) || filters.rating === n;
                    return (
                      <li
                        key={n}
                        className={isSelected ? "selected" : ""}
                        onClick={() => {
                          setFilters({ ...filters, rating: String(n) });
                          setRatingDropdownOpen(false);
                        }}
                      >
                        {n} Stars
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Sort Custom Select */}
            <div className="review-custom-select-wrapper review-filter-sort" ref={sortRef}>
              <button
                type="button"
                className="form-select review-filter-item review-custom-select-trigger text-start"
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              >
                {filters.sort}
              </button>
              {sortDropdownOpen && (
                <ul className="review-custom-select-options">
                  {["Most Helpful", "Newest"].map((opt) => {
                    const isSelected = filters.sort === opt;
                    return (
                      <li
                        key={opt}
                        className={isSelected ? "selected" : ""}
                        onClick={() => {
                          setFilters({ ...filters, sort: opt });
                          setSortDropdownOpen(false);
                        }}
                      >
                        {opt}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="button"
              className={`review-filter-item ${filters.photosOnly ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
            >
              With Photos
            </button>

            <button
              type="button"
              className="review-filter-item"
              onClick={() => setFilters({
                shade: "All",
                rating: "All",
                sort: "Most Helpful",
                photosOnly: false,
              })}
            >
              Reset
            </button>
          </div>

          <div className="reviews-list">
            {filteredReviews.map((r) => (
              <div key={r._id} className="review-card p-3 border-bottom">
                <div className="d-flex justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={r.customerProfileImage || "/default-avatar.png"}
                      className="rounded-circle"
                      width="50"
                      height="50"
                      alt="user"
                    />
                    <span className="fw-bold">{r.customerName}</span>
                    {r.verifiedPurchase && (
                      <span className="text-success small">
                        <FaCheckCircle /> Verified
                      </span>
                    )}
                  </div>
                  <span className="text-muted small">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="my-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < r.rating ? "#ffc107" : "#eee"} />
                  ))}
                  <span className="ms-3 text-muted">Shade: {r.shadeName}</span>
                </div>

                <p>{r.comment}</p>

                {r.images?.length > 0 && (
                  <div className="review-images d-flex gap-2 mb-3">
                    {r.images.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        width="80"
                        className="rounded border"
                        alt="review"
                      />
                    ))}
                  </div>
                )}

                <button
                  className={`btn btn-sm ${likedReviews[r._id] ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => handleHelpfulVote(r._id)}
                >
                  <FaThumbsUp /> Helpful ({r.helpfulVotes || 0})
                </button>
              </div>
            ))}

            {filteredReviews.length === 0 && !showReviewForm && (
              <div className="text-center py-4">
                <p className="text-muted">No reviews match your filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Write Review Form - Moved inside conditional or kept at bottom */}

    </section>
  );
};

export default CustomerReviews;








