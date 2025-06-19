import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosWithAuth from "../../../redux/slices/axiosWithAuth"; // Adjust the import path as needed
import { MdDelete } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import { IoMdCloudDone } from "react-icons/io";
import { fetchCsrfToken } from "../../../redux/slices/csrfSecuritySlice";

// Predefined Cloudinary avatar URLs
const initialAvatars = [
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180238/pdvuipbvx8ctetyukiik.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180245/ysj2bnwwwn3yewjaemyh.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180301/ygrm3qffojquuodpcle7.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180302/hwn6uq26vm7xliubjodm.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180302/uvpavhuusqe9urqzso6a.jpg",
  "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180319/x3lhrg87lqad23oikjyt.jpg",
];

const DEFAULT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

const AvatarSelector = ({ onClose }) => {
  const auth = useSelector((state) => state.auth);
  const email = auth.user?.email;

  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [currentAvatar, setCurrentAvatar] = useState(null); // URL for display
  const [currentAvatarRaw, setCurrentAvatarRaw] = useState(null); // Raw data from API
  const [confirmed, setConfirmed] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [customImages, setCustomImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // Add this line for preview
  const { token: csrfToken } = useSelector((state) => state.csrf);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);

  //-------------------------------------PROFILE AVATAR-------------------------------------//

  // Helper function to validate URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Extract URL regardless of format
  const normalizeAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (typeof avatar === "string") return avatar;
    if (avatar.secure_url) return avatar.secure_url;
    if (Array.isArray(avatar) && avatar[0]?.secure_url)
      return avatar[0].secure_url;
    return null;
  };

  // Fetch current avatar on component mount
  useEffect(() => {
    const fetchCurrentAvatar = async () => {
      try {
        if (!email) return;

        const response = await axiosWithAuth.get(
          `${API_URL}/api/auth/user/${email}`
        );
        if (response.data?.user?.profilePic) {
          const avatar = response.data.user.profilePic;
          setCurrentAvatar(normalizeAvatarUrl(avatar));
          setCurrentAvatarRaw(avatar);
        }
      } catch (error) {
        console.error("Error fetching current avatar:", error);
      }
    };

    fetchCurrentAvatar();
  }, [email]);

  const handleAvatarSelect = (avatar) => {
    if (!isValidUrl(avatar)) {
      setError("Invalid avatar URL");
      return;
    }

    // Clear any file preview when selecting default avatar
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setSelectedAvatar(avatar);
    setConfirmed(false);
    setSuccessMessage("");
    setError(null);
  };

  const handleConfirmAvatar = async () => {
    if (isLoading || !selectedAvatar) return;
    if (!isValidUrl(selectedAvatar)) {
      setError("Please select a valid avatar image");
      return;
    }

    const currentUrl = normalizeAvatarUrl(currentAvatar);
    const selectedUrl = normalizeAvatarUrl(selectedAvatar);

    if (currentUrl === selectedUrl) {
      setError("Selected avatar is the same as your current one.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axiosWithAuth.patch(
        `${API_URL}/api/auth/updateUserProfileImage/${email}`,
        {
          profilePic: [
            {
              secure_url: selectedUrl,
              public_id: "", // Match your schema requirements
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken, // ✅ Add CSRF token here
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (response.data?.success) {
        setCurrentAvatar(selectedUrl);
        setCurrentAvatarRaw([{ secure_url: selectedUrl, public_id: "" }]);
        setConfirmed(true);
        setSuccessMessage("Avatar updated successfully!");

        window.dispatchEvent(new Event("profile-updated"));
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        config: error.config,
      });

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile picture. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAvatar = async (e, avatar) => {
    e.stopPropagation();

    if (initialAvatars.includes(avatar)) {
      setError("Default avatars cannot be deleted.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const updatedCustomImages = customImages.filter((img) => img !== avatar);
      setCustomImages(updatedCustomImages);

      if (selectedAvatar === avatar) {
        setSelectedAvatar(currentAvatar || initialAvatars[0]);
      }

      setError(
        "Note: Image removed from selection only. Contact admin to delete from storage."
      );
    } catch (error) {
      console.error("Error handling avatar:", error);
      setError("Failed to remove avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAvatar = async () => {
    const defaultAvatar = initialAvatars[0];

    setIsLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axiosWithAuth.patch(
        `${API_URL}/api/auth/updateUserProfileImage/${email}`,
        {
          profilePic: [
            {
              secure_url: defaultAvatar,
              public_id: "",
            },
          ],
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken, // ✅ Add CSRF token here
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (response.data?.success) {
        const updatedAvatarUrl =
          response.data.user?.profilePic?.[0]?.secure_url || defaultAvatar;

        setCurrentAvatar(updatedAvatarUrl);
        setCurrentAvatarRaw([{ secure_url: updatedAvatarUrl, public_id: "" }]);
        setSelectedAvatar(updatedAvatarUrl);
        setConfirmed(true);
        setSuccessMessage("Avatar reset successfully!");

        window.dispatchEvent(new Event("profile-updated"));
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Reset error:", {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      setError(error.response?.data?.message || "Failed to reset avatar");
    } finally {
      setIsLoading(false);
    }
  };
  //-------------------------------------PROFILE IMAGE GET-------------------------------------//

  // Fetch user's current profile picture on component mount
  useEffect(() => {
    const fetchProfilePic = async () => {
      if (!email) return;

      setIsLoading(true);
      setError(null);

      try {
        // First try getting user data which includes profile pic
        let profilePicData = null;
        let profilePicUrl = null;

        try {
          const userResponse = await axiosWithAuth.get(
            `${API_URL}/api/auth/user/${email}`
          );
          if (
            userResponse.data &&
            userResponse.data.profilePic &&
            userResponse.data.profilePic.length > 0
          ) {
            profilePicData = userResponse.data.profilePic;
            profilePicUrl = normalizeAvatarUrl(userResponse.data.profilePic);
          }
        } catch (userError) {
          console.warn(`Failed to fetch user data:`, userError);

          // If that fails, try the dedicated profile pic endpoint
          try {
            const picResponse = await axiosWithAuth.get(
              `${API_URL}/api/auth/profile-pic?email=${email}`
            );
            if (picResponse.data && picResponse.data.profilePic) {
              profilePicData = picResponse.data.profilePic;
              profilePicUrl = normalizeAvatarUrl(picResponse.data.profilePic);
            }
          } catch (picError) {
            console.warn(`Failed to fetch profile pic:`, picError);
          }
        }

        // Set avatar with robust fallback
        const avatarToUse =
          profilePicUrl || initialAvatars[0] || DEFAULT_AVATAR;

        setCurrentAvatar(avatarToUse);
        setCurrentAvatarRaw(profilePicData);
        setSelectedAvatar(avatarToUse);

        // Add custom image if unique
        if (profilePicUrl && !initialAvatars.includes(profilePicUrl)) {
          setCustomImages((prev) => {
            const uniqueImages = new Set([...prev, profilePicUrl]);
            return Array.from(uniqueImages).slice(0, 5);
          });
        }
      } catch (error) {
        console.error("Comprehensive profile picture fetch failed:", error);
        setError(
          error.response?.data?.message || "Failed to fetch profile picture"
        );
        const defaultAvatar = initialAvatars[0] || DEFAULT_AVATAR;
        setCurrentAvatar(defaultAvatar);
        setSelectedAvatar(defaultAvatar);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfilePic();
  }, [email]);

  //-------------------------------------PROFILE CUSTOM IMAGE -------------------------------------//

  const handleCustomImage = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setError("No file selected");
      return;
    }

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image (JPEG, PNG, GIF, or WEBP)");
      return;
    }

    if (file.size > maxSize) {
      setError("Image size should be less than 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("email", email);

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosWithAuth.post(
        `${API_URL}/api/auth/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        }
      );

      const imageUrl = response.data?.image?.secure_url;
      if (!imageUrl) {
        throw new Error(
          response.data?.message || "Profile picture update failed"
        );
      }

      if (imageUrl) {
        setSelectedAvatar(imageUrl);
        setConfirmed(false);
        window.dispatchEvent(new Event("profile-updated"));
        setSuccessMessage("Profile picture updated!");

        setCustomImages((prev) => {
          const updated = [imageUrl, ...prev.filter((img) => img !== imageUrl)];
          return updated.slice(0, 5);
        });
      } else {
        console.warn("Unexpected response format:", response.data);
        throw new Error("No image URL returned from server");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);

      if (error.code === "ECONNABORTED") {
        setError(
          "Upload timed out. Try a smaller image or check your connection."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to upload image. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl); // Clean up memory
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-white p-4 md:p-6 lg:p-8 rounded-lg w-full max-w-4xl mx-auto relative">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">
        Change Avatar
      </h1>

      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl flex flex-col items-center space-y-4 animate-scale-in">
            {/* Bouncing dots loader */}
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-delay-1"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-delay-2"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce-delay-3"></div>
            </div>

            {/* Loading text */}
            <div className="text-center space-y-1">
              <p className="font-medium text-gray-800 dark:text-gray-200">
                Updating your avatar
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Just a moment please...
              </p>
            </div>

            {/* Growing line progress indicator */}
            <div className="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-grow-width origin-left"></div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          className="text-gray-600 hover:text-blue-600"
          onClick={() => setEditMode((prev) => !prev)}
        >
          <div className="text-2xl lg:mr-16 lg:mt-14">
            {editMode ? <IoMdCloudDone /> : <FaUserEdit />}
          </div>
        </button>
      </div>

      {/* Avatar Selection and Preview - Responsive Layout */}
      <div className="flex flex-col md:flex-row">
        {/* Avatar Selection Grid */}
        <div
          className="flex-1 max-h-60 md:max-h-80 overflow-y-auto grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-4"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {/* Upload Custom Image Avatar */}
          {/* Upload Custom Image Avatar */}
          <div className="flex items-center justify-center">
            <label
              htmlFor="customImageUpload"
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center cursor-pointer border-4 transition-all duration-200 ${
                previewUrl
                  ? "border-blue-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 hover:bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xl md:text-2xl text-gray-700">+</span>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                id="customImageUpload"
                className="hidden"
                onChange={handleCustomImage}
                disabled={isLoading}
              />
            </label>
          </div>

          {/* Default Avatars */}
          {initialAvatars.map((avatar, index) => (
            <div key={`default-${index}`} className="relative group">
              <img
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full cursor-pointer border-4 transition-all duration-200 ${
                  normalizeAvatarUrl(selectedAvatar) === avatar
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleAvatarSelect(avatar)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
            </div>
          ))}

          {/* Custom Images */}
          {customImages.map((avatar, index) => (
            <div key={`custom-${index}`} className="relative group">
              <img
                src={avatar}
                alt={`Custom Avatar ${index + 1}`}
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full cursor-pointer border-4 transition-all duration-200 ${
                  normalizeAvatarUrl(selectedAvatar) === avatar
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleAvatarSelect(avatar)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
              {editMode && (
                <button
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 z-10"
                  onClick={(e) => handleDeleteAvatar(e, avatar)}
                  disabled={isLoading}
                >
                  <MdDelete />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Avatar Preview Section */}
        <div className="mt-6 md:mt-0 md:ml-4 lg:ml-8 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Current Avatar Preview (unchanged) */}
            <p className="text-gray-700 mb-2 text-sm">Current Avatar:</p>
            {currentAvatar ? (
              <img
                src={normalizeAvatarUrl(currentAvatar)}
                alt="Current Avatar"
                className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-gray-300 mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_AVATAR;
                }}
              />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-gray-300 mb-4 flex items-center justify-center bg-gray-100">
                <p className="text-gray-500 text-xs">No Avatar Set</p>
              </div>
            )}

            {/* Selected Avatar Preview - Modified for instant preview */}
            <p className="text-gray-700 mb-2 text-sm">Selected Avatar:</p>
            {selectedAvatar ? (
              typeof selectedAvatar === "string" ? (
                // For URL strings (default avatars)
                normalizeAvatarUrl(selectedAvatar) !==
                normalizeAvatarUrl(currentAvatar) ? (
                  <img
                    src={normalizeAvatarUrl(selectedAvatar)}
                    alt="Selected Avatar"
                    className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-blue-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <p className="text-blue-600 text-sm mb-2">
                      Same as current
                    </p>
                    <img
                      src={normalizeAvatarUrl(selectedAvatar)}
                      alt="Selected Avatar"
                      className="w-16 h-16 rounded-full border-2 border-gray-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_AVATAR;
                      }}
                    />
                  </div>
                )
              ) : (
                // For File objects (uploaded images) - shows instant preview
                <img
                  src={URL.createObjectURL(selectedAvatar)}
                  alt="Uploaded Avatar Preview"
                  className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-blue-500"
                />
              )
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-xs">No Selection</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          className={`px-4 sm:px-6 py-2 rounded-md font-bold transition-all duration-200 ${
            isLoading ||
            normalizeAvatarUrl(selectedAvatar) ===
              normalizeAvatarUrl(currentAvatar)
              ? "bg-gray-400 cursor-not-allowed"
              : confirmed
              ? "bg-green-500 cursor-default"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
          onClick={handleConfirmAvatar}
          disabled={
            isLoading ||
            normalizeAvatarUrl(selectedAvatar) ===
              normalizeAvatarUrl(currentAvatar) ||
            confirmed
          }
        >
          {isLoading
            ? "Updating..."
            : confirmed
            ? "Updated!"
            : "Confirm Avatar"}
        </button>

        {/* Reset Button */}
        <button
          className={`px-4 sm:px-6 py-2 rounded-md font-bold transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          onClick={handleResetAvatar}
          disabled={isLoading}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default AvatarSelector;
