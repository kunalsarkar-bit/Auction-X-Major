import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser, updateVerification } from "../../../redux/slices/authSlice"; // Import updateVerification action
const API_URL = import.meta.env.VITE_API_URL;

//----------------------TESTING-----------------------//
import { fetchCsrfToken } from "../../../redux/slices/csrfSecuritySlice";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { email, from } = location.state || {};
  const role = useSelector((state) => state.auth.role);

  // Get auth state from Redux
  const auth = useSelector((state) => state.auth);

  //------------------------------------testing-----------------------------------//
  const { token: csrfToken, loading } = useSelector((state) => state.csrf);

  // Fetch CSRF token only when it's missing and not already loading
  useEffect(() => {
    if (!csrfToken && !loading) {
      dispatch(fetchCsrfToken());
    }
  }, [dispatch, csrfToken, loading]);

  useEffect(() => {
    // Check if email is available
    if (!email) {
      setErrorMessage("Email is missing. Please try again.");
      return;
    }

    // Initialize timer for OTP resend
    startResendTimer();
  }, [email]);

  // Start timer for resend button
  const startResendTimer = () => {
    setTimer(30);
    setIsResendDisabled(true);

    let interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  // Handle OTP input change
  const handleChange = (element, index) => {
    const value = element.value;

    // Allow only numeric input (0-9)
    if (!/^\d*$/.test(value)) {
      return;
    }

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field
    if (element.nextSibling && value !== "") {
      element.nextSibling.focus();
    }
  };

  // Handle backspace key press
  const handleKeyDown = (e, index) => {
    let newOtp = [...otp];
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        if (index > 0) {
          newOtp[index - 1] = "";
          setOtp(newOtp);
          document.getElementById(`otp-${index - 1}`).focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Verify OTP with the backend
  const verifyOTP = async (enteredOtp) => {
    setIsSubmitting(true);

    if (!csrfToken) {
      console.error("CSRF token not available yet");
      return;
    }

    try {
      const numericOtp = parseInt(enteredOtp, 10);

      // ✅ Determine endpoint based on role
      const endpoint =
        role === "seller"
          ? `${API_URL}/api/auth/seller/verify-otp`
          : `${API_URL}/api/auth/user/verify-otp`;

      const response = await axios.post(
        endpoint,
        {
          email: email,
          otp: numericOtp,
        },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
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

  // Send OTP email function
  const sendOTPEmail = async (email) => {
    setIsSubmitting(true);
    setErrorMessage(""); // Clear previous error messages

    try {
      // ✅ Step 1: Determine the correct check and send endpoints
      const checkEndpoint =
        role === "seller"
          ? `${API_URL}/api/auth/seller/check-user`
          : `${API_URL}/api/auth/user/check-user`;

      const sendOtpEndpoint =
        role === "seller"
          ? `${API_URL}/api/auth/seller/send-otp`
          : `${API_URL}/api/auth/user/send-otp`;

      // ✅ Step 2: Check if the user/seller exists
      const response = await axios.post(
        checkEndpoint,
        { email },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200 && response.data.user) {
        toast.success("User found, sending OTP...");

        // ✅ Step 3: Send OTP to verified user/seller
        await axios.post(
          sendOtpEndpoint,
          { email },
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );

        setMessage({ type: "success", text: `OTP sent to ${email}` });
        return true;
      }
    } catch (error) {
      console.error("Error during user check:", error);

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

  // Handle OTP verification button click
  const handleVerifyOtp = async () => {
    setErrorMessage("");

    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    // ✅ Call role-aware OTP verification
    const isVerified = await verifyOTP(enteredOtp); // You already made verifyOTP role-aware

    if (isVerified) {
      toast.success("Verification Successful");

      if (from === "forgetPassword") {
        navigate("/resetpassword", { state: { email } });
      } else if (from === "verifyProfile") {
        try {
          // ✅ Determine patch URL based on role
          const patchUrl =
            role === "seller"
              ? `${API_URL}/api/auth/seller/verify-user`
              : `${API_URL}/api/auth/verify-user`;

          const response = await axios.patch(
            patchUrl,
            { email },
            {
              headers: { "X-CSRF-Token": csrfToken },
              withCredentials: true,
            }
          );

          if (response.data && response.data.user) {
            dispatch(setUser(response.data.user));
            dispatch(updateVerification(true));
            toast.success("Account verified successfully!");
          }

          navigate("/", { replace: true });
        } catch (error) {
          console.error("Error verifying user:", error);
          toast.error("Failed to update verification status.");
        }
      } else {
        dispatch(updateVerification(true));
        navigate("/", { replace: true });
      }
    }
  };

  // Handle OTP resend using the sendOTPEmail function
  const handleResendOtp = async () => {
    setOtp(new Array(6).fill(""));

    // Call the sendOTPEmail function
    const success = await sendOTPEmail(email);

    if (success) {
      toast.success(`New OTP sent to ${email}`);
      startResendTimer(); // Restart the timer
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white rounded-3xl shadow-lg p-8 text-center w-[500px]">
        <h3 className="text-2xl font-bold mb-5">Enter OTP</h3>

        {/* Display messages */}
        {message.text && (
          <div
            className={`mb-4 p-2 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <div className="flex justify-between mb-5">
          {otp.map((data, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              className="w-10 h-12 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 no-spinners"
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={(e) => e.target.select()}
              disabled={isSubmitting}
            />
          ))}
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleVerifyOtp}
            className="bg-gradient-to-r from-[#7e22ce] via-[#a855f7] to-[#6366f1] text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Verifying..." : "VERIFY OTP"}
          </button>
          <button
            onClick={handleResendOtp}
            disabled={isResendDisabled || isSubmitting}
            className={`bg-black text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-shadow text-sm ${
              isResendDisabled || isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-800"
            }`}
          >
            {isSubmitting ? "Sending..." : "RESEND OTP"}
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-3">
          {timer > 0
            ? `You can resend OTP after ${timer} seconds`
            : "You can now resend the OTP"}
        </p>
      </div>

      {/* Custom CSS to hide number input arrows */}
      <style>
        {`
          .no-spinners::-webkit-inner-spin-button,
          .no-spinners::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .no-spinners {
            -moz-appearance: textfield; /* Firefox */
          }
        `}
      </style>
    </div>
  );
};

export default OtpVerification;
