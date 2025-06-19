/////////////////////////////////////////////////////////--> UI <--///////////////////////////////////////////////////////////

import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import authService from "./services/authService";
import { setUser } from "./redux/slices/authSlice";
import GlobalLoading from "./components/Common/Loader/GlobalLoading";

/////////////////////////////////////////////////////////--> Admins <--///////////////////////////////////////////////////////////
// import DashBoard from "./pages/Admin/Dashboard/Dashboard";
// import Orders from "./pages/Admin/Orders/Orders";
// import Customers from "./pages/Admin/Customers/Customers";
// import Inventory from "./pages/Admin/Inventory/Inventory";
// import AdminFeedback from "./pages/Admin/Feedback/AdminFeedback";

/////////////////////////////////////////////////////////--> Layouts <--///////////////////////////////////////////////////////////

//------------------------------Layouts (Layouts)------------------------------//
// import AdminLayout from "./layouts/Admin/AdminLayout";
import UserLayout from "./layouts/User/UserLayout";
import SellerLayout from "./layouts/Seller/SellerLayout";

//------------------------------Layouts (Components)------------------------------//
import AboutUS from "./components/Layouts/Footer/AboutUs/AboutUs1/AboutUs1";
import AboutUsTwo from "./components/Layouts/Footer/AboutUs/AboutUs2/AboutUs2";
import ContactUs from "./components/Layouts/Footer/AboutUs/ContactUs/ContactUs";
import WhyUs from "./components/Layouts/Footer/AboutUs/WhyUs/WhyUs";
import OurStory from "./components/Layouts/Footer/AboutUs/OurStory/OurStory";

// Consumer Policy Pages
import Privacy from "./components/Layouts/Footer/ConsumerPolicy/Privacy/Privacy";
import Security from "./components/Layouts/Footer/ConsumerPolicy/Security/Security";
import TermsAndConditions from "./components/Layouts/Footer/ConsumerPolicy/TermsAndConditions/TermsAndConditions";
// Help Pages
import FAQ from "./components/Layouts/Footer/Help/FAQ/FAQ";
import Payment from "./components/Layouts/Footer/Help/Payment/Payment";
import Report from "./components/Layouts/Footer/Help/Report/Report";
import Shipping from "./components/Layouts/Footer/Help/Shipping/Shipping";
import Feedback from "./components/Layouts/Footer/Help/Feedback/Feedback";
import HelpSupport from "./components/Layouts/Footer/Help/HelpSupport/HelpSupport";
// import Feedback from "./components/Common/StaticPages/Feedback";

/////////////////////////////////////////////////////////--> Components <--///////////////////////////////////////////////////////////

//------------------------------Components (Common)------------------------------//

import ProfileHeader from "./components/Common/Profile/ProfileHeader";
import ProfilePage from "./components/Common/Profile/ProfilePage";
import Profile from "./components/Common/Profile/Profile";
// import ScrollToTop from "./components/Scroll/Scroll";
// import ScrollToTopManual from "./components/ScrollToTop/ScrollToTop";

// Protected Route
// import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

import FeedbackForm from "./components/Common/Profile/ProfilePages/FeedbackForm/FeedbackForm";
import HelpAndSupportPage from "./components/Common/Profile/ProfilePages/HelpAndSupportPage/HelpAndSupportPage";
import BiddingGuidePage from "./components/Common/Profile/ProfilePages/BiddingGuidePage/BiddingGuidePage";
import ProfileSettingsPage from "./components/Common/Profile/ProfilePages/ProfileSettingsPage/ProfileSettingsPage";
import FanbookPage from "./components/Common/Profile/ProfilePages/FanBook/FanBook";
import DailyChallengesPage from "./components/Common/Profile/ProfilePages/DailyChallengesPage/DailyChallengesPage";

/////////////////////////////////////////////////////////--> Pages <--///////////////////////////////////////////////////////////

//------------------------------Seller Pages------------------------------//

import PendingBids from "./components/SellerDashboard/partials/dashboard/PendingBids/PendingBids";
import SellerHome from "./pages/Seller/SellerHome";

