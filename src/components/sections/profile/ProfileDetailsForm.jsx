import React from 'react';

export default function ProfileDetailsForm({
    formData,
    setFormData,
    editMode,
    setEditMode,
    onChange,
    onSaveProfile,
}) {
    return (
        <>
            {/* Gender Selection */}
            <div className="ua-field-group">
                <label className="ua-label page-title-main-name">Gender</label>
                <div className="ua-gender page-title-main-name">
                    {["female", "male", "non-binary", "prefer-not"].map((g) => (
                        <button
                            key={g}
                            type="button"
                            className={formData.gender === g ? "active" : ""}
                            disabled={!editMode}
                            onClick={() => setFormData((p) => ({ ...p, gender: g }))}
                        >
                            {g === "prefer-not" ? "Prefer not to say" : g.charAt(0).toUpperCase() + g.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Personal Details Form */}
            <form className="ua-form" onSubmit={(e) => e.preventDefault()}>
                <div className="ua-row">
                    <div className="ua-field page-title-main-name">
                        <label className="ua-label">Full Name</label>
                        <input
                            name="fullName"
                            value={formData.fullName || ""}
                            onChange={onChange}
                            disabled={!editMode}
                        />
                    </div>
                    <div className="ua-field page-title-main-name">
                        <label className="ua-label">Email ID</label>
                        <input
                            name="email"
                            value={formData.email || ""}
                            onChange={onChange}
                            disabled={!editMode}
                        />
                    </div>
                    <div className="ua-field page-title-main-name">
                        <label className="ua-label">Phone Number</label>
                        <input
                            name="phone"
                            value={formData.phone || ""}
                            onChange={onChange}
                            disabled={!editMode}
                            placeholder="10 digit mobile number"
                        />
                    </div>
                    <div className="ua-field page-title-main-name">
                        <label className="ua-label">Birth Date</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob || ""}
                            onChange={onChange}
                            disabled={!editMode}
                        />
                    </div>

                    <div className="ua-field ua-actions page-title-main-name">
                        {!editMode ? (
                            <button
                                type="button"
                                className="ua-btn edit-save-profile-button"
                                onClick={() => setEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="ua-btn edit-save-profile-button"
                                onClick={onSaveProfile}
                            >
                                Save Profile
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}
