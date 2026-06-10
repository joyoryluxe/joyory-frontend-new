// src/components/CustomerReviews.jsx
import React from "react";
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
  // Calculate percentages for rating bars
  const getRatingPercentage = (count) => {
    if (!reviewSummary?.totalReviews || reviewSummary.totalReviews === 0) return 0;
    return Math.round((count / reviewSummary.totalReviews) * 100);
  };

  // Get total reviews count
  const totalReviews = reviewSummary?.totalReviews || 0;
  const avgRating = reviewSummary?.avgRating || product?.avgRating || 0;

  return (
    <section className="reviews-section mt-lg-5 mt-0">
      <h2 className="mb-4 text-center-heading-review-setion">Customer Reviews</h2>

      {/* ============================================ */}
      {/* RATING SUMMARY SECTION - Added from backend */}
      {/* ============================================ */}
      {totalReviews > 0 && (
        // <div className="rating-summary-card mb-4 p-4 bg-light rounded border">
        <div className="rating-summary-card mb-4">
          <div className="row align-items-center">
            {/* Left: Average Rating */}
            <div className="col-md-3 text-center border-end">
              <div className="display-4 fw-bold text-dark">
                {avgRating.toFixed(1)}
              </div>
              <div className="mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    color={i < Math.round(avgRating) ? "#ffc107" : "#eee"}
                  />
                ))}
              </div>
              <div className="text-muted">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Middle: Rating Distribution Bars */}
            <div className="col-md-6 px-4">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviewSummary?.ratingDistribution?.[star] || 0;
                const percentage = getRatingPercentage(count);

                return (
                  <div key={star} className="d-flex align-items-center mb-2">
                    <span className="me-2" style={{ width: '30px' }}>{star} ★</span>
                    <div className="progress flex-grow-1" style={{ height: '15px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <span className="ms-2 text-muted small" style={{ width: '40px' }}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Write Review Button */}
            <div className="col-md-3 text-center">
              <p className="text-muted mb-2">Share your thoughts</p>
              <button
                className="btn btn-primary w-100"
                onClick={() => setShowReviewForm(!showReviewForm)} style={{background:"#212529"}}
              >
                {showReviewForm ? "Cancel Review" : "Write a Review"}
              </button>
            </div>
          </div>
        </div>
      )}















      {showReviewForm && (
        <div className="mt-4 mb-5">
          <form className="p-4 border rounded bg-light" onSubmit={handleReviewSubmit}>
            <h4 className="mb-3">Write a Review</h4>

            {/* Variant Selection Dropdown for Review */}
            {variantsList.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Select Variant</label>
                <select
                  className="form-select form-select-sss"
                  value={newReview.variantSku}
                  onChange={handleReviewVariantSelect}
                  required
                >
                  <option value="">Choose a variant...</option>
                  {variantsList.map((variant) => (
                    <option
                      key={variant.sku || variant.variantSku}
                      value={variant.sku || variant.variantSku}
                    >
                      {variant.shadeName || variant.name || "Default"}
                      {variant.stock <= 0 ? " (Out of Stock)" : ""}
                    </option>
                  ))}
                </select>
                {newReview.shadeName && (
                  <div className="mt-2 small text-muted">
                    Selected: {newReview.shadeName}
                  </div>
                )}
              </div>
            )}

            <div className="mb-3">
              <label className="d-block mb-2">Rating</label>
              <div className="d-flex align-items-center">
                {[1, 2, 3, 4, 5].map(n => (
                  <FaStar
                    key={n}
                    size="24"
                    style={{ cursor: 'pointer', marginRight: '5px' }}
                    color={n <= newReview.rating ? "#ffc107" : "#ddd"}
                    onClick={() => setNewReview({ ...newReview, rating: n })}
                  />
                ))}
                <span className="ms-2">{newReview.rating} stars</span>
              </div>
            </div>

            <textarea
              className="form-control mb-3"
              placeholder="Share your experience..."
              rows="4"
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              value={newReview.comment}
              required
            ></textarea>

            <div className="mb-3">
              <label className="form-label">Upload Photos (Optional)</label>
              <input
                type="file"
                multiple
                className="form-control"
                onChange={(e) => setReviewImages(Array.from(e.target.files))}
                accept="image/*"
              />
              {reviewImages.length > 0 && (
                <div className="mt-2">
                  <small>{reviewImages.length} file(s) selected</small>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={submitting || !newReview.variantSku}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>

            {!newReview.variantSku && (
              <div className="alert alert-warning mt-2">
                Please select a variant before submitting your review.
              </div>
            )}
          </form>
        </div>
      )}
















      {/* Show write review button when no reviews */}
      {totalReviews === 0 && (
        <div className="text-center py-4 bg-light rounded border mb-4">
          <p className="text-muted mb-3">No reviews yet. Be the first to review this product!</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>
        </div>
      )}
      {/* ============================================ */}
      {/* END RATING SUMMARY SECTION */}
      {/* ============================================ */}

      <div className="filter-bar d-flex gap-3 mb-4 flex-wrap">
        <select
          value={filters.shade}
          onChange={(e) => setFilters({ ...filters, shade: e.target.value })}
          className="form-select"
          style={{ width: "auto" }}
        >
          <option className="text-left" value="All">All Shades</option>
          {variantsList.map(v => (
            <option className="text-start" key={v.sku || v.variantSku} value={v.shadeName}>
              {v.shadeName || "Default"}
            </option>
          ))}
        </select>

        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="form-select"
          style={{ width: "auto" }}
        >
          <option value="All">All Ratings</option>
          {[5, 4, 3, 2, 1].map(n => (
            <option key={n} value={n}>{n} Stars</option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="form-select"
          style={{ width: "auto" }}
        >
          <option value="Most Helpful">Most Helpful</option>
          <option value="Newest">Newest</option>
        </select>

        <button
          className={`btn-withphoto ${filters.photosOnly ? 'btn-primarysss' : ''}`}
          onClick={() => setFilters({ ...filters, photosOnly: !filters.photosOnly })}
        >
          With Photos
        </button>

        <button
          className="btn borderss"
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
        {reviews.map((r) => (
          <div key={r._id} className="review-card p-3 border-bottom">
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <img
                  src={r.customerProfileImage || "/default-avatar.png"}
                  className="rounded-circle"
                  width="50" height="50"
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

        {reviews.length === 0 && !showReviewForm && (
          <div className="text-center py-4">
            <p className="text-muted">No reviews match your filters.</p>
          </div>
        )}
      </div>

      {/* Write Review Form - Moved inside conditional or kept at bottom */}

    </section>
  );
};

export default CustomerReviews;








