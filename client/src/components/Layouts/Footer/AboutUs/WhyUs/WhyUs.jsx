import React, { useState, useEffect } from "react";
import { FaShippingFast, FaCheckCircle, FaLock } from "react-icons/fa";

const WhyUs = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [fade, setFade] = useState(true);

  const testimonials = [
    {
      name: "Alex Smith",
      role: "Frequent Bidder, Auction X",
      text: "Auction X has transformed my experience in online bidding. The platform is user-friendly, and I love how easy it is to navigate through active auctions. I feel confident with the security and transparency Auction X offers. Highly recommended for anyone looking to buy or sell!",
    },
    {
      name: "Samantha Lee",
      role: "Seller, Auction X",
      text: "Auction X is fantastic for sellers! Listing my items was seamless, and the support team was always there when I needed help. The bidding process is smooth and secure, which really puts my mind at ease. I've connected with a larger audience and had great results on every sale.",
    },
    {
      name: "Michael Johnson",
      role: "New User, Auction X",
      text: "As a first-time user, I found Auction X incredibly easy to get started with. The setup was straightforward, and I quickly got the hang of the bidding process. It's exciting to watch live bids, and I even won my first item! Auction X offers a unique experience I'll definitely recommend.",
    },
  ];

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setActiveTestimonial(
        (prev) => (prev - 1 + testimonials.length) % testimonials.length
      );
      setFade(true);
    }, 300);
  };

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-[#191919] text-black dark:text-white py-20">
      {/* Why Shop With Us Section */}
      <h2 className="text-center text-4xl font-bold mb-12 text-black dark:text-white">WHY SHOP WITH US</h2>
      <div className="flex flex-wrap justify-center gap-8 px-4">
        {/* Card 1: Fast Delivery */}
        <div className="bg-gray-50 dark:bg-[#303030] rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 p-8 text-center w-full md:w-1/4 hover:transform hover:-translate-y-2 transition-transform border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center mb-6">
            <FaShippingFast size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Fast Delivery
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Variations of passages of Lorem Ipsum available
          </p>
        </div>

        {/* Card 2: Free Shipping */}
        <div className="bg-gray-50 dark:bg-[#303030] rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 p-8 text-center w-full md:w-1/4 hover:transform hover:-translate-y-2 transition-transform border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center mb-6">
            <FaCheckCircle size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Free Shipping
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Variations of passages of Lorem Ipsum available
          </p>
        </div>

        {/* Card 3: Best Quality */}
        <div className="bg-gray-50 dark:bg-[#303030] rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 p-8 text-center w-full md:w-1/4 hover:transform hover:-translate-y-2 transition-transform border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center items-center mb-6">
            <FaLock size={40} className="text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Best Quality
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Variations of passages of Lorem Ipsum available
          </p>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="max-w-4xl mx-auto mt-20 relative px-4">
        <h2 className="text-center text-4xl font-bold mb-12 tracking-wider text-black dark:text-white">
          TESTIMONIAL
        </h2>
        <div className="relative overflow-hidden h-64">
          {/* Testimonial Content */}
          <div
            className={`transition-opacity duration-500 ease-in-out ${
              fade ? "opacity-100" : "opacity-0"
            }`}
            key={activeTestimonial}
          >
            <div className="bg-gray-50 dark:bg-[#303030] rounded-lg shadow-sm dark:shadow-md dark:shadow-black/10 p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h5 className="text-blue-600 dark:text-blue-400 font-bold text-xl">
                    {testimonials[activeTestimonial]?.name}
                  </h5>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {testimonials[activeTestimonial]?.role}
                  </p>
                </div>
                <i className="fas fa-quote-right text-gray-400 dark:text-gray-500 text-2xl"></i>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {testimonials[activeTestimonial]?.text}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="bg-blue-600 dark:bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center absolute -left-16 top-1/2 transform -translate-y-1/2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-chevron-left text-white"></i>
        </button>
        <button
          onClick={handleNext}
          className="bg-blue-600 dark:bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center absolute -right-16 top-1/2 transform -translate-y-1/2 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-chevron-right text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default WhyUs;