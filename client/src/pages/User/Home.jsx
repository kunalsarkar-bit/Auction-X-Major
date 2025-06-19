import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import SmoothScroll from "../../components/UI/SmoothScroll/SmoothScroll";
import Navbar from "../../pages/Layouts/Navbar/Navbar";
import ProductList from "../../components/ProductList/ProductList1/ProductList.jsx";
import ProductList2 from "../../components/ProductList/ProductList2/ProductList2.jsx";
import ProductList3 from "../../components/ProductList/ProductList3/ProductList3.jsx";
import ProductList4 from "../../components/ProductList/ProductList4/ProductList4.jsx";
import ProductList5 from "../../components/ProductList/ProductList5/ProductList5.jsx";
import ProductList10 from "../../components/ProductList/ProductList10/ProductList10.jsx";
import Banner3 from "../../components/Banner/Banner3/Banner3";
import Banner4 from "../../components/Banner/Banner4/Banner4";
import SpotifyEmbed from "../../components/Common/SpotifyEmbed/SpotifyEmbed";
import ProgressBar from "../../components/User/ProgressBar/ProgressBar";
import CardSlider from "../../components/Common/CardSlider/CardSlider";
import ChatQnA from "../../components/Common/ChatQnA/ChatQnA";
import SmoothHovering from "../../components/Common/StaticPages/SmoothHovering.jsx";
import Banner5 from "../../components/Banner/Banner5/Banner5.jsx";
import Banner6 from "../../components/Banner/Banner6/Banner6.jsx";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const sectionsRef = useRef([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // ✅ Correctly sync Lenis with GSAP ScrollTrigger
    ScrollTrigger.scrollerProxy(scrollContainerRef.current, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value);
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    // ✅ Fix scrolling stopping issue
    const onScroll = () => {
      lenis.raf(performance.now());
    };

    window.addEventListener("scroll", onScroll);

    ScrollTrigger.addEventListener("refresh", () => {
      lenis.resize();
      lenis.start(); // ✅ Make sure Lenis is running
    });

    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={scrollContainerRef} data-scroll-container>
      <div className="flex justify-center gap-4 my-4">
        <SmoothScroll to="featured-products" label="Featured Products" />
        <SmoothScroll to="our-products" label="Our Products" />
        <SmoothScroll to="seller-banner" label="Seller Section" />
      </div>

      <div ref={(el) => (sectionsRef.current[0] = el)}>
        <Banner3 />
      </div>
      <div ref={(el) => (sectionsRef.current[1] = el)} id="featured-products">
        <ProductList />
      </div>
      <div ref={(el) => (sectionsRef.current[2] = el)} id="our-products">
        <ProductList2 />
      </div>
      <div ref={(el) => (sectionsRef.current[3] = el)}>
        <Banner4 />
      </div>
      <div ref={(el) => (sectionsRef.current[4] = el)}>
        <ProductList3 />
      </div>
      <div ref={(el) => (sectionsRef.current[5] = el)}>
        <ProductList4 />
      </div>
      <div ref={(el) => (sectionsRef.current[6] = el)}>
        <ProductList10 />
      </div>
      <div ref={(el) => (sectionsRef.current[7] = el)}>
        <ProductList5 />
      </div>
       <div ref={(el) => (sectionsRef.current[8] = el)}>
        <Banner5 />
      </div>
       <div ref={(el) => (sectionsRef.current[10] = el)}>
        <Banner6 />
      </div>
      <div ref={(el) => (sectionsRef.current[13] = el)}>
        <ChatQnA />
      </div>
    </div>
  );
};

export default Home;
