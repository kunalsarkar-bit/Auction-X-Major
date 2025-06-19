import React, { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  Save,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Settings,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const ProfileSettingsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phoneNo: "",
    alternativePhoneNo: "",
    gender: "",
    dateOfBirth: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    profilePicture: null,
  });

  const [previewUrl, setPreviewUrl] = useState(
    "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg"
  );
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Mock user email - in real app, get from auth context
  const userEmail = useSelector((state) => state.auth.user?.email);

  // API functions
  const apiRequest = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await apiRequest(
        `${API_URL}/api/auth/user/${userEmail}`
      );

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        address: userData.address || "",
        phoneNo: userData.phoneNo || "",
        alternativePhoneNo: userData.alternativePhoneNo || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth || "",
        city: userData.city || "",
        state: userData.state || "",
        country: userData.country || "",
        pinCode: userData.pinCode || "",
        profilePicture: null,
      });

      // Set profile picture if exists
      if (userData.profilePic && userData.profilePic.length > 0) {
        setPreviewUrl(userData.profilePic[0].secure_url);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      showNotification("Error loading user data", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (profileData, userEmail) => {
    try {
      const response = await axios.patch(
        `${API_URL}/api/auth/updateUserProfile/${userEmail}`,
        profileData,
        {
          withCredentials: true, // Crucial for sending cookies
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const uploadProfilePicture = async (file, userEmail) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);
      formData.append("email", userEmail);

      const response = await axios.post(
        `${API_URL}/api/auth/upload-profile-pic`,
        formData,
        {
          withCredentials: true, // Send cookies
          headers: {
            "Content-Type": "multipart/form-data", // Required for FormData
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (!userEmail) {
      console.warn("User email is not available yet");
      return;
    }

    console.log("User email found:", userEmail);
    fetchUserData();
  }, [userEmail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification("File size must be less than 5MB", "error");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        showNotification("Please select a valid image file", "error");
        return;
      }

      try {
        // Create preview
        const fileUrl = URL.createObjectURL(file);
        setPreviewUrl(fileUrl);

        // Upload immediately
        setIsSaving(true);
        // await uploadProfilePicture(file);
        await uploadProfilePicture(file, userEmail);
        showNotification("Profile picture updated successfully!", "success");
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        showNotification("Error uploading profile picture", "error");
        // Revert preview on error
        await fetchUserData();
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Prepare data for API (exclude profilePicture from form data)
      const { profilePicture, ...profileData } = formData;

      // await updateUserProfile(profileData);
      await updateUserProfile(formData, userEmail); // ✅ Correct
      setIsEditing(false);
      showNotification("Profile updated successfully!", "success");
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification("Error updating profile", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const showNotification = (message, type = "success") => {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notification-text");

    notificationText.textContent = message;
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg transition-all duration-300 z-50 ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`;

    notification.classList.remove("hidden");
    setTimeout(() => {
      notification.classList.add("hidden");
    }, 3000);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Success Notification */}
      <div
        id="notification"
        className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg hidden transition-all duration-300 z-50"
      >
        <span id="notification-text">Profile updated successfully!</span>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold">Profile Settings</h1>
          <p className="mt-2 opacity-90">
            Manage your personal information and account preferences
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Profile Summary */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-8 text-white text-center">
                <div className="relative mx-auto w-24 h-24 mb-4">
                  <img
                    src={previewUrl}
                    alt="Profile"
                    className="rounded-full object-cover w-full h-full border-4 border-white shadow-md"
                  />
                  <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera size={16} className="text-blue-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-semibold">
                  {formData.name || "User Name"}
                </h2>
                <p className="opacity-90 text-sm mt-1">{formData.email}</p>
              </div>

              <div className="p-6">
                <h3 className="font-medium text-gray-700 mb-4">
                  Account Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-2 text-blue-500" />
                    <span className="text-sm">
                      {formData.city && formData.state
                        ? `${formData.city}, ${formData.state}`
                        : "Location not set"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone size={18} className="mr-2 text-blue-500" />
                    <span className="text-sm">
                      {formData.phoneNo || "Phone not set"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleEditToggle}
                    className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                      isEditing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mt-6 hidden md:block">
              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-2">Settings</h3>
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "personal"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <User size={18} className="mr-2" />
                    Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab("account")}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                      activeTab === "account"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Settings size={18} className="mr-2" />
                    Account Settings
                  </button>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Tab Navigation for Mobile */}
              <div className="flex border-b md:hidden">
                <button
                  onClick={() => setActiveTab("personal")}
                  className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                    activeTab === "personal"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Personal Info
                </button>
                <button
                  onClick={() => setActiveTab("account")}
                  className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors ${
                    activeTab === "account"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Account Settings
                </button>
              </div>

              {/* Personal Information Form */}
              <div className={activeTab === "personal" ? "block" : "hidden"}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Personal Information
                    </h2>
                    {isEditing && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        Editing Mode
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <div
                        className={`relative rounded-md shadow-sm ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`pl-10 block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative rounded-md shadow-sm bg-gray-50">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={18} className="text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          disabled={true}
                          className="pl-10 block w-full rounded-md p-2.5 border border-gray-200 text-gray-700 bg-gray-50 cursor-not-allowed"
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Email cannot be changed
                      </p>
                    </div>

                    {/* DOB and Gender in same row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <div
                          className={`relative rounded-md shadow-sm ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`pl-10 block w-full rounded-md p-2.5 border transition-colors ${
                              !isEditing
                                ? "border-gray-200 text-gray-700 bg-gray-50"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender (Optional)
                        </label>
                        <select
                          name="gender"
                          value={formData.gender}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <div
                        className={`relative rounded-md shadow-sm ${
                          !isEditing ? "bg-gray-50" : ""
                        }`}
                      >
                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                          <MapPin size={18} className="text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows="3"
                          className={`pl-10 block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pin Code
                        </label>
                        <input
                          type="text"
                          name="pinCode"
                          value={formData.pinCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Add Country field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`block w-full rounded-md p-2.5 border transition-colors ${
                          !isEditing
                            ? "border-gray-200 text-gray-700 bg-gray-50"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        }`}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div
                          className={`relative rounded-md shadow-sm ${
                            !isEditing ? "bg-gray-50" : ""
                          }`}
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone size={18} className="text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`pl-10 block w-full rounded-md p-2.5 border transition-colors ${
                              !isEditing
                                ? "border-gray-200 text-gray-700 bg-gray-50"
                                : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alternative Phone No (Optional)
                        </label>
                        <input
                          type="tel"
                          name="alternativePhoneNo"
                          value={formData.alternativePhoneNo}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className={`block w-full rounded-md p-2.5 border transition-colors ${
                            !isEditing
                              ? "border-gray-200 text-gray-700 bg-gray-50"
                              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    {isEditing && (
                      <div className="flex justify-end mt-8">
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSaving ? (
                            <>
                              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={18} className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              </div>

              {/* Account Settings Tab */}
              <div className={activeTab === "account" ? "block" : "hidden"}>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">
                    Account Settings
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-blue-700 text-sm">
                      This is a placeholder for account settings like password
                      change, notification preferences, etc.
                    </p>
                  </div>

                  {/* Additional account settings would go here */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2025 YourCompany. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProfileSettingsPage;
