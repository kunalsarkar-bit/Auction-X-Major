import React from "react";

import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom
import SellerFooter from "../../pages/Seller/Layouts/SellerFooter/SellerFooter";
import SellerNavbar from "../../pages/Seller/Layouts/SellerNavbar/SellerNavbar";


const SellerLayout = ({ showNavbarAndFooter = true }) => {
  return (
    <div>
      {showNavbarAndFooter && <SellerNavbar/>} {/* Conditionally render Navbar */}
      <div className="main-content">
        <main>
          <Outlet /> {/* Renders the matching child route */}
        </main>
      </div>
      {showNavbarAndFooter && <SellerFooter/>} {/* Conditionally render Footer */}
    </div>
  );
};

export default SellerLayout;