// import "./Components/SellerDashboard/sellercss/sellerStyle.css";
// import "./components/SellerDashboard/sellerCharts/ChartjsConfig";
import SellerDashboard from "./layouts/SellerLayout/SellerLayout";
import SellerAnalytics from "./components/SellerDashboard/pages/SellerAnalytics";
import SellerSales from "./components/SellerDashboard/pages/SellerSales";
import SellerPendingBids from "./components/SellerDashboard/pages/SellerPendingBids";
import SellerOrders from "./components/SellerDashboard/pages/SellerOrders";
import SellerInvoice from "./components/SellerDashboard/pages/SellerInvoice";
import SellerRevenue from "./components/SellerDashboard/pages/SellerOrderRevenue";
import SellerSubscriptions from "./components/SellerDashboard/pages/SellerSubscriptions";
import SellerAdminFeedback from "./components/SellerDashboard/pages/SellerFeedback";
import SellerMyAccount from "./components/SellerDashboard/pages/SellerMyAccount";
import SellerMyNotifications from "./components/SellerDashboard/pages/SellerMyNotifications";
import SellerAddAdmins from "./components/SellerDashboard/pages/SellerAddAdmins";
import SellerAdminLogs from "./components/SellerDashboard/pages/SellerAdminLogs";
import SellerRoadmap from "./components/SellerDashboard/pages/SellerRoadmap";
import SellerAdminFAQ from "./components/SellerDashboard/pages/SellerFAQ";
import SellerDownloadDataExcel from "./components/SellerDashboard/pages/SellerDownloadDataExcel";
import SellerGoodies from "./components/SellerDashboard/pages/Goodies/Goodies";
import SellerManageUsers from "./components/SellerDashboard/pages/SellerManageUsers";
import SellerDocumentation from "./components/SellerDashboard/pages/SellerDocumentation";
import SellerSellItemPage from "./components/SellerDashboard/pages/SellerSellItemPage";
import SellerUpdateItemPage from "./components/SellerDashboard/pages/SellerUpdateItemPage";
import CustomAuction from "./components/SellerDashboard/pages/SellerCustomAuction";
//------------------------------User Pages (Home)------------------------------//
import Home from "./pages/User/Home";

//------------------------------User Pages (Orders)------------------------------//
import DetailedOrderPage from "./pages/User/Dropdown/OrderHistory/DetailedOrderPage";
import OrdersPage from "./pages/User/Dropdown/OrderHistory/OrdersPage";

//------------------------------User Pages (Payment / Wallet)------------------------------//
import PaymentPage from "./pages/User/Dropdown/PaymentPage/PaymentPage";

//------------------------------User Pages (Sign in / Sign up) ------------------------------//
import Login from "./pages/User/UserLogin/Login";
import VerifyProfilePage from "./pages/User/UserLogin/VerifyProfilePage";
import OtpVerification from "./pages/User/UserLogin/OtpVerification";
import PasswordResetFlow from "./pages/User/UserLogin/PasswordResetFlow";
import VerifySellerProfilePage from "./pages/User/UserLogin/VerifySellerProfilePage";
//------------------------------User Pages (Others)------------------------------//
import CategoryList from "./pages/User/CategoryList/CategoryList";
import ScheduledBids from "./pages/User/Dropdown/ScheduledBids/ScheduledBids";
import SearchAndPostDetail from "./pages/User/SearchAndPostDetail/SearchAndPostDetail";
import ProductDetails from "./pages/User/ProductDetails/ProductDetails";
import BidAnItem from "./pages/User/BidAnItem/BidAnItem";
import TodayBid from "./components/User/TodayBid/TodayBid";
import TomorrowBid from "./components/User/TomorrowBid/TomorrowBid";
import SellerProfileView from "./components/User/SellerProfileView/SellerProfileView";
//------------------------------Page Not Found------------------------------//
import PageNotFound from "./components/Common/PageNotFound/PageNotFound";
//------------------------------Admin Dashboard------------------------------//

