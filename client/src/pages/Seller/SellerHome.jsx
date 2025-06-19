import React from "react";
import SellerBanner from "../../components/SellerComponents/SellerBanner/SellerBanner1/SellerBanner.jsx";
import SellerBanner2 from "../../components/SellerComponents/SellerBanner/SellerBanner2/SellerBanner2.jsx";
import SellerBanner3 from "../../components/SellerComponents/SellerBanner/SellerBanner3/SellerBanner3.jsx";
import SellerBanner4 from "../../components/SellerComponents/SellerBanner/SellerBanner4/SellerBanner4.jsx";
import SellerBannerCard from "../../components/SellerComponents/SellerBanner/SellerBanner1/SellerBannerCard.jsx";
import AnimatedNumbers from "../../components/User/AnimatedNumbers/AnimatedNumbers.jsx";
import PricingTable from "../../components/SellerComponents/PricingTable/PricingTable.jsx";
import SellerSupport from "../../components/SellerComponents/SellerSupport/SellerSupport.jsx";
import SellProduct from "../../components/SellerComponents/SellProduct/SellProduct.jsx";

import Banner from "../../components/Banner/Banner1/Banner.jsx";
import SellerDashboardSlider from "../../components/Common/StaticPages/SellerDashboardSlidebar.jsx";
import GreetingAnimation from "../../components/Common/GreetingAnimation/GreetingAnimation.jsx";
import Features from "../../components/Common/StaticPages/Features.jsx";
import GlassyProfile from "../../components/Common/GlassyProfile/GlassyProfile.jsx";
import CardSlider from "../../components/Common/CardSlider/CardSlider.jsx";
import SmoothHovering from "../../components/Common/StaticPages/SmoothHovering.jsx";

const SellerHome = () => {
  return (
    <div>
      <div>
        <GreetingAnimation />
        <Features />
        <GlassyProfile />

        <SellerBanner4 />
        <Banner />
        <SellerDashboardSlider />
        <SellerBanner />
        <SellerBanner2 />
        <SellerBanner3 />
        <AnimatedNumbers />
       <CardSlider />
        <SellerBannerCard />
        <PricingTable />
        <SellerSupport />
        <SmoothHovering />
        <SellProduct />
      </div>
    </div>
  );
};

export default SellerHome;
