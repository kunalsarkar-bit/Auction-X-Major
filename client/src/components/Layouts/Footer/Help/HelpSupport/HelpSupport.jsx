import { Search } from "lucide-react";
import { FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";

export default function HelpSupport() {
  const supportCategories = [
    { title: "Getting Started", description: "Start off on the right foot! Not the left one!", icon: "🚀" },
    { title: "Account Settings", description: "You're a special snowflake and so is your account", icon: "👤" },
    { title: "Billing", description: "That feel when you look at your bank account", icon: "💰" },
    { title: "Interface", description: "What does this button do ..#???", icon: "🖥️" },
    { title: "Trust & Safety", description: "Keep things safe & sound for you and your buddies", icon: "🛡️" },
    { title: "F.A.Q", description: "All you can eat self-serve problem solving", icon: "❓" },
    { title: "Community", description: "Bringing people together from all over the world", icon: "🌎" },
    { title: "Server Setup", description: "Almost as exciting as interior decorating", icon: "🛠️" },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold">Welcome to Global Educate Support</h1>
        <div className="flex items-center mt-4 bg-white p-3 rounded-lg shadow-md">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="How can we help you?"
            className="flex-grow outline-none px-3"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">TRY YOUR LUCK</button>
        </div>
        <h2 className="text-2xl font-semibold mt-10">Need help? We've got your back</h2>
        <p className="text-gray-600">Perhaps you can find the answers in our collections</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {supportCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-md text-center hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-3">{category.icon}</div>
              <h3 className="font-bold text-lg">{category.title}</h3>
              <p className="text-sm text-gray-500">{category.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-gray-500 flex justify-center items-center space-x-4">
          <span>Other ways to find help:</span>
          <a href="#" className="text-pink-500 text-2xl"><FaInstagram /></a>
          <a href="#" className="text-black text-2xl"><FaXTwitter /></a>
          <a href="#" className="text-red-500 text-2xl"><FaYoutube /></a>
        </div>
      </div>
    </div>
  );
}
