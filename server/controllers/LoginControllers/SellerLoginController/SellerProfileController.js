const SellerModel = require("../../../models/LoginSchema/seller");

// Controller to get user by email
const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    // Exclude the password field from the user object
    const user = await SellerModel.findOne({ email: email }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  const email = req.params.email;
  const updatedData = req.body;

  console.log("Updated Data:", updatedData); // Log the incoming data for debugging

  try {
    // Find user by email and update only the specified fields
    const updatedUser = await SellerModel.findOneAndUpdate(
      { email: email },
      {
        $set: {
          name: updatedData.name,
          address: updatedData.address,
          phoneNo: updatedData.phoneNo,
          alternativePhoneNo: updatedData.alternativePhoneNo,
          gender: updatedData.gender,
          city: updatedData.city,
          state: updatedData.state,
          country: updatedData.country,
          pinCode: updatedData.pinCode,
        },
      },
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProfilePicByEmail = async (req, res) => {
  try {
    // Retrieve email from request query parameters
    const { email } = req.query;

    // Find the user by email
    const user = await SellerModel.findOne({ email });

    // If user is not found, send a 404 response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the profilePic array (assuming it has at least one picture)
    const profilePic = user.profilePic[0]?.secure_url;
    const name = user.name;

    // Send profile picture URL as a response if it exists, else a message
    if (profilePic) {
      res.status(200).json({ profilePic, name });
    } else {
      res.status(404).json({ message: "Profile picture not found" });
    }
  } catch (error) {
    // Send a 500 response if there's a server error
    res.status(500).json({ message: "Server error", error });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    const { email } = req.body;
    const uploadedImage = req.cloudinaryUploads?.profilePic?.[0];

    // Validate input
    if (!email) return res.status(400).json({ message: "Email is required" });
    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
      return res.status(400).json({ message: "Invalid image upload" });
    }

    // Find user
    const user = await SellerModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("Current user profilePic:", user.profilePic);
    console.log("New image data:", uploadedImage);

    // Delete old image if exists and is different from new one
    if (user.profilePic?.length > 0) {
      const currentImage = user.profilePic[0];
      if (
        currentImage.public_id &&
        currentImage.public_id !== uploadedImage.public_id
      ) {
        console.log(`Attempting to delete: ${currentImage.public_id}`);

        try {
          const result = await deleteFromCloudinary(currentImage.public_id);
          console.log("Cloudinary deletion result:", result);

          if (result.result !== "ok") {
            console.warn(
              "Deletion may have failed - Cloudinary response:",
              result
            );
          }
        } catch (deleteError) {
          console.error("Cloudinary deletion error:", {
            message: deleteError.message,
            public_id: currentImage.public_id,
          });
          // Continue with upload even if deletion fails
        }
      }
    }

    // Update user with new image
    user.profilePic = [
      {
        secure_url: uploadedImage.secure_url,
        public_id: uploadedImage.public_id,
      },
    ];

    const updatedUser = await user.save();
    console.log("Successfully updated user:", {
      email: updatedUser.email,
      newProfilePic: updatedUser.profilePic,
    });

    return res.status(200).json({
      message: "Profile picture updated successfully",
      image: updatedUser.profilePic[0],
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update user profile image
const updateUserProfileImage = async (req, res) => {
  const { email } = req.params;
  const { profilePic } = req.body;

  // Add debug logging
  console.log("Attempting to update profile for:", email);
  console.log("Received profilePic data:", profilePic);

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  if (!profilePic || !Array.isArray(profilePic) || profilePic.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Valid profile picture data is required as an array",
    });
  }

  try {
    // Use SellerModel instead of User
    const user = await SellerModel.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const newProfilePic = profilePic.map((pic) => ({
      secure_url: pic.secure_url || pic,
      public_id: pic.public_id || "",
    }));

    console.log("Updating profile picture with:", newProfilePic);
    user.profilePic = newProfilePic;
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    console.log("Profile picture updated successfully for:", email);
    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Detailed error updating profile picture:", {
      message: error.message,
      stack: error.stack,
      fullError: error,
    });
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile picture",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Reset user profile image to default
const resetProfileImage = async (req, res) => {
  const { email } = req.params;

  console.log("Attempting to reset profile for:", email);

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Use SellerModel instead of User
    const user = await SellerModel.findOne({ email });

    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const defaultAvatar = {
      secure_url:
        "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg",
      public_id: "",
    };

    console.log("Resetting to default avatar:", defaultAvatar);
    user.profilePic = [defaultAvatar];
    await user.save();

    const userData = user.toObject();
    delete userData.password;
    delete userData.__v;

    console.log("Profile reset successfully for:", email);
    return res.status(200).json({
      success: true,
      message: "Profile picture reset to default successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Detailed error resetting profile picture:", {
      message: error.message,
      stack: error.stack,
      fullError: error,
    });
    return res.status(500).json({
      success: false,
      message: "Server error while resetting profile picture",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

// Fix: Export the uploadProfilePicture function
module.exports = {
  getUserByEmail,
  updateUserProfile,
  getProfilePicByEmail,
  uploadProfilePicture,
  updateUserProfileImage,
  resetProfileImage,
};
