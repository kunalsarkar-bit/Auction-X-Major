const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../../models/LoginSchema/user");
const jwt = require("jsonwebtoken");

const configureGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const existingUser = await User.findOne({
            email: profile.emails[0].value,
          });

          let user;
          let isNewUser = !existingUser;

          if (existingUser) {
            user = await User.findOneAndUpdate(
              { email: profile.emails[0].value },
              {
                profilePic: [
                  {
                    secure_url: profile.photos[0].value,
                    public_id: "",
                  },
                ],
              },
              { new: true }
            );
          } else {
            user = new User({
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePic: [
                {
                  secure_url: profile.photos[0].value,
                  public_id: "",
                },
              ],
              role: "user",
              password: "",
              isNewUser: true,
              isVerified: true, // Add this for new Google users
            });
            await user.save();
          }

          const token = jwt.sign(
            {
              id: user._id, // Include user ID in JWT
              email: user.email,
              name: user.name,
              role: user.role,
              isNewUser,
            },
            process.env.JWT_SECRETE,
            { expiresIn: "30d" }
          );

          done(null, {
            token,
            user: {
              _id: user._id, // Ensure _id is passed
              name: user.name,
              email: user.email,
              profilePic: user.profilePic,
              role: user.role,
              isNewUser,
              isVerified: user.isVerified || false,
            },
          });
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

module.exports = configureGoogleStrategy;