// import "./Components/AdminDashboard/admincss/adminStyle.css";
// import "./components/AdminDashboard/adminCharts/ChartjsConfig";
import Dashboard from "./layouts/AdminLayout/AdminLayout";
import Analytics from "./components/AdminDashboard/pages/AdminAnalytics";
import Sales from "./components/AdminDashboard/pages/AdminSales";
import Customers from "./components/AdminDashboard/pages/AdminCustomers";
import Inventory from "./components/AdminDashboard/pages/AdminInventory";
import Orders from "./components/AdminDashboard/pages/AdminOrders";
import Invoice from "./components/AdminDashboard/pages/AdminInvoice";
import Transactions from "./components/AdminDashboard/pages/AdminTransactions";
import Withdraw from "./components/AdminDashboard/pages/AdminWithdraw";
import Deposite from "./components/AdminDashboard/pages/AdminDeposite";
import Subscriptions from "./components/AdminDashboard/pages/AdminSubscriptions";
import Reports from "./components/AdminDashboard/pages/AdminReports";
import AdminFeedback from "./components/AdminDashboard/pages/AdminFeedback";
import Seller from "./components/AdminDashboard/pages/AdminSeller";
import SellerHistory from "./components/AdminDashboard/pages/AdminSellerHistory";
import AddBanner from "./components/AdminDashboard/pages/AddBanner";
import CustomEvents from "./components/AdminDashboard/pages/AdminCustomEvents";
import Calender from "./components/AdminDashboard/pages/AdminCalender";
import MyAccount from "./components/AdminDashboard/pages/AdminMyAccount";
import MyNotifications from "./components/AdminDashboard/pages/AdminMyNotifications";
import AddAdmins from "./components/AdminDashboard/pages/AddAdmins";
import AdminLogs from "./components/AdminDashboard/pages/AdminAdminLogs";
import Roadmap from "./components/AdminDashboard/pages/AdminRoadmap";
import AdminFAQ from "./components/AdminDashboard/pages/AdminFAQ";
import DownloadDataExcel from "./components/AdminDashboard/pages/AdminDownloadDataExcel";
import Goodies from "./components/AdminDashboard/pages/Goodies/Goodies";
import ManageUsers from "./components/AdminDashboard/pages/AdminManageUsers";
import Documentation from "./components/AdminDashboard/pages/AdminDocumentation";
import PrivacyRequest from "./components/AdminDashboard/pages/AdminPrivacyRequest";
import AdminContactUS from "./components/AdminDashboard/pages/AdminContactUS";

const useCurrentPath = () => {
  const location = useLocation();
  return location.pathname;
};

