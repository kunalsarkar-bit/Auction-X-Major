const express = require("express");
// const {
//   getProfilePicByEmail,
//   verifyNormalUser,
//   updateAmount,
//   getAmount,
//   CheckUser,
//   getUserByEmail,
//   updateUserProfile,
//   Login,
//   Logout,
//   register,
//   updateGProfile,
//   updateProfile,
//   sendOtp,
//   getOtp,
//   resendOtp,
//   verifyOtp,
//   uploadProfilePicture,
//   updateUserProfileImage,
//   resetProfileImage,
// } = require("../../controllers/LoginControllers/AuthController.js");

const {
  getProfilePicByEmail,
  getUserByEmail,
  updateUserProfile,
  uploadProfilePicture,
  updateUserProfileImage,
  resetProfileImage,
} = require("../../controllers/LoginControllers/UserLoginController/UserProfileController.js");

const {
  Login,
  Logout,
  register,
  changePassword,
} = require("../../controllers/LoginControllers/UserLoginController/UserLoginController.js");

const {
  updateAmount,
  getAmount,
  getAmountbyEmail
} = require("../../controllers/LoginControllers/UserLoginController/UserPaymentController.js");

const {
  verifyNormalUser,
  CheckUser,
  updateGProfile,
  updateProfile,
  sendOtp,
  getOtp,
  resendOtp,
  verifyOtp,
  checkAuth,
  checkAdminByEmail,
} = require("../../controllers/LoginControllers/UserLoginController/UserVerificationController.js");

const {
  IsUser,
  IsGUser,
  checkUserByEmail,
  updatePassword,
} = require("../../middleware/LoginMiddleware/authOtherMiddlewares.js");

const AuthRoutes = express.Router();
//-------------------------Testing---------------------------//
const loginLimiter = require("../../middleware/Security/RateLimiter.js");
// const upload = require("../../middleware/LoginMiddleware/ProfilePhotoUpload.js");
const handleImageUploads = require("../../middleware/Media/ImageUpload.js");
const authUserMiddleware = require("../../middleware/LoginMiddleware/authUserMiddleware.js");
const authAdminMiddleware = require("../../middleware/LoginMiddleware/authAdminMiddleware.js");
const passport = require("passport");
const {
  handleGoogleCallback,
} = require("../../controllers/LoginControllers/UserLoginController/UserGoogleLoginController.js");

//-------------------LOGIN-CRUD------------------//

AuthRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleCallback
);

// POST endpoint to create a account
AuthRoutes.post("/register", loginLimiter, register);

// POST endpoint to login into a account
// AuthRoutes.post("/login", loginLimiter, Login);
AuthRoutes.post("/login", loginLimiter, Login);

// POST endpoint to logout from a account
AuthRoutes.post("/logout", authUserMiddleware, Logout);

// POST endpoint to check a account by EMAIL
AuthRoutes.post("/check-user", checkUserByEmail, (req, res) => {
  return res.status(200).json({ message: "User found", user: req.user });
});

AuthRoutes.get("/check", checkAuth);

// POST endpoint to send OTP
AuthRoutes.post("/send-otp", loginLimiter, sendOtp);
AuthRoutes.post("/verify-otp", loginLimiter, verifyOtp);

// POST endpoint to resend OTP
AuthRoutes.post("/resend-otp", loginLimiter, resendOtp);

//Admin Routes -----------------------------------------------------
AuthRoutes.post("/check-admin", checkAdminByEmail);
AuthRoutes.put("/change-password", authAdminMiddleware, changePassword);
//------------------------------------------------------------------

// GET endpoint to check a valid user
AuthRoutes.get("/checkUser", IsUser, CheckUser);

// GET endpoint to get a OTP by EMAIL
AuthRoutes.get("/get-otp/:email", loginLimiter, getOtp);

// GET endpoint to get a user by EMAIL
AuthRoutes.get("/user/:email", getUserByEmail);

// GET endpoint to get a user profile picture by EMAIL
AuthRoutes.get("/profile-pic", authUserMiddleware, getProfilePicByEmail);

// PATCH endpoint to update user profile (GOOGLE SIGN IN)
AuthRoutes.patch("/updateGProfile", IsGUser, loginLimiter, updateGProfile);

// PATCH endpoint to update user profile (NORMAL SIGN IN)
AuthRoutes.patch("/updateProfile", IsUser, loginLimiter, updateProfile);

//PATCH endpoint to update user password by email
AuthRoutes.patch("/update-password", checkUserByEmail, updatePassword);

//PATCH endpoint to update user profile by email
AuthRoutes.patch(
  "/updateUserProfile/:email",
  authUserMiddleware,
  updateUserProfile
);

// Update the upload-profile-pic route
AuthRoutes.post(
  "/upload-profile-pic",
  authUserMiddleware,
  handleImageUploads([
    {
      name: "profilePic", // Must match frontend field name
      folder: "Auction X/Components/Profile", // Your Cloudinary folder
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
      ],
    },
  ]),
  uploadProfilePicture
);

AuthRoutes.patch(
  "/updateUserProfileImage/:email",
  authUserMiddleware,
  updateUserProfileImage
);

AuthRoutes.patch(
  "/resetProfileImage/:email",
  authUserMiddleware,
  resetProfileImage
);

//PATCH endpoint to verify user by email
AuthRoutes.patch("/verify-user", verifyNormalUser);

//-------------------MONEY-CRUD------------------//

// GET get user amount details
AuthRoutes.get("/get-amount", authUserMiddleware, getAmount);
AuthRoutes.get("/get-amount-by-email/:email", authUserMiddleware, getAmountbyEmail);

// PATCH update user amount
AuthRoutes.patch("/update-amount", authUserMiddleware, updateAmount);

module.exports = AuthRoutes;
