import React from 'react';
import { FaTimesCircle, FaCamera, FaTrash } from 'react-icons/fa';

export const RETURN_REASON_RULES = {
    DAMAGED: { imagesRequired: true },
    WRONG_ITEM: { imagesRequired: true },
    EXPIRED: { imagesRequired: true },
    QUALITY_ISSUE: { imagesRequired: true },
    SIZE_ISSUE: { imagesRequired: false },
    NO_LONGER_NEEDED: { imagesRequired: false },
};

export const RETURN_REASON_OPTIONS = {
    return: [
        { value: "DAMAGED", label: "Defective / Damaged product" },
        { value: "WRONG_ITEM", label: "Wrong item received" },
        { value: "EXPIRED", label: "Expired product" },
        { value: "QUALITY_ISSUE", label: "Quality issue" },
        { value: "SIZE_ISSUE", label: "Size / Fit issue" },
        { value: "NO_LONGER_NEEDED", label: "No longer needed / Change of mind" },
    ],
    replace: [
        { value: "DAMAGED", label: "Defective / Damaged product" },
        { value: "WRONG_ITEM", label: "Wrong item received" },
        { value: "QUALITY_ISSUE", label: "Quality issue" },
        { value: "SIZE_ISSUE", label: "Size / Fit issue" },
    ],
};

export default function ReturnRequestForm({
    idx,
    form,
    returning,
    onClose,
    onQuantityChange,
    onReasonChange,
    onDescriptionChange,
    onImagesChange,
    onRemoveImage,
    onSubmit,
}) {
    if (!form) return null;

    return (
        <div className="return-form-container mt-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 text-capitalize fw-bold">{form.type} Request</h6>
                <button className="btn btn-link text-danger p-0" onClick={() => onClose(idx)}>
                    <FaTimesCircle size={18} />
                </button>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold small">Quantity to {form.type}</label>
                <div className="qty-counter-wrap">
                    <button
                        className="qty-counter-btn"
                        onClick={() => onQuantityChange(idx, -1)}
                        disabled={form.quantity <= 1}
                    >
                        -
                    </button>
                    <span className="qty-counter-value">{form.quantity}</span>
                    <button
                        className="qty-counter-btn"
                        onClick={() => onQuantityChange(idx, 1)}
                        disabled={form.quantity >= form.maxQuantity}
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold small">
                    Reason for {form.type} <span className="text-danger">*</span>
                </label>
                <select
                    className="custom-select"
                    value={form.reason}
                    onChange={(e) => onReasonChange(idx, e.target.value)}
                >
                    <option value="">Select a reason</option>
                    {RETURN_REASON_OPTIONS[form.type]?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold small">Additional Comments</label>
                <textarea
                    className="custom-textarea"
                    rows="2"
                    value={form.description}
                    onChange={(e) => onDescriptionChange(idx, e.target.value)}
                    placeholder="Please provide any additional details..."
                />
            </div>

            <div className="mb-3">
                <label className="form-label fw-bold small">
                    Upload Images {RETURN_REASON_RULES[form.reason]?.imagesRequired && <span className="text-danger">*</span>}
                </label>
                <div
                    className="od-upload-area"
                    onClick={() => document.getElementById(`ret-img-${idx}`).click()}
                >
                    <FaCamera size={24} className="text-muted mb-2" />
                    <p className="mb-0 fw-semibold">Click to upload product image</p>
                    <small className="text-muted d-block mt-1">Required for damaged or quality issues (Max 5)</small>
                </div>
                <input
                    id={`ret-img-${idx}`}
                    type="file"
                    multiple
                    accept="image/*"
                    className="d-none"
                    onChange={(e) => onImagesChange(idx, e.target.files)}
                />

                {form.images?.length > 0 && (
                    <div className="od-preview-grid">
                        {form.images.map((img, i) => (
                            <div key={i} className="od-preview-img-wrap">
                                <img src={img.preview} alt="preview" />
                                <button className="btn-remove-preview" onClick={() => onRemoveImage(idx, i)}>
                                    <FaTrash size={8} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className="btn btn-premium-action btn-dark-p w-100 justify-content-center btn-sm mt-2"
                disabled={
                    returning ||
                    !form.reason ||
                    (RETURN_REASON_RULES[form.reason]?.imagesRequired && form.images.length === 0)
                }
                onClick={() => onSubmit(idx)}
            >
                {returning ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                    </>
                ) : (
                    `Submit ${form.type.toUpperCase()}`
                )}
            </button>
        </div>
    );
}
