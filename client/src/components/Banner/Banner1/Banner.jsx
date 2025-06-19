import React from "react";

const Banner = () => {
  return (
    <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold text-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
              Connect & Learn from Experts
            </h1>
            <p className="mt-4 text-base text-black sm:text-lg md:text-xl lg:text-2xl">
              Grow your career fast with the right mentor.
            </p>
            <a
              href="#"
              className="inline-flex items-center px-6 py-3 mt-8 text-sm font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full sm:px-8 sm:py-4 sm:text-base hover:bg-yellow-400 focus:bg-yellow-400"
            >
              Join for Free
            </a>
          </div>
          <div className="order-first lg:order-last">
            <img
              className="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/1/hero-img.png"
              alt="Hero"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
