import React from "react";
import SellerBannerCard from "./SellerBannerCard";

const SellerBanner = () => {
  const blogs = [
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
    {
      date: "12 April 2021",
      title: "The Decorated Ways",
      description: "Dive into minimalism",
      imageUrl:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fDRrJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
      altText: "chair",
    },
  ];

  return (
    <div className="flex justify-center items-center">
      <div className="2xl:mx-auto 2xl:container lg:px-20 lg:py-16 md:py-12 md:px-6 py-9 px-4 w-96 sm:w-auto">
        <div role="main" className="flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-2xl md:text-3xl font-semibold leading-9 text-center text-gray-800 text-black">
            This Week Blogs
          </h1>
          <p className="text-base sm:text-sm leading-normal text-center text-black mt-4 sm:mt-3 lg:w-1/2 md:w-10/12 w-11/12">
            If you're looking for random paragraphs, you've come to the right
            place. When a random word or a random sentence isn't quite enough
          </p>
        </div>
        <div className="lg:flex items-stretch md:mt-8 mt-8">
          <div className="lg:w-1/2">
            <div className="sm:flex items-center justify-between xl:gap-x-8 gap-x-6">
              <div className="sm:w-1/2 relative">
                <SellerBannerCard {...blogs[0]} />
              </div>
              <div className="sm:w-1/2 sm:mt-0 mt-4 relative">
                <SellerBannerCard {...blogs[1]} />
              </div>
            </div>
            <div className="relative mt-8 sm:mt-4">
              <SellerBannerCard {...blogs[2]} />
            </div>
          </div>
          <div className="lg:w-1/2 xl:ml-8 lg:ml-4 lg:mt-0 md:mt-4 mt-2 lg:flex flex-col justify-between">
            <div className="relative">
              <SellerBannerCard {...blogs[3]} />
            </div>
            <div className="sm:flex items-center justify-between xl:gap-x-8 gap-x-6 md:mt-4 mt-4">
              <div className="relative w-full">
                <SellerBannerCard {...blogs[4]} />
              </div>
              <div className="relative w-full sm:mt-0 mt-4">
                <SellerBannerCard {...blogs[5]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerBanner;
