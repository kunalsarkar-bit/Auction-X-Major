import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
const API_URL = import.meta.env.VITE_API_URL;
//----------------------TESTING-----------------------//
import { fetchCsrfToken } from "../../../redux/slices/csrfSecuritySlice";

// Main component that controls the flow between different steps
const PasswordResetFlow = () => {
  const [currentStep, setCurrentStep] = useState("forgotPassword");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [error, setError] = useState(""); // Added for handling errors

  //------------------------------------testing-----------------------------------//
  const dispatch = useDispatch();

  const { token: csrfToken, loading } = useSelector((state) => state.csrf);

  // Fetch CSRF token only when it's missing and not already loading
  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);
  // Generate a random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Simulate sending OTP email
  const sendOTPEmail = async (email) => {
    setIsSubmitting(true);
    setError(""); // Clear previous error messages

    try {
      // Step 1: Check if the user exists
      const response = await axios.post(
        `${API_URL}/api/auth/user/check-user`,
        { email },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        } // Ensure cookies are sent
      );

      if (response.status === 200 && response.data.user) {
        // Step 2: If user exists, send OTP
        toast.success("User found, sending OTP...");
        await axios.post(
          `${API_URL}/api/auth/user/send-otp`,
          {
            email,
          },
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          } // Ensure cookies are sent
        );

        // Set success message
        setMessage({ type: "success", text: `OTP sent to ${email}` });

        // Move to next step (instead of navigate in your original code)
        setCurrentStep("verifyOtp");
        return true;
      }
    } catch (error) {
      // Handle errors, such as user not found or other issues
      console.error("Error during user check:", error); // Debug log

      if (error.response) {
        if (error.response.status === 404) {
          setMessage({
            type: "error",
            text: "User not found. Please check your email.",
          });
        } else {
          setMessage({
            type: "error",
            text: "An error occurred. Please try again.",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "Network error. Please check your connection.",
        });
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simulate verifying OTP
  // Modify the existing verifyOTP function to use your API
  const verifyOTP = async (enteredOtp) => {
    setIsSubmitting(true);

    try {
      // Convert enteredOtp to number before sending (if needed)
      const numericOtp = parseInt(enteredOtp, 10);

      // Call your API endpoint for OTP verification
      const response = await axios.post(
        `${API_URL}/api/auth/user/verify-otp`,
        {
          email: email,
          otp: numericOtp, // Send as number
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        } // Ensure cookies are sent
      );

      if (response.status === 200) {
        setMessage({ type: "success", text: "OTP verified successfully" });
        return true;
      } else {
        setMessage({
          type: "error",
          text: "Verification failed. Please try again.",
        });
        return false;
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);

      if (error.response) {
        // Log the full error response for debugging
        console.log("Error response data:", error.response.data);

        if (error.response.status === 404) {
          setMessage({
            type: "error",
            text: "OTP not found or expired. Please request a new one.",
          });
        } else if (error.response.status === 400) {
          setMessage({
            type: "error",
            text: "Invalid OTP. Please check and try again.",
          });
        } else {
          setMessage({
            type: "error",
            text:
              error.response.data.message ||
              "Verification failed. Please try again.",
          });
        }
      } else {
        setMessage({
          type: "error",
          text: "Network error. Please check your connection.",
        });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset password with API integration
  const resetPassword = async (newPass) => {
    setIsSubmitting(true);

    try {
      // Call the API to update password
      const response = await axios.patch(
        `${API_URL}/api/auth/user/update-password`,
        {
          email: email,
          newPassword: newPass,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        } // Ensure cookies are sent
      );

      if (
        response.status === 200 &&
        response.data.message === "Password updated successfully"
      ) {
        setMessage({ type: "success", text: "Password reset successfully!" });
        toast.success("Password has been successfully reset");
        return true;
      } else {
        setMessage({
          type: "error",
          text: "Failed to reset password. Please try again.",
        });
        toast.error("Password reset failed");
        return false;
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage({
        type: "error",
        text: "An error occurred while resetting the password. Please try again.",
      });
      toast.error(
        "An error occurred while resetting the password. Please try again."
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render the appropriate step based on currentStep
  const renderStep = () => {
    switch (currentStep) {
      case "forgotPassword":
        return (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            isSubmitting={isSubmitting}
            message={message}
            setMessage={setMessage}
            onSubmit={async (e) => {
              e.preventDefault();
              await sendOTPEmail(email);
              // Note: The navigation to the next step is now handled in sendOTPEmail
            }}
          />
        );

      case "verifyOtp":
        return (
          <OtpVerificationForm
            email={email}
            isSubmitting={isSubmitting}
            message={message}
            setMessage={setMessage}
            onSubmit={async (e) => {
              e.preventDefault();
              const enteredOtp = e.target.otp.value;
              const success = await verifyOTP(enteredOtp);
              if (success) {
                setCurrentStep("resetPassword");
              }
            }}
            onResendOtp={async () => {
              await sendOTPEmail(email);
            }}
            onBackToForgotPassword={() => {
              setCurrentStep("forgotPassword");
              setMessage({ type: "", text: "" });
            }}
          />
        );

      case "resetPassword":
        return (
          <ResetPasswordForm
            email={email}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isSubmitting={isSubmitting}
            message={message}
            setMessage={setMessage}
            onSubmit={async (e) => {
              e.preventDefault();
              if (newPassword !== confirmPassword) {
                setMessage({ type: "error", text: "Passwords do not match" });
                toast.error("Passwords do not match");
                return;
              }

              const success = await resetPassword(newPassword);
              if (success) {
                // In a real app, you might redirect to login page after a delay
                setTimeout(() => {
                  // In a real app with react-router, this would be navigate("/login")
                  // For this component, we'll just reset the flow
                  setCurrentStep("forgotPassword");
                  setEmail("");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage({ type: "", text: "" });
                }, 1500);
              }
            }}
          />
        );

      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          {/* Logo */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
        </div>

        {/* Render current step */}
        {renderStep()}
      </div>
    </div>
  );
};

// Step 1: Forgot Password Form
const ForgotPasswordForm = ({
  email,
  setEmail,
  isSubmitting,
  message,
  setMessage,
  onSubmit,
}) => {
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Forgot Your Password?
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Enter your email address below and we'll send you a verification code to
        reset your password.
      </p>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              email && !isValidEmail(email)
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter your email"
            required
          />
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !isValidEmail(email)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-300"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Verification Code"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="/login"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

// Step 2: OTP Verification Form
const OtpVerificationForm = ({
  email,
  isSubmitting,
  message,
  setMessage,
  onSubmit,
  onResendOtp,
  onBackToForgotPassword,
}) => {
  // Handle OTP input to only allow numeric values
  const handleOtpInput = (e) => {
    // Replace any non-numeric characters with an empty string
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Verify Your Email
      </h1>
      <p className="text-gray-600 mb-2 text-center">
        We've sent a verification code to
      </p>
      <p className="text-blue-600 font-medium mb-6 text-center">{email}</p>

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-gray-700 font-medium mb-2">
            Enter Verification Code
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
            placeholder="Enter 6-digit code"
            maxLength="6"
            pattern="[0-9]{6}"
            onInput={handleOtpInput}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-300"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Didn't receive the code?{" "}
          <button
            onClick={onResendOtp}
            disabled={isSubmitting}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Resend
          </button>
        </p>
        <button
          onClick={onBackToForgotPassword}
          className="text-blue-500 hover:text-blue-700 font-medium mt-2"
        >
          Change Email
        </button>
      </div>
    </div>
  );
};

// Step 3: Reset Password Form
// Step 3: Reset Password Form
const ResetPasswordForm = ({
  email,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isSubmitting,
  message,
  setMessage,
  onSubmit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (!password) return "";

    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    const strength = [
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isLongEnough,
    ].filter(Boolean).length;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-200";
    }
  };

  // Fixed handleSubmit that uses the props correctly
  const handleSubmit = (e) => {
    e.preventDefault();

    // Don't proceed if already submitting
    if (isSubmitting) {
      return;
    }

    // Validate the new password and confirm password
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    // Call the onSubmit prop that was passed from the parent
    if (typeof onSubmit === "function") {
      onSubmit(e);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        Reset Your Password
      </h1>
      <p className="text-gray-600 mb-6 text-center">
        Please create a new password for your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create new password"
              minLength="8"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center mb-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getStrengthColor()} h-2 rounded-full transition-all duration-300`}
                    style={{
                      width:
                        passwordStrength === "weak"
                          ? "33%"
                          : passwordStrength === "medium"
                          ? "66%"
                          : "100%",
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-xs capitalize text-gray-600">
                  {passwordStrength}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Use 8+ characters with a mix of uppercase, lowercase, numbers,
                and symbols
              </p>
            </div>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              confirmPassword && confirmPassword !== newPassword
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Confirm new password"
            required
          />
          {confirmPassword && confirmPassword !== newPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
          )}
        </div>

        {message.text && (
          <div
            className={`p-3 rounded-md mb-4 ${
              message.type === "error"
                ? "bg-red-100 text-red-800 border border-red-200"
                : "bg-green-100 text-green-800 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:bg-blue-300"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default PasswordResetFlow;
