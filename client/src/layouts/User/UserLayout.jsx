import React from "react";
import Navbar from "../../pages/Layouts/Navbar/Navbar";
import Footer from "../../pages/Layouts/Footer/Footer";
import { Outlet } from "react-router-dom"; // Import Outlet from react-router-dom

const UserLayout = ({ showNavbarAndFooter = true }) => {
  return (
    <div>
      {showNavbarAndFooter && <Navbar />} {/* Conditionally render Navbar */}
      <div className="main-content mt-12">
        <main>
          <Outlet /> {/* Renders the matching child route */}
        </main>
      </div>
      {showNavbarAndFooter && <Footer />} {/* Conditionally render Footer */}
    </div>
  );
};

export default UserLayout;