const Layout = () => {
  // const dispatch = useDispatch();
  const currentPath = useCurrentPath();
  const dispatch = useDispatch();

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const { authenticated, user } = await authService.checkAuth();

        if (authenticated && user) {
          dispatch(setUser(user));
        }
      } catch (error) {
        console.log("Not authenticated");
        // User is not authenticated, no need to handle the error
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const hiddenPaths = [
    "/login",
    "/verifyprofile",
    "/verifyGprofile",
    "/forgetpassword",
    "/resetpassword",
  ];
  const showNavbarAndFooter = !hiddenPaths.includes(currentPath);

  const location = useLocation();
  const showProfileHeader = location.pathname.startsWith("/profile"); // Fix applied

  return (
    <>
      {/* <ScrollToTopManual />
      <ScrollToTop />*/}
      <GlobalLoading />
      <Toaster />
      {showProfileHeader && <ProfileHeader />} {/* Sub-Header */}
      <Routes>
        {/* /////////////////////////////////////////////////////////--> Pages <--/////////////////////////////////////////////////////////// */}

        <Route
          element={<UserLayout showNavbarAndFooter={showNavbarAndFooter} />}
        >
          {/* //------------------------------User Pages (Home)------------------------------// */}
          <Route path="/" element={<Home />} />
          {/* //------------------------------User Pages (Others)------------------------------// */}
          <Route path="/about" element={<AboutUS />} />
          <Route path="about2" element={<AboutUsTwo />} />
          <Route path="/scheduledbids" element={<ScheduledBids />} />
          <Route path="/category/:category" element={<CategoryList />} />
          <Route path="/posts/:id" element={<SearchAndPostDetail />} />
          <Route path="/bid" element={<BidAnItem />} />
          {/* <Route path="/posts/:id" element={<SearchAndPostDetail />} /> */}
          <Route path="/category/:category" element={<CategoryList />} />
          <Route path="/todaybid" element={<TodayBid />} />
          <Route path="/tomorrowbid" element={<TomorrowBid />} />
          <Route path="/seller-profile-view" element={<SellerProfileView />} />

          {/* //------------------------------Layouts (Components)------------------------------// */}

          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/whyus" element={<WhyUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/report" element={<Report />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/helpsupport" element={<HelpSupport />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/support" element={<HelpAndSupportPage />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/guide" element={<BiddingGuidePage />} />
          <Route path="/profilesettings" element={<ProfileSettingsPage />} />
          <Route path="/fanbook" element={<FanbookPage />} />
          <Route path="/daily-challenges" element={<DailyChallengesPage />} />
        </Route>

        <Route
          element={<UserLayout showNavbarAndFooter={showNavbarAndFooter} />}
        >
          {/*//------------------------------Profile (With Sub-Routes) ------------------------------//*/}
          <Route path="/profile" element={<Profile />}>
            <Route path="myprofile" element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="balance" element={<PaymentPage />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="our-story" element={<OurStory />} />
            <Route path="helpsupport" element={<HelpSupport />} />
          </Route>
          {/* //------------------------------User Pages (Others)------------------------------// */}
          <Route path="/pendingbids" element={<PendingBids />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="/contact" element={<ContactUs />} />
          {/* //------------------------------User Pages (Payment / Wallet)------------------------------// */}
          <Route path="/balance" element={<PaymentPage />} />
          {/* //------------------------------User Pages (Orders)------------------------------// */}
          <Route path="/order/:id" element={<DetailedOrderPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Route>

        {/* //------------------------------User Pages (Payment / Wallet)------------------------------// */}

        {/*//------------------------------User Pages (Sign in / Sign up) ------------------------------//*/}

        <Route path="/login" element={<Login />} />
        <Route path="/verifyprofile" element={<VerifyProfilePage />} />
        <Route
          path="/verifysellerprofile"
          element={<VerifySellerProfilePage />}
        />
        <Route path="/passwordforget" element={<PasswordResetFlow />} />
        <Route path="/OTPverification" element={<OtpVerification />} />
        {/* /////////////////////////////////////////////////////////--> Layouts <--/////////////////////////////////////////////////////////// */}

        {/* Admin routes wrapped with AdminLayout */}
        {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<DashBoard />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/admin/feedback/:id" element={<AdminFeedback />} />
          </Route>
        </Route> */}

        {/* //------------------------------Seller Pages (Home)------------------------------// */}
        <Route
          element={<SellerLayout showNavbarAndFooter={showNavbarAndFooter} />}
        >
          <Route exact path="/seller" element={<SellerHome />} />
        </Route>
        <Route exact path="/seller/dashboard" element={<SellerDashboard />} />
        <Route
          exact
          path="/seller/dashboard/Documentation"
          element={<SellerDocumentation />}
        />
        <Route
          exact
          path="/seller/dashboard/analytics"
          element={<SellerAnalytics />}
        />
        <Route exact path="/seller/dashboard/sales" element={<SellerSales />} />
        <Route
          exact
          path="/seller/dashboard/pendingbids"
          element={<SellerPendingBids />}
        />
        <Route
          exact
          path="/seller/dashboard/sell"
          element={<SellerSellItemPage />}
        />
        <Route
          exact
          path="/seller/dashboard/pendingbids/update/:id"
          element={<SellerUpdateItemPage />}
        />
        <Route
          exact
          path="/seller/dashboard/orders"
          element={<SellerOrders />}
        />
        <Route
          exact
          path="/seller/dashboard/invoice"
          element={<SellerInvoice />}
        />
        <Route
          exact
          path="/seller/dashboard/revenue"
          element={<SellerRevenue />}
        />

        <Route
          exact
          path="/seller/dashboard/subscriptions"
          element={<SellerSubscriptions />}
        />

        <Route
          exact
          path="/seller/dashboard/feedback"
          element={<SellerAdminFeedback />}
        />
        <Route
          exact
          path="/seller/dashboard/manageUsers"
          element={<SellerManageUsers />}
        />
        <Route
          exact
          path="/seller/dashboard/ourGoodies"
          element={<SellerGoodies />}
        />
        <Route
          exact
          path="/seller/dashboard/settings/myAccount"
          element={<SellerMyAccount />}
        />
        <Route
          exact
          path="/seller/dashboard/settings/myNotifications"
          element={<SellerMyNotifications />}
        />

        <Route
          exact
          path="/seller/dashboard/settings/addAdmin"
          element={<SellerAddAdmins />}
        />

        <Route
          exact
          path="/seller/dashboard/utility/adminLogs"
          element={<SellerAdminLogs />}
        />
        <Route
          exact
          path="/seller/dashboard/utility/roadmap"
          element={<SellerRoadmap />}
        />
        <Route
          exact
          path="/seller/dashboard/utility/faq"
          element={<SellerAdminFAQ />}
        />
        <Route
          exact
          path="/seller/dashboard/utility/downloadDataExcel"
          element={<SellerDownloadDataExcel />}
        />
        <Route
          exact
          path="/seller/custom-auction"
          element={<CustomAuction />}
        />

        {/* //------------------------------Layouts (AdminLayouts)------------------------------// */}

        <Route exact path="/admin/dashboard" element={<Dashboard />} />

        <Route
          exact
          path="/admin/dashboard/Documentation"
          element={<Documentation />}
        />
        <Route
          exact
          path="/admin/dashboard/analytics"
          element={<Analytics />}
        />
        <Route exact path="/admin/dashboard/sales" element={<Sales />} />
        <Route
          exact
          path="/admin/dashboard/customers"
          element={<Customers />}
        />
        <Route
          exact
          path="/admin/dashboard/inventory"
          element={<Inventory />}
        />
        <Route exact path="/admin/dashboard/orders" element={<Orders />} />
        <Route exact path="/admin/dashboard/invoice" element={<Invoice />} />
        <Route
          exact
          path="/admin/dashboard/transactions"
          element={<Transactions />}
        />
        <Route exact path="/admin/dashboard/withdrawn" element={<Withdraw />} />
        <Route exact path="/admin/dashboard/deposite" element={<Deposite />} />
        <Route
          exact
          path="/admin/dashboard/subscriptions"
          element={<Subscriptions />}
        />

        <Route exact path="/admin/dashboard/seller" element={<Seller />} />
        <Route
          exact
          path="/admin/dashboard/sellerHistory"
          element={<SellerHistory />}
        />

        <Route
          exact
          path="/admin/dashboard/addBanner"
          element={<AddBanner />}
        />
        <Route
          exact
          path="/admin/dashboard/customEvents"
          element={<CustomEvents />}
        />
        <Route exact path="/admin/dashboard/calender" element={<Calender />} />
        <Route
          exact
          path="/admin/dashboard/feedback"
          element={<AdminFeedback />}
        />
        <Route
          exact
          path="/admin/dashboard/contact-us"
          element={<AdminContactUS />}
        />
        <Route
          exact
          path="/admin/dashboard/privacy-requests"
          element={<PrivacyRequest />}
        />
        <Route exact path="/admin/dashboard/report" element={<Reports />} />
        <Route
          exact
          path="/admin/dashboard/manageUsers"
          element={<ManageUsers />}
        />
        <Route exact path="/admin/dashboard/ourGoodies" element={<Goodies />} />
        <Route
          exact
          path="/admin/dashboard/settings/myAccount"
          element={<MyAccount />}
        />
        <Route
          exact
          path="/admin/dashboard/settings/myNotifications"
          element={<MyNotifications />}
        />

        <Route
          exact
          path="/admin/dashboard/settings/addAdmin"
          element={<AddAdmins />}
        />

        <Route
          exact
          path="/admin/dashboard/utility/adminLogs"
          element={<AdminLogs />}
        />
        <Route
          exact
          path="/admin/dashboard/utility/roadmap"
          element={<Roadmap />}
        />
        <Route
          exact
          path="/admin/dashboard/utility/faq"
          element={<AdminFAQ />}
        />
        <Route
          exact
          path="/admin/dashboard/utility/downloadDataExcel"
          element={<DownloadDataExcel />}
        />

        {/* //------------------------------Page Not Found------------------------------// */}
        <Route path="/pagenotfound" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/pagenotfound" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
