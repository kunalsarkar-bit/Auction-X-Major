import React from "react";
import storyImageSrc from "../../../../../assets/images/FooterElements/AboutUs/our-story.png";
import fashionImageSrc from "../../../../../assets/images/FooterElements/AboutUs/our-story-innovation.jpg";

function OurStory() {
  return (
    <div className="bg-white dark:bg-[#191919] text-black dark:text-white font-sans w-full min-h-screen pt-20 overflow-y-auto">
      {/* Our Story Section */}
      <div className="flex justify-center mb-20">
        <div className="w-full max-w-4xl px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-yellow-600 dark:text-yellow-400 relative inline-block mb-10">
            Our Story
            <span className="absolute bottom-0 left-0 w-20 h-1 bg-yellow-600 dark:bg-yellow-400"></span>
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              {storyImageSrc ? (
                <img
                  src={storyImageSrc}
                  alt="Story Illustration"
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Image not available</p>
              )}
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-xl text-gray-800 dark:text-gray-200 mb-4">
                Our story starts with the name <strong>AuctionX</strong>.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                Auction X was born to break the mold—a bold idea in a world
                afraid of difference. When society dismisses something as
                "stupid," it's often because it's unfamiliar or challenges the
                norm. Auction X embraces this perception, standing as a beacon
                for those who dare to dream beyond conventions.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                It's not just an auction platform—it's a movement. A community
                built on trust, innovation, and fairness, where every bid tells
                a story of possibility. Auction X isn't here to fit in. It's
                here to redefine the rules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl text-gray-800 dark:text-gray-200 leading-relaxed">
            Making an impact through{" "}
            <span className="font-bold">innovation, honesty,</span> and{" "}
            <span className="font-bold">thoughtfulness</span>
          </h1>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="container mx-auto text-center mt-10 px-4">
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          For us, Auction X is about seeing things differently.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
          Founded in 2024, it was built on the belief that auctions can do more
          than generate profit—they can make an impact.
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300 font-bold">
          Auction X connects people through competitive bidding, turning every
          auction into a story of opportunity and innovation. It's not just
          about buying and selling; it's about reshaping how value is created
          and shared.
        </p>
      </div>

      {/* Distinctive Fashion Section */}
      <div className="my-10">
        <div className="container mx-auto text-center">
          {fashionImageSrc ? (
            <img
              src={fashionImageSrc}
              alt="Fashion Illustration"
              className="w-full max-w-6xl h-[500px] mx-auto rounded-lg shadow-xl dark:shadow-gray-900 object-cover"
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Auction X image not available</p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-200 mt-6">
            AuctionX
          </h2>
          <h3 className="text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-400 mt-2">
            Distinctive Auction platform for the contemporary Indian
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
            With in-house capabilities in design, manufacturing, technology,
            data science, and marketing.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="py-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">6 months</h3>
              <p className="text-gray-600 dark:text-gray-400">of journey so far</p>
            </div>
            <div className="py-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">4</h3>
              <p className="text-gray-600 dark:text-gray-400">team-members</p>
            </div>
            <div className="py-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">1 Crore+</h3>
              <p className="text-gray-600 dark:text-gray-400">products sold</p>
            </div>
            <div className="py-4">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">Infinity</h3>
              <p className="text-gray-600 dark:text-gray-400">app downloads</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurStory;