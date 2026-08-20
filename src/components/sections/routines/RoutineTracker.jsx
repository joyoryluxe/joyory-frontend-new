import React from 'react';
import {
    FaArrowLeft, FaCalendarAlt, FaChartLine, FaImages, FaMagic,
    FaExclamationTriangle, FaCartPlus, FaSun, FaMoon, FaHeart, FaSave, FaCheck,
} from 'react-icons/fa';

export const BADGE_MAP = {
    consistency_starter: "🔥 Consistency Starter",
    routine_warrior: "⚔️ Routine Warrior",
    skincare_scientist: "🔬 Skincare Scientist",
    transformation_master: "👑 Transformation Master",
    perfect_week: "✨ Perfect Week",
};

export default function RoutineTracker({
    activeTrackerRoutine,
    trackerStats,
    trackerTab,
    onTabChange,
    onBack,
    formatGoalName,
    onAddRoutineToCart,
    logDate,
    onTrackerDateChange,
    amCompleted,
    setAmCompleted,
    pmCompleted,
    setPmCompleted,
    skinRating,
    setSkinRating,
    diaryNote,
    setDiaryNote,
    progressPhotos,
    setProgressPhotos,
    photoUploading,
    onStartCamera,
    onProgressPhotoUpload,
    onSaveDailyLog,
    isSavingLog,
    calendarGrid,
    getCellClassName,
    ratingsTrend,
    trackerLogs,
    coachLoading,
    coachAdvice,
    coachTips,
    auditLoading,
    auditData,
}) {
    return (
        <div>
            {/* Back Button and Journey Header */}
            <div className="d-flex align-items-center gap-3 mb-4">
                <button
                    className="rb-icon-btn"
                    style={{ background: "#eaeaea" }}
                    onClick={onBack}
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h2 className="mb-0 font-weight-bold" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        {activeTrackerRoutine.name}
                        {trackerStats?.streakCount > 0 && (
                            <span className="rb-streak-badge" style={{ background: "#000000", color: "#ffffff", padding: "4px 10px", borderRadius: "20px", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                🔥 {trackerStats.streakCount} Day Streak!
                            </span>
                        )}
                    </h2>
                    <span className="text-muted font-weight-bold" style={{ fontSize: "0.9rem" }}>
                        🎯 Goal: {formatGoalName(activeTrackerRoutine.goal)} | Milestone: {activeTrackerRoutine.milestoneTitle}
                    </span>
                </div>
            </div>

            {/* Tracker Tabs */}
            <div className="rb-tabs mb-4 flex-wrap gap-2">
                <button
                    className={`rb-tab-btn ${trackerTab === "checkin" ? "active" : ""}`}
                    onClick={() => onTabChange("checkin")}
                >
                    <FaCalendarAlt style={{ marginRight: "6px" }} /> Daily Check-In
                </button>
                <button
                    className={`rb-tab-btn ${trackerTab === "trends" ? "active" : ""}`}
                    onClick={() => onTabChange("trends")}
                >
                    <FaChartLine style={{ marginRight: "6px" }} /> Skin Trends
                </button>
                <button
                    className={`rb-tab-btn ${trackerTab === "diary" ? "active" : ""}`}
                    onClick={() => onTabChange("diary")}
                >
                    <FaImages style={{ marginRight: "6px" }} /> Progress Diary
                </button>
                <button
                    className={`rb-tab-btn ${trackerTab === "coach" ? "active" : ""}`}
                    onClick={() => onTabChange("coach")}
                >
                    <FaMagic style={{ marginRight: "6px" }} /> AI Coach
                </button>
                <button
                    className={`rb-tab-btn ${trackerTab === "audit" ? "active" : ""}`}
                    onClick={() => onTabChange("audit")}
                >
                    <FaExclamationTriangle style={{ marginRight: "6px" }} /> Routine Audit
                </button>
            </div>

            {/* Tracker Sub-Tabs Content */}
            <div className="rb-tracker-grid">
                {/* Left: General Tracker Stats Widget */}
                <div className="d-flex flex-column gap-3">
                    <div className="rb-tracker-stats-row">
                        <div className="rb-tracker-stat-box">
                            <div className="rb-tracker-stat-val">Day {trackerStats.currentDay}</div>
                            <div className="rb-tracker-stat-lbl">Journey Day</div>
                        </div>
                        <div className="rb-tracker-stat-box">
                            <div className="rb-tracker-stat-val">{trackerStats.complianceRate}%</div>
                            <div className="rb-tracker-stat-lbl">Compliance</div>
                        </div>
                    </div>

                    <div className="rb-tracker-stat-box text-left">
                        <div className="d-flex justify-content-between mb-2">
                            <span>Products Owned:</span>
                            <strong>
                                {activeTrackerRoutine.ownedProductsCount || 0} /{" "}
                                {activeTrackerRoutine.requiredProductsCount || activeTrackerRoutine.steps?.length || 0}
                            </strong>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Ownership Rate:</span>
                            <strong>{activeTrackerRoutine.completionPercentage || 0}%</strong>
                        </div>
                    </div>

                    {activeTrackerRoutine?.badges?.length > 0 && (
                        <div className="rb-tracker-stat-box text-left">
                            <div className="font-weight-bold mb-2" style={{ fontSize: "0.9rem" }}>🏆 Awarded Badges:</div>
                            <div className="d-flex flex-wrap gap-1">
                                {activeTrackerRoutine.badges.map((b) => (
                                    <span
                                        key={b}
                                        className="rb-badge"
                                        style={{
                                            background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
                                            color: "#0d47a1",
                                            fontWeight: "bold",
                                            fontSize: "0.75rem",
                                            padding: "4px 8px",
                                        }}
                                    >
                                        {BADGE_MAP[b] || b}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        className="rb-create-btn justify-content-center"
                        onClick={() => onAddRoutineToCart(activeTrackerRoutine._id)}
                    >
                        <FaCartPlus /> Buy Routine Set
                    </button>
                </div>

                {/* Right Dynamic Section */}
                <div className="w-100">
                    {/* Tab 1: Check-in & Compliance Calendar Grid */}
                    {trackerTab === "checkin" && (
                        <div className="d-flex flex-column gap-4">
                            {/* Check-In Logging Form */}
                            <form onSubmit={onSaveDailyLog} className="rb-checkin-card">
                                <h3>Daily Check-In Log</h3>

                                <div className="rb-checkin-date-picker">
                                    <label className="rb-label mb-2">Check-in Date:</label>
                                    <input
                                        type="date"
                                        value={logDate}
                                        onChange={(e) => onTrackerDateChange(e.target.value)}
                                        className="rb-input w-100"
                                    />
                                </div>

                                <label className="rb-label mb-2">Completion Status:</label>
                                <div className="rb-checkin-slot-row">
                                    <button
                                        type="button"
                                        className={`rb-slot-toggle-btn am ${amCompleted ? "active" : ""}`}
                                        onClick={() => setAmCompleted(!amCompleted)}
                                    >
                                        <FaSun size={20} />
                                        <span>AM Check-In</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`rb-slot-toggle-btn pm ${pmCompleted ? "active" : ""}`}
                                        onClick={() => setPmCompleted(!pmCompleted)}
                                    >
                                        <FaMoon size={20} />
                                        <span>PM Check-In</span>
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <label className="rb-label">Skin Satisfaction Rating (1-5)</label>
                                    <div className="rb-rating-stars">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                className={`rb-star-btn ${skinRating >= star ? "active" : ""}`}
                                                onClick={() => setSkinRating(star)}
                                            >
                                                <FaHeart />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="rb-label">Daily Skin Log Notes</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Skin felt soft, no redness today"
                                        value={diaryNote}
                                        onChange={(e) => setDiaryNote(e.target.value)}
                                        className="rb-input w-100"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="rb-label mb-2">Visual Skin Diary (Progress Photos)</label>

                                    <div className="rb-photo-upload-area p-3 mb-3 text-center">
                                        <div className="d-flex justify-content-center gap-3">
                                            <button
                                                type="button"
                                                className="btn rb-btn-secondary d-flex align-items-center gap-2 m-0"
                                                onClick={onStartCamera}
                                                disabled={photoUploading}
                                                style={{ cursor: "pointer" }}
                                            >
                                                📷 Take Selfie
                                            </button>
                                            <label className="btn rb-btn-secondary d-flex align-items-center gap-2 m-0" style={{ cursor: "pointer" }}>
                                                🖼️ Upload Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={onProgressPhotoUpload}
                                                    disabled={photoUploading}
                                                />
                                            </label>
                                        </div>

                                        {photoUploading && (
                                            <div className="text-muted mt-2 d-flex align-items-center justify-content-center gap-1" style={{ fontSize: "0.8rem" }}>
                                                <div className="spinner-border spinner-border-sm text-primary" role="status" style={{ width: "12px", height: "12px" }} />
                                                Uploading to Cloudinary...
                                            </div>
                                        )}
                                    </div>

                                    {progressPhotos.filter(Boolean).length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {progressPhotos.filter(Boolean).map((url, idx) => (
                                                <div key={idx} className="position-relative rb-photo-preview" style={{ width: "80px", height: "80px" }}>
                                                    <img
                                                        src={url}
                                                        alt={`Progress ${idx + 1}`}
                                                        style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="position-absolute d-flex align-items-center justify-content-center bg-danger text-white border-0"
                                                        style={{
                                                            top: "-5px",
                                                            right: "-5px",
                                                            width: "20px",
                                                            height: "20px",
                                                            borderRadius: "50%",
                                                            fontSize: "0.75rem",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={() => setProgressPhotos(progressPhotos.filter((_, i) => i !== idx))}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="rb-btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    disabled={isSavingLog}
                                >
                                    <FaSave /> {isSavingLog ? "Saving log..." : "Save Daily Log"}
                                </button>
                            </form>

                            {/* Compliance Grid Calendar Map */}
                            <div className="rb-checkin-card">
                                <h3>{activeTrackerRoutine.durationDays}-Day Compliance Journey Calendar</h3>
                                <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                                    Monitor logs across the duration of your routine starting from{" "}
                                    {new Date(activeTrackerRoutine.startDate).toLocaleDateString()}.
                                </p>

                                <div className="rb-compliance-calendar">
                                    {Array.from({ length: activeTrackerRoutine.durationDays || 30 }).map((_, i) => {
                                        const cellClass = getCellClassName(i + 1);
                                        return (
                                            <div
                                                key={i}
                                                className={`rb-calendar-cell ${cellClass}`}
                                                title={`Day ${i + 1}`}
                                            >
                                                <span>Day {i + 1}</span>
                                                {cellClass && <div className="rb-calendar-day-dot" />}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="rb-calendar-legend">
                                    <div className="rb-legend-item">
                                        <div className="rb-legend-box" style={{ background: "#c8e6c9" }} />
                                        <span>AM & PM Complete</span>
                                    </div>
                                    <div className="rb-legend-item">
                                        <div className="rb-legend-box" style={{ background: "#ffe0b2" }} />
                                        <span>Half Complete</span>
                                    </div>
                                    <div className="rb-legend-item">
                                        <div className="rb-legend-box" style={{ background: "#ffcdd2" }} />
                                        <span>Missed Log</span>
                                    </div>
                                    <div className="rb-legend-item">
                                        <div className="rb-legend-box" style={{ background: "#fafafa" }} />
                                        <span>No Log</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Skin Rating Trends Bar Chart */}
                    {trackerTab === "trends" && (
                        <div className="rb-trend-chart-container">
                            <h3>Skin Satisfaction Rating Trend (1-5 Scale)</h3>
                            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                                Visualize day-to-day skin improvements recorded in check-in logs.
                            </p>

                            {ratingsTrend.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    No ratings logged yet. Track progress and add skin scores in the check-in tab.
                                </div>
                            ) : (
                                <div className="rb-trend-chart-bars">
                                    {ratingsTrend.map((log, idx) => (
                                        <div key={idx} className="rb-trend-bar-col">
                                            <div
                                                className="rb-trend-bar-fill"
                                                data-rating={log.rating}
                                                style={{ height: `${(log.rating / 5) * 100}%` }}
                                            />
                                            <span className="rb-trend-bar-date">{log.date.substring(5)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 3: Photo Diary Progress Gallery */}
                    {trackerTab === "diary" && (
                        <div>
                            <h3>Visual Skin Progress Photo Gallery</h3>
                            <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                                A history of your before & after skin recovery journey.
                            </p>

                            {trackerLogs.filter((l) => l.photoUrl || (l.progressPhotos && l.progressPhotos.length > 0)).length === 0 ? (
                                <div className="text-center py-5 border rounded-lg bg-light mt-3">
                                    <span style={{ fontSize: "2rem" }}>📷</span>
                                    <p className="text-muted mt-2">
                                        No progress photos logged. Attach photo URLs when doing check-ins to build your diary.
                                    </p>
                                </div>
                            ) : (
                                <div className="rb-photo-diary-grid">
                                    {trackerLogs
                                        .filter((l) => l.photoUrl || (l.progressPhotos && l.progressPhotos.length > 0))
                                        .map((log, idx) => {
                                            const rawPhotos = log.progressPhotos && log.progressPhotos.length > 0 ? log.progressPhotos : [log.photoUrl];
                                            const photos = rawPhotos.map((p) => (typeof p === "object" && p.photoUrl ? p.photoUrl : p)).filter(Boolean);
                                            return photos.map((photo, pIdx) => (
                                                <div key={`${idx}-${pIdx}`} className="rb-diary-card">
                                                    <img src={photo} alt={`Progress ${log.dateString}`} className="rb-diary-img" />
                                                    <div className="rb-diary-content">
                                                        <div className="rb-diary-date">{log.dateString}</div>
                                                        {log.notes && <p className="rb-diary-notes mt-2">"{log.notes}"</p>}
                                                    </div>
                                                </div>
                                            ));
                                        })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 4: AI Skincare Coach Review */}
                    {trackerTab === "coach" && (
                        <div className="rb-checkin-card">
                            <h3>AI Skincare Coach Advice</h3>
                            <div className="rb-guarantee-banner mb-3 mt-2">
                                <span>
                                    ⭐ <strong>99% Guarantee:</strong> 99% of users who followed this routine with Joyory products saw visible improvement within 30 days.
                                </span>
                            </div>
                            {coachLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status" />
                                    <p className="mt-2 text-muted">Analyzing your skin response & routine logs...</p>
                                </div>
                            ) : (
                                <div>
                                    {coachAdvice && (
                                        <div className="p-3 mb-3 rounded bg-light border" style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>
                                            {coachAdvice}
                                        </div>
                                    )}
                                    {coachTips?.length > 0 && (
                                        <div>
                                            <h5 className="font-weight-bold mb-2">Coach Best Practices:</h5>
                                            <ul className="pl-3">
                                                {coachTips.map((tip, idx) => (
                                                    <li key={idx} className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab 5: Routine Audit Report */}
                    {trackerTab === "audit" && (
                        <div className="rb-checkin-card">
                            <h3>Routine Health & Safety Audit</h3>
                            {auditLoading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status" />
                                    <p className="mt-2 text-muted">Auditing routine steps & ingredients...</p>
                                </div>
                            ) : auditData ? (
                                <div>
                                    <div className="d-flex align-items-center gap-3 mb-3">
                                        <div className="font-weight-bold" style={{ fontSize: "1.2rem" }}>
                                            Health Score: <span className="text-success">{auditData.healthScore || 100}%</span>
                                        </div>
                                        <span className="badge badge-success px-2 py-1">
                                            {auditData.safetyRating || "Optimized"}
                                        </span>
                                    </div>

                                    {auditData.clashWarnings?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-danger font-weight-bold">Ingredient Conflicts:</h5>
                                            <ul className="pl-3">
                                                {auditData.clashWarnings.map((w, idx) => (
                                                    <li key={idx} className="text-danger small mb-1">
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {auditData.missingEssentials?.length > 0 && (
                                        <div className="mb-3">
                                            <h5 className="text-warning font-weight-bold">Recommended Additions:</h5>
                                            <ul className="pl-3">
                                                {auditData.missingEssentials.map((m, idx) => (
                                                    <li key={idx} className="text-muted small mb-1">
                                                        {m}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {auditData.layeringFeedback && (
                                        <p className="text-muted small mb-0">
                                            <strong>Layering Notes:</strong> {auditData.layeringFeedback}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-muted">Audit data unavailable.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
