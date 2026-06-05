import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Useraccount.css";
import "../App.css";
import Sidebarcomon from "./Sidebarcomon";
import Footer from "./Footer";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Header from "./Header";
import { FaTimes } from "react-icons/fa";
import AddressSections from "./AddressSections";

const API_BASE = "https://beauty.joyory.com/api/user/profile";

const toInputDate = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10);
  const d = new Date(value);
  if (!isNaN(d)) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  }
  return "";
};

const Useraccount = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    profileImage: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    profileImage: "",
  });

  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(API_BASE, { credentials: "include" });

        if (res.status === 401 || res.status === 403) {
          navigate("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();

        const profileData = {
          fullName: data.profile.fullName || "",
          email: data.profile.email || "",
          phone: data.profile.phone || "",
          gender: data.profile.gender || "",
          dob: toInputDate(data.profile.dob),
          profileImage: data.profile.profileImage || "",
        };

        setProfile(profileData);
        setAddresses(data.addresses || []);
        setFormData({ ...profileData });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const readError = async (res) => {
    let msg = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
      else if (data?.error) msg = data.error;
    } catch { }
    return msg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ FIXED: Handle image upload with proper loading state
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    setImageLoading(true);

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const resImg = await fetch(`${API_BASE}/avatar`, {
        method: "POST",
        credentials: "include",
        body: formDataImg,
      });

      if (!resImg.ok) throw new Error(await readError(resImg));
      const imgData = await resImg.json();

      const newImageUrl = imgData?.profileImage || imgData?.image || "";
      
      setProfile((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));

      alert("Avatar updated successfully ✅");
    } catch (err) {
      console.error("Avatar upload error:", err);
      alert("Failed to upload avatar: " + err.message);
    } finally {
      setImageLoading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ✅ NEW: Remove profile image
  const handleRemoveImage = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove your profile picture?");
    if (!confirmRemove) return;

    setImageLoading(true);

    try {
      const res = await fetch(`${API_BASE}/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error(await readError(res));

      setProfile((prev) => ({
        ...prev,
        profileImage: "",
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      alert("Profile picture removed successfully ✅");
    } catch (err) {
      console.error("Remove avatar error:", err);
      alert("Failed to remove profile picture: " + err.message);
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender || undefined,
        dob: formData.dob
          ? (() => {
            const [year, month, day] = formData.dob.split("-");
            return `${day}-${month}-${year}`;
          })()
          : undefined,
      };

      const res = await fetch(API_BASE, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await readError(res));

      const updated = await res.json();
      const updatedProfile = updated.profile || updated;

      const updatedData = {
        fullName: updatedProfile.fullName || formData.fullName,
        email: updatedProfile.email || formData.email,
        phone: updatedProfile.phone || formData.phone,
        gender: updatedProfile.gender || formData.gender,
        dob: updatedProfile.dob ? toInputDate(updatedProfile.dob) : formData.dob,
        profileImage: updatedProfile.profileImage || formData.profileImage,
      };

      setProfile(updatedData);
      setFormData(updatedData);
      setEditMode(false);
      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      alert(err.message || "Failed to update profile");
    }
  };

  // Address Handlers (passed to AddressSections)
  const handleAddressChange = (index, field, value) => {
    const newAddrs = [...addresses];
    newAddrs[index][field] = value;
    setAddresses(newAddrs);
  };

  const handleAddNewAddress = () => {
    setAddresses((prev) => [
      ...prev,
      { name: "", addressLine1: "", city: "", state: "", pincode: "", phone: "", email: "" },
    ]);
  };

  const handleSaveAddress = async (index) => {
    const addr = addresses[index];
    try {
      let res, data;
      if (!addr._id) {
        res = await fetch(`${API_BASE}/address`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(addr),
        });
      } else {
        const { _id, ...payload } = addr;
        res = await fetch(`${API_BASE}/address/${_id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error(await readError(res));
      data = await res.json();

      const updatedAddrs = [...addresses];
      updatedAddrs[index] = data;
      setAddresses(updatedAddrs);
      alert("Address saved successfully ✅");
    } catch (err) {
      console.error("Address save error:", err);
      alert("Failed to save address: " + err.message);
    }
  };

  const handleDeleteAddress = async (index) => {
    const addr = addresses[index];
    try {
      if (addr._id) {
        const res = await fetch(`${API_BASE}/address/${addr._id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!res.ok) throw new Error(await readError(res));
      }
      setAddresses((prev) => prev.filter((_, i) => i !== index));
      alert("Address deleted successfully ✅");
    } catch (err) {
      console.error("Delete address error:", err);
      alert("Failed to delete address: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) return;

    try {
      const res = await fetch("https://beauty.joyory.com/api/user/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Delete account failed: ${res.status} ${errorText}`);
      }

      alert("Account deleted successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      alert("Failed to delete account. Please try again.");
    }
  };

  if (loading)
    return (
      <div
        className="fullscreen-loader page-title-main-name"
        style={{
          minHeight: "100vh",
          width: "100%",
        }}
      >
        <div className="text-center">
          <DotLottieReact className='foryoulanding-css'
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare the best products for you...
          </p>
        </div>
      </div>
    );
    
  if (!profile) return null;

  // ✅ Helper to get image URL with cache busting
  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    // Add timestamp to prevent caching issues
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <>
      <Header />

      <div className="ua-page mt-lg-5 pt-lg-5 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <h3 className="ua-title ms-4 page-title-main-name">Personal Details</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <section className="ua-card">
            <h3 className="ua-title page-title-main-name">Personal Details</h3>

            {/* ✅ FIXED: Avatar with remove button and proper loading state */}
            <div className="ua-avatar-row">
              <div className="ua-avatar-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                <div className="ua-avatar" style={{ position: 'relative' }}>
  {imageLoading ? (
    <div className="ua-avatar-loading" style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : profile.profileImage ? (
    <img
      src={getImageUrl(profile.profileImage)}
      alt="avatar"
      style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #e0e0e0'
      }}
      onError={(e) => {
        e.currentTarget.src = "/default-avatar.png";
        e.currentTarget.onerror = null;
      }}
    />
  ) : (
    <div style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      border: '2px solid #e0e0e0'
    }}>
      <svg 
        width="60" 
        height="60" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.6 }}
      >
        <circle cx="12" cy="8" r="4" fill="#999999" />
        <path 
          d="M12 14C8.68629 14 6 16.6863 6 20H18C18 16.6863 15.3137 14 12 14Z" 
          fill="#999999" 
        />
      </svg>
    </div>
  )}
  
  {/* Remove image button - only show if image exists and in edit mode */}
  {editMode && profile.profileImage && !imageLoading && (
    <button
      className="ua-avatar-remove"
      onClick={handleRemoveImage}
      style={{
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease'
      }}
      title="Remove profile picture"
    >
      <FaTimes size={14} />
    </button>
  )}
