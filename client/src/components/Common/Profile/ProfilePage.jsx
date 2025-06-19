import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AvatarSelector from "./AvatarSelector";
import FAQList from "../FAQ/FAQ";
// import axios from "axios";
import { completeLogout } from "../../../redux/slices/authThunks";
import axios from "../../../utils/axiosConfig";
const API_URL = import.meta.env.VITE_API_URL;
const ProfilePage = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth); // Get auth state from Redux
  const [isModalOpen, setIsModalOpen] = useState(false);

  const DefaultProfilePicture =
    "https://res.cloudinary.com/dszvpb3q5/image/upload/v1743180239/ave3utbydiwk7bkmalxa.jpg";

  // Get user data including email directly from Redux
  const userData = auth.user;
  const email = userData?.email;

  const [user, setUser] = useState({
    name: "",
    email: email || "", // Use email from Redux only
    address: "",
    phoneNo: "",
    pinCode: "",
    state: "",
    city: "",
    alternativePhoneNo: "",
    gender: "",
    profilePic: [{ secure_url: "" }],
  });
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(completeLogout());
    // Optionally navigate to home/login page
    navigate("/login");
  };
  // Fetch user data and profile picture on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) return;

      try {
        const userResponse = await axios.get(
          `${API_URL}/api/auth/user/user/${email}`,
          {
            showGlobalLoading: true, // Enable loading
            loadingMessage: "Loading profile...", // Custom message
          }
        );

        if (userResponse.data) {
          setUser({
            ...userResponse.data,
            pinCode: userResponse.data.pinCode || "",
            state: userResponse.data.state || "",
            city: userResponse.data.city || "",
            alternativePhoneNo: userResponse.data.alternativePhoneNo || "",
          });

          if (
            userResponse.data.profilePic &&
            userResponse.data.profilePic.length > 0
          ) {
            setProfilePicUrl(userResponse.data.profilePic[0].secure_url);
          } else {
            const picResponse = await axios.get(
              `${API_URL}/api/auth/user/profile-pic?email=${email}`
            );
            if (
              picResponse.data &&
              picResponse.data.profilePic &&
              picResponse.data.profilePic.length > 0
            ) {
              setProfilePicUrl(picResponse.data.profilePic[0].secure_url);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    // ✅ Listen to profile update events from AvatarSelector
    const handleProfileUpdated = () => {
      fetchUserData(); // re-fetch when image is updated
    };

    window.addEventListener("profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
    };
  }, [email]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSectionClick = (route) => {
    navigate(route);
  };

  // Color schemes for profile details cards
  const colorSchemes = [
    "from-blue-50 to-indigo-50 border-l-4 border-blue-400",
    "from-purple-50 to-pink-50 border-l-4 border-purple-400",
    "from-green-50 to-teal-50 border-l-4 border-green-400",
    "from-yellow-50 to-orange-50 border-l-4 border-yellow-400",
    "from-red-50 to-rose-50 border-l-4 border-red-400",
    "from-sky-50 to-cyan-50 border-l-4 border-sky-400",
    "from-emerald-50 to-lime-50 border-l-4 border-emerald-400",
    "from-amber-50 to-yellow-50 border-l-4 border-amber-400",
    "from-fuchsia-50 to-violet-50 border-l-4 border-fuchsia-400",
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[#191919] p-4 sm:p-8">
      {/* Profile Header with Background Image */}
      <div
        className="relative h-48 sm:h-64 md:h-80 w-full rounded-lg bg-gray-300 dark:bg-gray-700 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("https://img.freepik.com/free-vector/abstract-colorful-shapes-background_361591-2848.jpg?semt=ais_hybrid")`,
        }}
      >
        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="relative">
            <img
              src={profilePicUrl || DefaultProfilePicture}
              alt="Profile"
              className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full border-4 border-white shadow-lg bg-gray-200 dark:bg-gray-600"
              onError={(e) =>
                (e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png")
              }
            />
            {/* Plus Button to Open Modal */}
            <div
              className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-blue-700 transition"
              onClick={openModal}
            >
              <span className="text-2xl">+</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="bg-white dark:bg-[#303030] p-6 rounded-lg shadow-2xl max-w-[770px] w-full mx-4 relative shadow-xl max-h-[90vh] overflow-auto"
            aria-modal="true"
            role="dialog"
          >
            <button
              className="absolute top-2 right-2 text-gray-700 text-xl hover:text-red-500 z-10"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ✖
            </button>
            <AvatarSelector onClose={closeModal} />
          </div>
        </div>
      )}

      {/* User Details */}
      <div className="bg-white dark:bg-[#303030] p-6 rounded-lg shadow-md mt-20 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Details</h2>
          {email && (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: "Full Name", value: user.name },
            { label: "Email", value: user.email },
            { label: "Address", value: user.address },
            { label: "Phone Number", value: user.phoneNo },
            { label: "Pin Code", value: user.pinCode },
            { label: "State", value: user.state },
            { label: "City", value: user.city },
            { label: "Alternative Phone No", value: user.alternativePhoneNo },
            {
              label: "Gender",
              value: user.gender
                ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1)
                : "",
            },
          ].map((field, index) => (
            <div
              key={field.label}
              className={`p-3 rounded-md shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br ${
                colorSchemes[index % colorSchemes.length]
              }`}
            >
              <p className="text-gray-700 text-sm font-medium mb-1">
                {field.label}
              </p>
              <p
                className="font-semibold truncate"
                title={field.value || "Not specified"}
              >
                {field.value || "Not specified"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {[
          { name: "My Bids", icon: "fa-box", route: "/bids" },
          { name: "My Payments", icon: "fa-credit-card", route: "/balance" },
          { name: "My Wallet", icon: "fa-wallet", route: "/balance" },
          {
            name: "Scheduled Bids",
            icon: "fa-map-marker-alt",
            route: "/scheduledbids",
          },
          {
            name: "Profile Settings",
            icon: "fa-user",
            route: "/profilesettings",
          },
          { name: "Help & Support", icon: "fa-life-ring", route: "/support" },
          { name: "Our Story", icon: "fa-book-open", route: "/our-story" },
          { name: "Feedback", icon: "fa-heart", route: "/feedback" },
          { name: "FanBook", icon: "fa-heart", route: "/fanbook" },
          {
            name: "Daily Challenges",
            icon: "fa-flag-checkered",
            route: "/daily-challenges",
          },
        ].map((section) => (
          <div
            key={section.name}
            className="bg-white dark:bg-[#303030] p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center cursor-pointer"
            onClick={() => handleSectionClick(section.route)}
          >
            <div className="flex flex-col items-center mb-4">
              <i
                className={`fas ${section.icon} text-3xl text-gray-700 dark:text-white mb-2`}
              ></i>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {section.name}
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Details about {section.name.toLowerCase()} go here...
            </p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <FAQList />
    </div>
  );
};

export default ProfilePage;
