import React from 'react';
import { FaTimes } from 'react-icons/fa';

export default function ProfileHeaderBanner({
    profile,
    editMode,
    imageLoading,
    fileInputRef,
    onImageChange,
    onRemoveImage,
    getImageUrl,
}) {
    return (
        <div className="ua-profile-header-banner">
            <div className="ua-profile-avatar-container">
                <div className="ua-profile-avatar-circle">
                    {imageLoading ? (
                        <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{ width: "24px", height: "24px" }}
                        />
                    ) : profile.profileImage ? (
                        <img
                            src={getImageUrl(profile.profileImage)}
                            alt="avatar"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            onError={(e) => {
                                e.currentTarget.src = "/default-avatar.png";
                                e.currentTarget.onerror = null;
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f0f0f0",
                            }}
                        >
                            <svg
                                width="50"
                                height="50"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ opacity: 0.5 }}
                            >
                                <circle cx="12" cy="8" r="4" fill="#999" />
                                <path
                                    d="M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z"
                                    fill="#999"
                                />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Remove image button */}
                {editMode && profile.profileImage && !imageLoading && (
                    <button
                        type="button"
                        className="ua-avatar-remove-btn"
                        onClick={onRemoveImage}
                        title="Remove profile picture"
                    >
                        <FaTimes />
                    </button>
                )}

                {/* Edit overlay */}
                {editMode && (
                    <label className="ua-avatar-edit-btn">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                            onChange={onImageChange}
                            disabled={imageLoading}
                            style={{ display: "none" }}
                        />
                        ✎
                    </label>
                )}
            </div>

            {/* User Details side in Banner */}
            <div className="ua-profile-banner-details flex-grow-1">
                <h4 className="page-title-main-name">
                    {profile.fullName || "Joyory Luxe Member"}
                </h4>
                <p className="text-muted">{profile.email}</p>
                {profile.phone && <p className="text-muted">📱 {profile.phone}</p>}
                {editMode && (
                    <div className="d-flex gap-2 mt-2">
                        <button
                            type="button"
                            className="ua-banner-upload-btn"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={imageLoading}
                        >
                            Upload New
                        </button>
                        {profile.profileImage && (
                            <button
                                type="button"
                                className="ua-banner-remove-btn"
                                onClick={onRemoveImage}
                                disabled={imageLoading}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