</div>
                
                {editMode && (
                  <label 
                    className="ua-avatar-edit" 
                    style={{
                      position: 'absolute',
                      bottom: '5px',
                      right: '5px',
                      background: '#000',
                      color: 'white',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  >
                    <input 
                      ref={fileInputRef}
                      className="page-title-main-name" 
                      type="file" 
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageChange} 
                      disabled={imageLoading}
                      style={{ display: 'none' }}
                    />
                    ✎
                  </label>
                )}
              </div>
            </div>

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
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Email ID</label>
                  <input
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>
                <div className="ua-field page-title-main-name">
                  <label className="ua-label">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </div>

                <div className="ua-field ua-actions page-title-main-name">
                  {!editMode ? (
                    <button type="button" className="ua-btn edit-save-profile-button" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </button>
                  ) : (
                    <button type="button" className="ua-btn edit-save-profile-button" onClick={handleSaveProfile}>
                      Save Profile
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* Separated Address Section with Per-Address Edit */}
            <AddressSections
              addresses={addresses}
              handleAddressChange={handleAddressChange}
              handleSaveAddress={handleSaveAddress}
              handleDeleteAddress={handleDeleteAddress}
              handleAddNewAddress={handleAddNewAddress}
            />

            <div className="ua-danger mt-4">
              <button className="ua-delete page-title-main-name" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </>
  );
};

export default Useraccount;
