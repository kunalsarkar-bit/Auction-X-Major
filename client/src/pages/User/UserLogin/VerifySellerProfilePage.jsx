import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import validator from "validator";
import { isPossiblePhoneNumber } from "libphonenumber-js";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Optional: for default styling
const API_URL = import.meta.env.VITE_API_URL;
//----------------------TESTING-----------------------//
import { fetchCsrfToken } from "../../../redux/slices/csrfSecuritySlice";

const VerifySellerProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user data from Redux
  const auth = useSelector((state) => state.auth);
  const userData = auth.user;
  const isUserVerified = auth.user?.isVerified;

  // Redirect verified users to homepage
  useEffect(() => {
    if (isUserVerified) {
      navigate("/");
    }
  }, [isUserVerified, navigate]);

  // Get URL parameters
  const urlParams = new URLSearchParams(location.search);
  const loginType = urlParams.get("loginType") || auth.loginType;

  // Determine if this is a Google login or regular login
  const isGoogleLogin = loginType === "google";

  // Get user data from Redux or URL params
  const name = userData?.name || urlParams.get("name");
  const email = userData?.email || urlParams.get("email");

  // Form state
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [alternativePhoneNo, setAlternativePhoneNo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  // Component state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    phone: "",
    alternativePhoneNo: "",
    pinCode: "",
    state: "",
    city: "",
    country: "",
    storeName: "",
    storeDescription: "",
  });

  // Lists for dropdowns
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  //------------------------------------testing-----------------------------------//
  const { token: csrfToken } = useSelector((state) => state.csrf);

  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);

  // Load countries on component mount
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const countryStates = State.getStatesOfCountry(country);
      setStates(countryStates);
      setState(""); // Reset state when country changes
      setCity(""); // Reset city when country changes
    } else {
      setStates([]);
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (country && state) {
      const stateCities = City.getCitiesOfState(country, state);
      setCities(stateCities);
      setCity(""); // Reset city when state changes
    } else {
      setCities([]);
    }
  }, [country, state]);

  // Check if name or email is missing
  useEffect(() => {
    if (!name || !email) {
      const missingFields = [];
      if (!name) missingFields.push("name");
      if (!email) missingFields.push("email");

      console.error(`Missing data: ${missingFields.join(", ")}`);
      setError(`Required data is missing: ${missingFields.join(", ")}`);
    } else {
      setError(""); // Reset error if all data is present
    }
  }, [name, email, location]);

  // Clean up object URL when component unmounts or new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Validation functions
  const validateMobileNumber = (phoneNumber) => {
    if (!phoneNumber) return false;
    return isPossiblePhoneNumber(phoneNumber);
  };

  const validateAlternativeMobileNumber = (altNumber, primaryNumber) => {
    if (!altNumber) return true; // Optional field

    // Check if same as primary number
    if (altNumber === primaryNumber) {
      return "same";
    }

    // Advanced validation
    return isPossiblePhoneNumber(altNumber) ? true : false;
  };

  const validatePinCode = (pinCode) => {
    return validator.isPostalCode(pinCode, "any");
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {
      phone: "",
      alternativePhoneNo: "",
      pinCode: "",
      state: "",
      city: "",
      country: "",
    };

    // Validate phone number
    if (!validateMobileNumber(phone)) {
      errors.phone = "Please enter a valid mobile number";
      isValid = false;
    }

    // Validate alternative phone number if provided
    if (alternativePhoneNo) {
      const altPhoneValidation = validateAlternativeMobileNumber(
        alternativePhoneNo,
        phone
      );

      if (altPhoneValidation === "same") {
        errors.alternativePhoneNo =
          "Alternative number cannot be the same as primary number";
        isValid = false;
      } else if (altPhoneValidation === false) {
        errors.alternativePhoneNo =
          "Please enter a valid alternative mobile number";
        isValid = false;
      }
    }

    // Validate PIN code
    if (!validatePinCode(pinCode)) {
      errors.pinCode = "Please enter a valid PIN code";
      isValid = false;
    }

    // Validate country, state, city
    if (!country) {
      errors.country = "Please select a country";
      isValid = false;
    }

    if (!state) {
      errors.state = "Please select a state";
      isValid = false;
    }

    if (!city) {
      errors.city = "Please select a city";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Clear previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      // Create new preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      setFile(selectedFile);
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      console.error("CSRF token not available yet");
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    // Check if the user has confirmed the details
    if (!isConfirmed) {
      toast.error("Please confirm your details before submitting.");
      return;
    }

    // Check if store name is provided for sellers
    if (!storeName) {
      toast.error("Please provide a store name.");
      return;
    }

    // Set loading state
    setLoading(true);
    setUploadProgress(0); // Reset upload progress

    try {
      let profileImage = null;

      // Upload file with progress tracking if a file is selected
      if (file) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", file);
        cloudinaryFormData.append("upload_preset", "product_image");

        // Using Axios to upload the file
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dszvpb3q5/image/upload",
          cloudinaryFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const { loaded, total } = progressEvent;
              const percentCompleted = Math.floor((loaded * 100) / total);
              setUploadProgress(percentCompleted);
            },
          }
        );

        profileImage = {
          secure_url: response.data.secure_url,
          public_id: response.data.public_id,
        };
      }

      // Create payload for backend
      const payload = {
        address,
        phoneNo: phone, // Full phone number with country code from PhoneInput
        gender,
        pinCode,
        country,
        state,
        city,
        alternativePhoneNo: alternativePhoneNo || "",
        profilePic: profileImage ? [profileImage] : [],
        email,
        name,
        storeName,
        storeDescription,
      };

      // Submit profile update to backend
      const profileUpdateResponse = await axios.patch(
        `${API_URL}/api/auth/seller/updateProfile`,
        payload,
        {
          headers: {
            "X-CSRF-Token": csrfToken, // ✅ Add CSRF token here
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      // Dispatch action to update user in Redux store
      dispatch({
        type: "UPDATE_USER_PROFILE",
        payload: profileUpdateResponse.data.user,
      });

      setSuccess("Profile updated successfully!");

      // Send OTP request before navigating
      await axios.post(
        `${API_URL}/api/auth/seller/send-otp`,
        { email },
        {
          headers: {
            "X-CSRF-Token": csrfToken, // ✅ Add CSRF token here
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      // Navigate to the OTP page with email as a query parameter and source information
      navigate("/OTPverification", {
        state: {
          email,
          from: "verifyProfile", // Add source information
        },
      });
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setError(
        error.response
          ? error.response.data.message
          : "An error occurred while updating the profile."
      );
    } finally {
      setLoading(false); // Reset loading state
      setUploadProgress(0); // Reset upload progress after submission
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-[0_0_10px_rgba(255,223,150,0.8),0_0_20px_rgba(255,223,150,0.6),0_0_30px_rgba(255,223,150,0.4)] w-full max-w-2xl space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Profile
          </h2>
          {error && (
            <p className="mt-2 text-center text-sm text-red-600">{error}</p>
          )}
          {success && (
            <p className="mt-2 text-center text-sm text-green-600">{success}</p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={name || ""}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-3 px-4 text-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email || ""}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 py-3 px-4 text-gray-500 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={phone}
                  onChange={setPhone}
                  className="w-full flex rounded-md border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              {formErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Country</option>
                {countries.map((countryItem) => (
                  <option key={countryItem.isoCode} value={countryItem.isoCode}>
                    {countryItem.flag} {countryItem.name}
                  </option>
                ))}
              </select>
              {formErrors.country && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.country}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700"
              >
                State
              </label>
              <select
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                disabled={!country}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select State</option>
                {states.map((stateItem) => (
                  <option key={stateItem.isoCode} value={stateItem.isoCode}>
                    {stateItem.name}
                  </option>
                ))}
              </select>
              {formErrors.state && (
                <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                disabled={!state}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select City</option>
                {cities.map((cityItem) => (
                  <option key={cityItem.name} value={cityItem.name}>
                    {cityItem.name}
                  </option>
                ))}
              </select>
              {formErrors.city && (
                <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="pinCode"
                className="block text-sm font-medium text-gray-700"
              >
                PIN Code
              </label>
              <input
                id="pinCode"
                type="text"
                placeholder="Enter your PIN code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {formErrors.pinCode && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.pinCode}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="alternativePhoneNo"
                className="block text-sm font-medium text-gray-700"
              >
                Alternative Phone No (Optional)
              </label>
              <div className="mt-1">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="IN"
                  value={alternativePhoneNo}
                  onChange={setAlternativePhoneNo}
                  className="w-full flex rounded-md border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              {formErrors.alternativePhoneNo && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.alternativePhoneNo}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender (Optional)
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {!isGoogleLogin && (
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 text-sm text-gray-900 shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />

                {previewUrl && (
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-300">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onClick={togglePreview}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {showPreview ? "Hide Preview" : "View Full Size"}
                    </button>
                  </div>
                )}

                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">
                      Upload Progress: {uploadProgress}%
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Store Information Section */}
          <div className="md:col-span-2 mt-6">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Store Information
            </h3>
          </div>
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700"
            >
              Store Name*
            </label>
            <input
              id="storeName"
              type="text"
              placeholder="Enter your store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="storeDescription"
              className="block text-sm font-medium text-gray-700"
            >
              Store Description (Optional)
            </label>
            <textarea
              id="storeDescription"
              placeholder="Tell us about your store and what you sell"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 bg-white py-3 px-4 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {/* Confirmation Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmation"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="confirmation"
              className="ml-2 block text-sm text-gray-900"
            >
              I confirm that the details provided are correct.
            </label>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading || !isConfirmed}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 via-purple-400 to-indigo-500 py-3 px-4 text-sm font-medium text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Verify"}
            </button>
          </div>
        </form>
      </div>

      {/* Image Preview Modal */}
      {showPreview && previewUrl && (
        <div
          className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 shadow-2xl"
          onClick={togglePreview}
        >
          <div
            className="relative shadow-2xl bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={togglePreview}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="mt-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto max-h-[70vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifySellerProfilePage;
