// UserAccount.jsx - Modularized with subcomponents
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/UserAccount.css";
import "../../App.css";
import Sidebarcomon from "../../components/common/SidebarCommon";
import Footer from "../../components/common/Footer";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Header from "../../components/common/Header";
import AddressSections from "../cart-checkout/AddressSections";
import { getUserAllergens, saveUserAllergens } from "../../api/ingredientApi";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfileImage,
  removeProfileImage,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "../../api/userApi";
import { deleteUserAccount } from "../../api/authApi";
import { getErrorMessage, handleApiError } from "../../utils/errorHandler";
import { toast } from "react-toastify";
import SectionError from "../../components/common/SectionError";

import ProfileHeaderBanner from "../../components/sections/profile/ProfileHeaderBanner";
import ProfileDetailsForm from "../../components/sections/profile/ProfileDetailsForm";

const toInputDate = (value) => {
  if (!value) return "";
  const strVal = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(strVal)) return strVal.slice(0, 10);

  if (/^\d{2}-\d{2}-\d{4}/.test(strVal)) {
    const [day, month, year] = strVal.split("-");
    return `${year}-${month}-${day}`;
  }

  if (/^\d{2}\/\d{2}\/\d{4}/.test(strVal)) {
    const [day, month, year] = strVal.split("/");
    return `${year}-${month}-${day}`;
  }

  const d = new Date(strVal);
  if (!isNaN(d.getTime())) {
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
  const [fetchError, setFetchError] = useState(null);
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

  const [allergens, setAllergens] = useState([]);
  const [sensitiveIngredients, setSensitiveIngredients] = useState([]);
  const [allergenNotes, setAllergenNotes] = useState("");
  const [savingAllergens, setSavingAllergens] = useState(false);

  const handleSaveAllergens = async () => {
    setSavingAllergens(true);
    try {
      const res = await saveUserAllergens({
        allergens,
        sensitiveIngredients,
        notes: allergenNotes,
      });
      if (res.data?.success) {
        toast.success("Allergen preferences saved successfully! ✅");
      }
    } catch (err) {
      console.error("Error saving allergens:", err);
      handleApiError(err, "Failed to save allergen profile");
    } finally {
      setSavingAllergens(false);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await getUserProfile();
      const data = res.data;

      const profileData = {
        fullName: data?.profile?.fullName || "",
        email: data?.profile?.email || "",
        phone: data?.profile?.phone || "",
        gender: data?.profile?.gender || "",
        dob: toInputDate(data?.profile?.dob),
        profileImage: data?.profile?.profileImage || "",
      };

      setProfile(profileData);
      setAddresses(data?.addresses || []);
      setFormData({ ...profileData });

      try {
        const allergenRes = await getUserAllergens();
        if (allergenRes.data?.success) {
          setAllergens(allergenRes.data.allergens || []);
          setSensitiveIngredients(allergenRes.data.sensitiveIngredients || []);
          setAllergenNotes(allergenRes.data.notes || "");
        }
      } catch (err) {
        console.error("Error fetching allergens during profile load:", err);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
        return;
      }
      setFetchError(getErrorMessage(err, "Failed to load profile details. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageLoading(true);

    const formDataImg = new FormData();
    formDataImg.append("image", file);

    try {
      const resImg = await uploadProfileImage(formDataImg);
      const imgData = resImg.data;
      const newImageUrl = imgData?.profileImage || imgData?.image || "";

      setProfile((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: newImageUrl,
      }));

      toast.success("Avatar updated successfully ✅");
    } catch (err) {
      console.error("Avatar upload error:", err);
      handleApiError(err, "Failed to upload avatar");
    } finally {
      setImageLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove your profile picture?");
    if (!confirmRemove) return;

    setImageLoading(true);

    try {
      await removeProfileImage();

      setProfile((prev) => ({
        ...prev,
        profileImage: "",
      }));
      setFormData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      toast.success("Profile picture removed successfully ✅");
    } catch (err) {
      console.error("Remove avatar error:", err);
      handleApiError(err, "Failed to remove profile picture");
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

      const res = await updateUserProfile(payload);
      const updated = res.data;
      const updatedProfile = updated?.profile || updated;

      const updatedData = {
        fullName: updatedProfile?.fullName || formData.fullName,
        email: updatedProfile?.email || formData.email,
        phone: updatedProfile?.phone || formData.phone,
        gender: updatedProfile?.gender || formData.gender,
        dob: updatedProfile?.dob ? toInputDate(updatedProfile.dob) : formData.dob,
        profileImage: updatedProfile?.profileImage || formData.profileImage,
      };

      setProfile(updatedData);
      setFormData(updatedData);
      setEditMode(false);
      toast.success("Profile updated successfully ✅");
    } catch (err) {
      console.error("Save error:", err);
      handleApiError(err, "Failed to update profile");
    }
  };

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
      let res;
      if (!addr._id) {
        res = await addUserAddress(addr);
      } else {
        const { _id, ...payload } = addr;
        res = await updateUserAddress(_id, payload);
      }

      const updatedAddrs = [...addresses];
      updatedAddrs[index] = res.data;
      setAddresses(updatedAddrs);
      toast.success("Address saved successfully ✅");
    } catch (err) {
      console.error("Address save error:", err);
      handleApiError(err, "Failed to save address");
    }
  };

  const handleDeleteAddress = async (index) => {
    const addr = addresses[index];
    try {
      if (addr._id) {
        await deleteUserAddress(addr._id);
      }
      setAddresses((prev) => prev.filter((_, i) => i !== index));
      toast.success("Address deleted successfully ✅");
    } catch (err) {
      console.error("Delete address error:", err);
      handleApiError(err, "Failed to delete address");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await deleteUserAccount();
      toast.success("Account deleted successfully ✅");
      navigate("/login");
    } catch (err) {
      console.error("Delete account error:", err);
      handleApiError(err, "Failed to delete account. Please try again.");
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
          <DotLottieReact
            className="foryoulanding-css"
            src="https://lottie.host/73673e65-df58-41a5-87e7-b837c5d00fe8/dJVGVbJuYJ.lottie"
            loop
            autoplay
          />
          <p className="text-muted mb-0">
            Please wait while we prepare your account details...
          </p>
        </div>
      </div>
    );

  if (fetchError) {
    return (
      <>
        <Header />
        <div className="ua-page mt-5 pt-5">
          <SectionError error={fetchError} message="Unable to load account details." onRetry={fetchProfileData} />
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) return null;

  const getImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}t=${Date.now()}`;
  };

  return (
    <>
      <Header />

      <div className="ua-page mt-lg-0 pt-lg-0 mt-md-0 pt-md-5">
        <section className="Heading-Name mt-lg-5 pt-lg-3 mt-0 pt-md-0">
          <h3 className="ua-title ms-4 page-title-main-name d-lg-none">Personal Details</h3>
          <Sidebarcomon />
        </section>

        <main className="ua-content mt-lg-5 pt-lg-3 mt-md-0 pt-md-0">
          <h2
            className="ua-page-title page-title-main-name mb-4 d-none d-lg-block"
            style={{ fontSize: "24px", fontWeight: "600", color: "#222" }}
          >
            Personal Details
          </h2>

          <section className="ua-card">
            {/* Avatar & Header Banner */}
            <ProfileHeaderBanner
              profile={profile}
              editMode={editMode}
              imageLoading={imageLoading}
              fileInputRef={fileInputRef}
              onImageChange={handleImageChange}
              onRemoveImage={handleRemoveImage}
              getImageUrl={getImageUrl}
            />

            {/* Gender and Form Fields */}
            <ProfileDetailsForm
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              setEditMode={setEditMode}
              onChange={handleChange}
              onSaveProfile={handleSaveProfile}
            />

            {/* Addresses Section */}
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
