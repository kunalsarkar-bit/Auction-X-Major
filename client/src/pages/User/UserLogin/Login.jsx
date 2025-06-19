import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faTwitter,
  faGoogle,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications
import logImage from "../../../assets/images/Pages/Login/log.svg";
import registerImage from "../../../assets/images/Pages/Login/register.svg";
import {
  setUser,
  setSeller,
  setLoginType,
} from "../../../redux/slices/authSlice";
import authService from "../../../services/authService";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // UI State
  const [isSignUpMode, setSignUpMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleToggle = () => {
    setSignUpMode(!isSignUpMode);
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  const handlePageFlip = () => {
    setIsFlipped(!isFlipped);
    setFormData({ name: "", email: "", password: "" });
    setError("");
    setSuccess("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fix for handleSubmit function in Login component
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Handle Sign Up
      if (isSignUpMode) {
        const { name, email, password } = formData;

        if (!name || !email || !password) {
          throw new Error("All fields are required");
        }

        const response = await authService.userRegister({
          name,
          email,
          password,
        });

        // Set user in Redux state
        dispatch(setUser(response.newUser));
        dispatch(setLoginType("normal"));

        // Navigate to verification or dashboard
        if (!response.newUser.verified) {
          navigate("/verifyprofile");
          return; // ✅ IMPORTANT: Stop execution here
        } else {
          navigate("/");
          toast.success("Registration successful!");
          return; // ✅ IMPORTANT: Stop execution here
        }
      }
      // Handle Sign In
      else {
        const { email, password } = formData;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const response = await authService.userLogin(email, password);

        // Set user in Redux state
        dispatch(setUser(response.user));
        dispatch(setLoginType("normal"));

        // Navigate based on user status
        if (!response.user.verified) {
          navigate("/verifyprofile");
        } else {
          // Only navigate to home/dashboard if user is verified
          navigate(response.user.role === "admin" ? "/admin/dashboard" : "/");
          toast.success("Login successful!");
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fix for handleSellerSubmit function
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Handle Sign Up
      if (isSignUpMode) {
        const { name, email, password } = formData;

        if (!name || !email || !password) {
          throw new Error("All fields are required");
        }

        const response = await authService.sellerRegister({
          name,
          email,
          password,
        });

        dispatch(setSeller(response.newUser));
        dispatch(setLoginType("normal"));

        if (!response.newUser.verified && !response.newUser.isVerified) {
          navigate("/verifysellerprofile");
          return; // ✅ IMPORTANT: Stop execution here
        } else {
          navigate("/seller/dashboard");
          toast.success("Registration successful!");
          return; // ✅ IMPORTANT: Stop execution here
        }
      }
      // Handle Sign In
      else {
        const { email, password } = formData;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const response = await authService.sellerLogin(email, password);

        if (response.user.role === "seller") {
          dispatch(setSeller(response.user));
        } else {
          dispatch(setUser(response.user));
        }

        dispatch(setLoginType("normal"));

        if (!response.user.verified && !response.user.isVerified) {
          navigate("/verifysellerprofile");
          return; // ✅ IMPORTANT: Stop execution here
        }

        // Only navigate to home/dashboard if user is verified
        navigate(
          response.user.role === "admin"
            ? "/admin/dashboard"
            : "/seller/dashboard"
        );
        toast.success("Login successful!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    dispatch(setLoginType("google"));
    authService.userGoogleLogin();
  };

  // Handle Google auth callback
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      // Check if we have Google auth parameters in the URL
      if (urlParams.has("email")) {
        const name = urlParams.get("name");
        const email = urlParams.get("email");
        const profilePic = urlParams.get("profilePic");
        const isNewUser = urlParams.get("isNewUser") === "true";
        const role = urlParams.get("role");
        const verified = urlParams.get("verified") === "true";

        // Set user data in Redux state
        dispatch(
          setUser({
            name,
            email,
            role,
            profilePic: profilePic ? JSON.parse(profilePic) : null,
            verified,
          })
        );
        dispatch(setLoginType("google"));

        // Navigate based on user status
        if (isNewUser || !verified) {
          navigate("/verifyprofile");
        } else {
          navigate(role === "admin" ? "/admin/dashboard" : "/");
          toast.success("Google login successful!");
        }
      }
    };

    // Check for Google auth parameters in URL
    if (window.location.search.includes("email=")) {
      handleGoogleCallback();
    }
  }, [dispatch, navigate]);

  return (
    <>
       <style>
        {`
          /* Add this CSS for the upper toggle switch */
          .upper-toggle-switch {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10;
          }

          .upper-toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .upper-slider {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            background-color: rgba(255, 255, 255, 0.3);
            transition: 0.4s;
            border-radius: 34px;
            cursor: pointer;
            backdrop-filter: blur(10px);
          }

          .upper-slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          }

          input:checked + .upper-slider {
            background: linear-gradient(45deg, #A259FF, #C471ED);
          }

          input:checked + .upper-slider:before {
            transform: translateX(26px);
          }

          /* Add this CSS for the flip effect */
          .flip-container {
            perspective: 1000px;
            width: 100%;
            height: 100vh;
            position: relative;
          }

          .flip-container.flipped .flipper {
            transform: rotateY(180deg);
          }

          .flipper {
            transition: 0.6s;
            transform-style: preserve-3d;
            position: relative;
            width: 100%;
            height: 100%;
          }

          .front, .back {
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .front {
            z-index: 2;
            transform: rotateY(0deg);
          }

          .back {
            transform: rotateY(180deg);
          }

          /* Rest of your existing CSS with Sunset Gradient Theme */
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800&display=swap");

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body, html {
            height: 100%;
            overflow: hidden;
            font-family: "Poppins", sans-serif;
          }

          .container-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #6C63FF 0%, #C471ED 50%, #FF9068 100%);
            position: relative;
          }

          .container-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(108, 99, 255, 0.1), rgba(196, 113, 237, 0.1), rgba(255, 144, 104, 0.1));
            animation: gradientShift 8s ease-in-out infinite;
          }

          @keyframes gradientShift {
            0%, 100% { opacity: 0.1; }
            50% { opacity: 0.3; }
          }

          .container {
            position: relative;
            width: 750px;
            height: 450px;
            background-color: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(108, 99, 255, 0.3), 0 15px 25px rgba(196, 113, 237, 0.2);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          .forms-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          }

          .signin-signup {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            left: 75%;
            width: 50%;
            transition: 1s 0.7s ease-in-out;
            display: grid;
            grid-template-columns: 1fr;
            z-index: 5;
          }

          form {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 2rem;
            transition: all 0.2s 0.7s;
            overflow: hidden;
            grid-column: 1 / 2;
            grid-row: 1 / 2;
          }

          form.sign-up-form {
            opacity: 0;
            z-index: 1;
          }

          form.sign-in-form {
            z-index: 2;
          }

          .title {
            font-size: 2rem;
            color: #444;
            margin-bottom: 10px;
            font-weight: 600;
            background: linear-gradient(45deg, #6C63FF, #C471ED);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .input-field {
            max-width: 320px;
            width: 100%;
            background-color: rgba(245, 245, 245, 0.8);
            backdrop-filter: blur(10px);
            margin: 8px 0;
            height: 45px;
            border-radius: 45px;
            display: grid;
            grid-template-columns: 15% 85%;
            padding: 0 0.4rem;
            position: relative;
            border: 1px solid rgba(196, 113, 237, 0.2);
            transition: all 0.3s ease;
          }

          .input-field:focus-within {
            border-color: #C471ED;
            box-shadow: 0 0 0 3px rgba(196, 113, 237, 0.1);
            background-color: rgba(255, 255, 255, 0.9);
          }

          .input-field i {
            text-align: center;
            line-height: 45px;
            color: #A259FF;
            transition: 0.5s;
            font-size: 1rem;
          }

          .input-field input {
            background: none;
            outline: none;
            border: none;
            line-height: 1;
            font-weight: 600;
            font-size: 1rem;
            color: #333;
          }

          .input-field input::placeholder {
            color: #aaa;
            font-weight: 500;
          }

          .social-text {
            padding: 0.5rem 0;
            font-size: 0.9rem;
            color: #666;
          }

          .social-media {
            display: flex;
            justify-content: center;
          }

          .social-icon {
            height: 40px;
            width: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 0.35rem;
            color: #A259FF;
            border-radius: 50%;
            border: 1px solid #A259FF;
            text-decoration: none;
            font-size: 1rem;
            transition: 0.3s;
            backdrop-filter: blur(10px);
          }

          .social-icon:hover {
            background: linear-gradient(45deg, #6C63FF, #C471ED);
            color: white;
            border-color: transparent;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
          }

          .btn {
            width: 130px;
            background: linear-gradient(45deg, #6C63FF, #C471ED, #FF9068);
            border: none;
            outline: none;
            height: 40px;
            border-radius: 40px;
            color: #fff;
            text-transform: uppercase;
            font-weight: 600;
            margin: 8px 0;
            cursor: pointer;
            transition: 0.5s;
            position: relative;
            overflow: hidden;
          }

          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
          }

          .btn:hover::before {
            left: 100%;
          }

          .btn:hover {
            background: linear-gradient(45deg, #5a54e6, #b863d4, #e6805a);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(108, 99, 255, 0.4);
          }

          .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .panels-container {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0;
            left: 0;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }

          .container:before {
            content: "";
            position: absolute;
            height: 2000px;
            width: 2000px;
            top: -10%;
            right: 48%;
            transform: translateY(-50%);
            background: linear-gradient(-45deg, #6C63FF 0%, #C471ED 50%, #FF9068 100%);
            transition: 1.8s ease-in-out;
            border-radius: 50%;
            z-index: 6;
          }

          .image {
            width: 100%;
            transition: transform 1.1s ease-in-out;
            transition-delay: 0.4s;
            filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
          }

          .panel {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-around;
            text-align: center;
            z-index: 6;
          }

          .left-panel {
            pointer-events: all;
            padding: 2rem 12% 2rem 8%;
          }

          .right-panel {
            pointer-events: none;
            padding: 3rem 12% 2rem 17%;
          }

          .panel .content {
            color: #fff;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.6s;
          }

          .panel h3 {
            font-weight: 600;
            line-height: 1;
            font-size: 1.5rem;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .panel p {
            font-size: 0.95rem;
            padding: 0.7rem 0;
            opacity: 0.9;
          }

          .btn.transparent {
            margin: 0;
            background: none;
            border: 2px solid #fff;
            width: 130px;
            height: 41px;
            font-weight: 600;
            font-size: 0.8rem;
            backdrop-filter: blur(10px);
          }

          .btn.transparent:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
          }

          .right-panel .image,
          .right-panel .content {
            transform: translateX(800px);
          }

          .login-icons {
            margin-top: 14px;
          }

          /* ANIMATION */

          .container.sign-up-mode:before {
            transform: translate(100%, -50%);
            right: 52%;
          }

          .container.sign-up-mode .left-panel .image,
          .container.sign-up-mode .left-panel .content {
            transform: translateX(-800px);
          }

          .container.sign-up-mode .signin-signup {
            left: 25%;
          }

          .container.sign-up-mode form.sign-up-form {
            opacity: 1;
            z-index: 2;
          }

          .container.sign-up-mode form.sign-in-form {
            opacity: 0;
            z-index: 1;
          }

          .container.sign-up-mode .right-panel .image,
          .container.sign-up-mode .right-panel .content {
            transform: translateX(0%);
          }

          .container.sign-up-mode .left-panel {
            pointer-events: none;
          }

          .container.sign-up-mode .right-panel {
            pointer-events: all;
          }

          @media (max-width: 870px) {
            .container {
              width: 100%;
              height: 100%;
              border-radius: 0;
              box-shadow: none;
            }

            .signin-signup {
              width: 100%;
              top: 95%;
              transform: translate(-50%, -100%);
              transition: 1s 0.8s ease-in-out;
            }

            .signin-signup,
            .container.sign-up-mode .signin-signup {
              left: 50%;
            }

            .panels-container {
              grid-template-columns: 1fr;
              grid-template-rows: 1fr 2fr 1fr;
            }

            .panel {
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
              padding: 2.5rem 8%;
              grid-column: 1 / 2;
            }

            .right-panel {
              grid-row: 3 / 4;
            }

            .left-panel {
              grid-row: 1 / 2;
            }

            .image {
              width: 200px;
              transition: transform 0.9s ease-in-out;
              transition-delay: 0.6s;
            }

            .panel .content {
              padding-right: 15%;
              transition: transform 0.9s ease-in-out;
              transition-delay: 0.8s;
            }

            .panel h3 {
              font-size: 1.2rem;
            }

            .panel p {
              font-size: 0.7rem;
              padding: 0.5rem 0;
            }

            .btn.transparent {
              width: 110px;
              height: 35px;
              font-size: 0.7rem;
            }

            .container:before {
              width: 1500px;
              height: 1500px;
              transform: translateX(-50%);
              left: 30%;
              bottom: 68%;
              right: initial;
              top: initial;
              transition: 2s ease-in-out;
            }

            .container.sign-up-mode:before {
              transform: translate(-50%, 100%);
              bottom: 32%;
              right: initial;
            }

            .container.sign-up-mode .left-panel .image,
            .container.sign-up-mode .left-panel .content {
              transform: translateY(-300px);
            }

            .container.sign-up-mode .right-panel .image,
            .container.sign-up-mode .right-panel .content {
              transform: translateY(0px);
            }

            .right-panel .image,
            .right-panel .content {
              transform: translateY(300px);
            }

            .container.sign-up-mode .signin-signup {
              top: 5%;
              transform: translate(-50%, 0);
            }
          }

          @media (max-width: 570px) {
            form {
              padding: 0 1.5rem;
            }

            .image {
              display: none;
            }

            .panel .content {
              padding: 0.5rem 1rem;
            }

            .container {
              padding: 1.5rem;
            }

            .container:before {
              bottom: 72%;
              left: 50%;
            }

            .container.sign-up-mode:before {
              bottom: 28%;
              left: 50%;
            }
          }

          .message {
            margin: 10px 0;
            padding: 10px;
            border-radius: 5px;
            width: 100%;
            max-width: 320px;
            text-align: center;
            backdrop-filter: blur(10px);
          }

          .error-message {
            background-color: rgba(255, 82, 82, 0.1);
            border: 1px solid #ff5252;
            color: #d32f2f;
          }

          .success-message {
            background-color: rgba(76, 175, 80, 0.1);
            border: 1px solid #4caf50;
            color: #2e7d32;
          }

          .forgot-password {
            margin: 2px 0 2px;
            text-align: center;
            width: 100%;
            max-width: 320px;
          }

          .forgot-password a {
            color: #A259FF;
            font-size: 0.9rem;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .forgot-password a:hover {
            color: #C471ED;
            text-decoration: underline;
          }
        `}
      </style>

      {/* Upper Toggle Switch */}
      <div className="upper-toggle-switch">
        <input
          type="checkbox"
          id="upper-toggle"
          checked={isFlipped}
          onChange={handlePageFlip}
        />
        <label htmlFor="upper-toggle" className="upper-slider"></label>
      </div>

      {/* Flip Container */}
      <div className={`flip-container ${isFlipped ? "flipped" : ""}`}>
        <div className="flipper">
          {/* Front Side (User Login/Signup) */}
          <div className="front">
            <div className="container-wrapper">
              <div
                className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}
              >
                <div className="forms-container">
                  <div className="signin-signup">
                    {/* User Sign In Form */}
                    <form onSubmit={handleSubmit} className="sign-in-form">
                      <h2 className="title">Sign in</h2>

                      {error && (
                        <div className="message error-message">{error}</div>
                      )}
                      {success && (
                        <div className="message success-message">{success}</div>
                      )}

                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faEnvelope}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faLock}
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="forgot-password ">
                        <Link to="/passwordforget">Forget Password</Link>
                      </div>
                      <button
                        type="submit"
                        className="btn solid"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Login"}
                      </button>

                      <p className="social-text">
                        Or Sign in with social platforms
                      </p>
                      <div className="social-media">
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a
                          href="#"
                          className="social-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGoogleLogin();
                          }}
                        >
                          <FontAwesomeIcon icon={faGoogle} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      </div>
                    </form>

                    {/* User Sign Up Form */}
                    <form onSubmit={handleSubmit} className="sign-up-form">
                      <h2 className="title">Sign up</h2>

                      {error && (
                        <div className="message error-message">{error}</div>
                      )}
                      {success && (
                        <div className="message success-message">{success}</div>
                      )}

                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faUser}
                        />
                        <input
                          type="text"
                          name="name"
                          placeholder="Username"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faEnvelope}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faLock}
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing up..." : "Sign up"}
                      </button>
                      <p className="social-text">
                        Or Sign up with social platforms
                      </p>
                      <div className="social-media">
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a
                          href="#"
                          className="social-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGoogleLogin();
                          }}
                        >
                          <FontAwesomeIcon icon={faGoogle} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Panels Section */}
                <div className="panels-container">
                  <div className="panel left-panel">
                    <div className="content">
                      <h3>New here?</h3>
                      <p>Enter your details and start your journey with us</p>
                      <button
                        className="btn transparent"
                        onClick={handleToggle}
                        type="button"
                      >
                        Sign up
                      </button>
                    </div>
                    <img
                      src={logImage}
                      className="image"
                      alt="Login Illustration"
                    />
                  </div>

                  <div className="panel right-panel">
                    <div className="content">
                      <h3>One of us?</h3>
                      <p>
                        To keep connected with us, please log in with your
                        personal info
                      </p>
                      <button
                        className="btn transparent"
                        onClick={handleToggle}
                      >
                        Sign in
                      </button>
                    </div>
                    <img
                      src={registerImage}
                      className="image"
                      alt="Register Illustration"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Side (Seller Login/Signup) */}
          <div className="back">
            <div className="container-wrapper">
              <div
                className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}
              >
                <div className="forms-container">
                  <div className="signin-signup">
                    {/* Seller Sign In Form */}
                    <form
                      onSubmit={handleSellerSubmit}
                      className="sign-in-form"
                    >
                      <h2 className="title">Sign in (Seller)</h2>

                      {error && (
                        <div className="message error-message">{error}</div>
                      )}
                      {success && (
                        <div className="message success-message">{success}</div>
                      )}

                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faEnvelope}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faLock}
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="forgot-password ">
                        <Link to="/passwordforget">Forget Password</Link>
                      </div>
                      <button
                        type="submit"
                        className="btn solid"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Logging in..." : "Login"}
                      </button>
                      <p className="social-text">
                        Or Sign in with social platforms
                      </p>
                      <div className="social-media">
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a
                          href="#"
                          className="social-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGoogleLogin();
                          }}
                        >
                          <FontAwesomeIcon icon={faGoogle} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      </div>
                    </form>

                    {/* Seller Sign Up Form */}
                    <form
                      onSubmit={handleSellerSubmit}
                      className="sign-up-form"
                    >
                      <h2 className="title">Sign up (Seller)</h2>

                      {error && (
                        <div className="message error-message">{error}</div>
                      )}
                      {success && (
                        <div className="message success-message">{success}</div>
                      )}

                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faUser}
                        />
                        <input
                          type="text"
                          name="name"
                          placeholder="Username"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faEnvelope}
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="input-field">
                        <FontAwesomeIcon
                          className="login-icons"
                          icon={faLock}
                        />
                        <input
                          type="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Signing up..." : "Sign up"}
                      </button>
                      <p className="social-text">
                        Or Sign up with social platforms
                      </p>
                      <div className="social-media">
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faFacebookF} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a
                          href="#"
                          className="social-icon"
                          onClick={(e) => {
                            e.preventDefault();
                            handleGoogleLogin();
                          }}
                        >
                          <FontAwesomeIcon icon={faGoogle} />
                        </a>
                        <a href="#" className="social-icon">
                          <FontAwesomeIcon icon={faLinkedinIn} />
                        </a>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Panels Section for Seller Side */}
                <div className="panels-container">
                  <div className="panel left-panel">
                    <div className="content">
                      <h3>New here?</h3>
                      <p>Enter your details and become a seller</p>
                      <button
                        className="btn transparent"
                        onClick={handleToggle}
                        type="button"
                      >
                        Sign up
                      </button>
                    </div>
                    <img
                      src={logImage}
                      className="image"
                      alt="Login Illustration"
                    />
                  </div>

                  <div className="panel right-panel">
                    <div className="content">
                      <h3>Already a seller?</h3>
                      <p>
                        To keep connected with us, please log in with your
                        seller account
                      </p>
                      <button
                        className="btn transparent"
                        onClick={handleToggle}
                        type="button"
                      >
                        Sign in
                      </button>
                    </div>
                    <img
                      src={registerImage}
                      className="image"
                      alt="Register Illustration"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
