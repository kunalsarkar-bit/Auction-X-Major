const handleGoogleCallback = (req, res) => {
  const { token, user } = req.user;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const profilePic = JSON.stringify(user.profilePic);

  res.redirect(
    `http://localhost:3000/login?` +
      `id=${user._id}&` + // Critical: Include user ID
      `name=${encodeURIComponent(user.name)}&` +
      `email=${encodeURIComponent(user.email)}&` +
      `profilePic=${encodeURIComponent(profilePic)}&` +
      `role=${user.role}&` +
      `isNewUser=${user.isNewUser}&` +
      `verified=${user.isVerified ? "true" : "false"}`
  );
};

module.exports = {
  handleGoogleCallback,
};
