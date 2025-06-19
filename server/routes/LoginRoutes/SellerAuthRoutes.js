// const express = require("express");
// const router = express.Router();
// // const sellerController = require("../../controllers/LoginControllers/sellerController");
// const SellerLoginController = require("../../controllers/LoginControllers/SellerLoginController/Others/SellerLoginController");
// const SellerProfileController = require("../../controllers/LoginControllers/SellerLoginController/Others/SellerProfileController");
// const SellerVerificationController = require("../../controllers/LoginControllers/SellerLoginController/Others/SellerVerificationController");

// const {
//   protectSellerRoute,
// } = require("../../middleware/LoginMiddleware/authMiddleware");

// // Public routes
// router.post("/register", SellerLoginController.register);
// router.post("/login", SellerLoginController.login);
// // router.get("/verify/:token", SellerVerificationController.verifyEmail);
// router.patch(
//   "/update-profile",
//   SellerVerificationController.updateSellerProfile
// );
// // router.post('/forgot-password', sellerController.forgotPassword);
// // router.post('/reset-password/:token', sellerController.resetPassword);
// router.post("/logout", SellerLoginController.logout);

// // Protected routes
// router.get(
//   "/profile",
//   protectSellerRoute,
//   SellerVerificationController.getProfile
// );
// router.put(
//   "/profile",
//   protectSellerRoute,
//   SellerProfileController.updateProfile
// );
// router.put(
//   "/profile-picture",
//   protectSellerRoute,
//   SellerProfileController.updateProfilePicture
// );
// router.put(
//   "/update-password",
//   protectSellerRoute,
//   SellerVerificationController.updatePassword
// );

// module.exports = router;

const express = require("express");

const {
  getProfilePicByEmail,
  getUserByEmail,
  updateUserProfile,
  uploadProfilePicture,
  updateUserProfileImage,
  resetProfileImage,
} = require("../../controllers/LoginControllers/SellerLoginController/SellerProfileController.js");

const {
  Login,
  Logout,
  register,
} = require("../../controllers/LoginControllers/SellerLoginController/SellerLoginController.js");

const {
  updateAmount,
  getAmount,
} = require("../../controllers/LoginControllers/SellerLoginController/SellerPaymentController.js");

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
  checkSellerBySellerEmail,
} = require("../../controllers/LoginControllers/SellerLoginController/SellerVerificationController.js");

const {
  IsUser,
  IsSeller,
  IsGUser,
  checkUserByEmail,
  checkSellerByEmail,
  updatePassword,
} = require("../../middleware/LoginMiddleware/authOtherMiddlewares.js");

const SellerRoutes = express.Router();
//-------------------------Testing---------------------------//
const loginLimiter = require("../../middleware/Security/RateLimiter.js");
// const upload = require("../../middleware/LoginMiddleware/ProfilePhotoUpload.js");
const handleImageUploads = require("../../middleware/Media/ImageUpload.js");
const passport = require("passport");
const {
  handleGoogleCallback,
} = require("../../controllers/LoginControllers/SellerLoginController/SellerGoogleLoginController.js");

//-------------------LOGIN-CRUD------------------//

SellerRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

SellerRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleCallback
);

// POST endpoint to create a account
SellerRoutes.post("/register", register);

// POST endpoint to login into a account
// SellerRoutes.post("/login", loginLimiter, Login);
SellerRoutes.post("/login", Login);

// POST endpoint to logout from a account
SellerRoutes.post("/logout", Logout);

// POST endpoint to check a account by EMAIL
SellerRoutes.post("/check-user", checkUserByEmail, (req, res) => {
  return res.status(200).json({ message: "User found", user: req.user });
});

// POST endpoint to check a account by EMAIL
SellerRoutes.post("/check-user", checkSellerByEmail, (req, res) => {
  return res.status(200).json({ message: "User found", user: req.user });
});

SellerRoutes.get("/check", checkAuth);

// POST endpoint to send OTP
SellerRoutes.post("/send-otp", sendOtp);
SellerRoutes.post("/verify-otp", verifyOtp);

// POST endpoint to resend OTP
SellerRoutes.post("/resend-otp", resendOtp);

// GET endpoint to check a valid user
SellerRoutes.get("/checkUser", IsUser, CheckUser);

// GET endpoint to get a OTP by EMAIL
SellerRoutes.get("/get-otp/:email", getOtp);

// GET endpoint to get a user by EMAIL
SellerRoutes.get("/user/:email", getUserByEmail);

// GET endpoint to get a user profile picture by EMAIL
SellerRoutes.get("/profile-pic", getProfilePicByEmail);

// PATCH endpoint to update user profile (GOOGLE SIGN IN)
SellerRoutes.patch("/updateGProfile", IsGUser, updateGProfile);

// PATCH endpoint to update user profile (NORMAL SIGN IN)
SellerRoutes.patch("/updateProfile", IsSeller, updateProfile);

//PATCH endpoint to update user password by email
SellerRoutes.patch("/update-password", checkUserByEmail, updatePassword);

//PATCH endpoint to update user profile by email
SellerRoutes.patch("/updateUserProfile/:email", updateUserProfile);

// POST endpoint for uploading profile pictures (Cloudinary-only version)

// Update the upload-profile-pic route
SellerRoutes.post(
  "/upload-profile-pic",
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

SellerRoutes.patch("/updateUserProfileImage/:email", updateUserProfileImage);

SellerRoutes.patch("/resetProfileImage/:email", resetProfileImage);

//PATCH endpoint to verify user by email
SellerRoutes.patch("/verify-user", verifyNormalUser);
SellerRoutes.post("/check-seller", checkSellerBySellerEmail);

//-------------------MONEY-CRUD------------------//

// GET get user amount details
SellerRoutes.get("/get-amount", getAmount);

// PATCH update user amount
SellerRoutes.patch("/update-amount", updateAmount);

module.exports = SellerRoutes;
