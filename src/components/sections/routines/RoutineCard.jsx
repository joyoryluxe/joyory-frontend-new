import React from 'react';
import {
    FaCalendarAlt, FaEdit, FaShareAlt, FaTrash, FaCartPlus,
} from 'react-icons/fa';

export default function RoutineCard({
    routine,
    formatGoalName,
    onOpenTracker,
    onEditRoutine,
    onShareRoutine,
    onDeleteRoutine,
    onAddRoutineToCart,
}) {
    return (
        <div className="rb-routine-card">
            <div className="rb-card-header">
                <div>
                    <div className="rb-card-badges">
                        <span className="rb-badge rb-badge-time">{routine.timeOfDay}</span>
                        <span className="rb-badge rb-badge-goal">{formatGoalName(routine.goal)}</span>
                        {routine.isAISuggested && (
                            <span className="rb-badge rb-badge-ai">AI</span>
                        )}
                    </div>
                </div>

                <div className="rb-card-actions">
                    <button className="rb-icon-btn" title="Track Progress" onClick={() => onOpenTracker(routine)}>
                        <FaCalendarAlt />
                    </button>
                    <button className="rb-icon-btn" title="Edit Routine" onClick={() => onEditRoutine(routine)}>
                        <FaEdit />
                    </button>
                    <button className="rb-icon-btn" title="Share Routine" onClick={() => onShareRoutine(routine._id)}>
                        <FaShareAlt />
                    </button>
                    <button className="rb-icon-btn delete" title="Delete Routine" onClick={() => onDeleteRoutine(routine._id)}>
                        <FaTrash />
                    </button>
                </div>
            </div>

            <div className="rb-card-body">
                <div className="d-flex justify-content-between align-items-start gap-2">
                    <div style={{ flex: 1 }}>
                        <h3 onClick={() => onOpenTracker(routine)} style={{ cursor: "pointer" }}>{routine.name}</h3>
                        {routine.milestoneTitle && (
                            <div className="rb-card-milestone">🎯 {routine.milestoneTitle}</div>
                        )}
                        {routine.description && (
                            <p className="rb-card-desc" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {routine.description}
                            </p>
                        )}
                    </div>
                    <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: "55px", height: "55px", flexShrink: 0 }} title="Compliance Consistency Rate">
                        <svg className="w-100 h-100" viewBox="0 0 36 36">
                            <path
                                strokeWidth="3"
                                stroke="#eee"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                strokeWidth="3"
                                strokeDasharray={`${routine.complianceRate || 0}, 100`}
                                strokeLinecap="round"
                                stroke="var(--joyory-gold)"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                        </svg>
                        <div className="position-absolute font-weight-bold" style={{ fontSize: "0.85rem", color: "#333" }}>
                            {routine.complianceRate || 0}%
                        </div>
                    </div>
                </div>

                <div className="rb-card-progress mt-3">
                    <div className="d-flex justify-content-between mb-1" style={{ fontSize: "0.85rem" }}>
                        <span>Compliance Progress:</span>
                        <strong>Day {routine.currentDay || 1} of {routine.durationDays}</strong>
                    </div>
                    <div className="rb-progress-bar-bg">
                        <div
                            className="rb-progress-bar-fill"
                            style={{ width: `${Math.min(100, ((routine.currentDay || 1) / routine.durationDays) * 100)}%` }}
                        />
                    </div>
                </div>

                <div className="rb-card-progress-meta mt-2" style={{ fontSize: "0.82rem", color: "#555" }}>
                    <span>📈 Compliance Rate:</span>
                    <span>{routine.complianceRate || 0}% Consistency</span>
                </div>

                <div className="rb-card-progress-meta mt-2" style={{ fontSize: "0.82rem", color: "#555" }}>
                    <span>📦 Products Owned:</span>
                    <strong>{routine.ownedProductsCount || 0} of {routine.requiredProductsCount || routine.steps?.length || 0} ({routine.completionPercentage || 0}%)</strong>
                </div>

                {routine.completionPercentage < 100 && (
                    <div className="rb-allergen-alert-box mt-2" style={{ background: "#ffffff", border: "1px dashed #000000", color: "#000000", padding: "6px 12px", fontSize: "0.78rem" }}>
                        <strong>Missing Products:</strong> You need to buy {(routine.requiredProductsCount || routine.steps?.length || 0) - (routine.ownedProductsCount || 0)} product(s) to complete this routine.
                    </div>
                )}

                {/* Step Products Preview */}
                <div className="rb-products-preview">
                    {routine.steps?.slice(0, 5).map((step, idx) => (
                        step.productImage && (
                            <img
                                key={idx}
                                src={step.productImage}
                                alt={step.productName}
                                className="rb-preview-img"
                                title={step.productName}
                            />
                        )
                    ))}
                    {routine.steps?.length > 5 && (
                        <span className="rb-steps-count">+{routine.steps.length - 5} steps</span>
                    )}
                </div>
            </div>

            <div className="rb-card-footer">
                <button className="rb-btn-secondary" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => onOpenTracker(routine)}>
                    Track Journey
                </button>
                <button className="rb-create-btn" style={{ padding: "6px 14px", fontSize: "0.85rem" }} onClick={() => onAddRoutineToCart(routine._id)}>
                    <FaCartPlus /> Buy products
                </button>
            </div>
        </div>
    );
}
