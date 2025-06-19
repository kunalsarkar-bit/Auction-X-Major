import React, { useState } from 'react';
// Mock hook for demonstration - replace with your actual import
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext";


// Theme Toggle Button Component


// Main Component
const TermsAndCondition = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { currentTheme } = useThemeProvider();
  
  const handleAccept = () => {
    setAcceptedTerms(true);
    alert('Terms and Conditions accepted!');
  };
  
  return (
    <div className={`min-h-screen flex flex-col mt-20 transition-colors ${
      currentTheme === 'dark' ? 'bg-[#191919]' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="bg-purple-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">Auction X</h1>
            <span className="ml-2 text-purple-200 text-sm">Terms and Conditions</span>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`shadow rounded-lg overflow-hidden transition-colors ${
          currentTheme === 'dark' ? 'bg-[#303030]' : 'bg-white'
        }`}>
          {/* Terms Header */}
          <div className={`px-4 py-5 sm:px-6 border-b transition-colors ${
            currentTheme === 'dark' 
              ? 'border-gray-600 bg-[#404040]' 
              : 'border-gray-200 bg-purple-50'
          }`}>
            <h2 className={`text-lg font-medium transition-colors ${
              currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-900'
            }`}>
              Auction X User Agreement
            </h2>
            <p className={`mt-1 text-sm transition-colors ${
              currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Last updated: March 1, 2025
            </p>
          </div>
          
          {/* Terms Content - Scrollable Area */}
          <div className="px-4 py-5 sm:p-6 max-h-96 overflow-y-auto">
            <div className="prose max-w-none">
              <h3 className={`text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                1. Introduction
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Welcome to Auction X. These Terms and Conditions govern your use of our auction platform and services.
                By accessing or using our services, you agree to be bound by these Terms.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                2. Definitions
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                "Auction X", "we", "us" or "our" refers to Auction X, the owner and operator of this auction platform.
                "User", "you", and "your" refers to the person accessing or using our auction services.
                "Service" refers to the website, application, or any other auction service provided by us.
                "Listing" refers to any item or service placed for auction on our platform.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                3. Auction Participation
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                By participating in auctions on our platform, you are making a binding offer to purchase the item at the bid price.
                If you are the winning bidder, you are obligated to complete the purchase of the item. Failure to complete a purchase
                may result in penalties including account suspension.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                4. Eligibility
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                You must be at least 18 years old to use Auction X services. By using our services, you represent and warrant that you are at least 18 years old.
                If you are accessing our services on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                5. User Accounts
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                To participate in auctions, you must create an account. You are responsible for maintaining the confidentiality of your account credentials.
                You are also responsible for all bidding activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                6. Bidding and Payments
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                All bids are binding commitments to purchase items at the bid price. Auction X does not permit retractions of bids except in exceptional circumstances.
                Payment methods accepted include credit/debit cards, PayPal, and bank transfers. All payments must be completed within 48 hours of auction end.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                7. Seller Obligations
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Sellers must accurately describe all items listed for auction. Misrepresentation of items may result in transaction reversal and account penalties.
                Sellers are responsible for shipping items to buyers within 5 business days of receiving payment, unless otherwise specified in the listing.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                8. Fees and Commissions
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Auction X charges sellers a commission on successful sales. The commission rate is based on the final sale price and category of the item.
                Additional listing fees and promotional options may apply. All fees are clearly displayed before listing an item.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                9. Prohibited Items
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Certain items are prohibited from being listed on Auction X, including but not limited to: illegal goods, counterfeit items,
                hazardous materials, human remains, and items that infringe on intellectual property rights. Auction X reserves the right to remove
                any listing that violates these policies.
              </p>
              
              <h3 className={`mt-6 text-lg font-medium transition-colors ${
                currentTheme === 'dark' ? 'text-purple-300' : 'text-purple-700'
              }`}>
                10. Dispute Resolution
              </h3>
              <p className={`mt-2 transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                In the event of a dispute between buyers and sellers, Auction X provides a resolution process. Users agree to attempt to resolve disputes
                through our platform before pursuing external remedies. Auction X may mediate disputes and make final decisions regarding refunds or transaction reversals.
              </p>
            </div>
          </div>
          
          {/* Action Footer */}
          <div className={`px-4 py-4 sm:px-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-colors ${
            currentTheme === 'dark' 
              ? 'bg-[#404040] border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center">
              <input 
                id="accept-terms" 
                name="accept-terms" 
                type="checkbox" 
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              <label htmlFor="accept-terms" className={`ml-2 block text-sm transition-colors ${
                currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-900'
              }`}>
                I have read and agree to the Auction X Terms and Conditions
              </label>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                type="button" 
                className={`w-full sm:w-auto inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors ${
                  currentTheme === 'dark'
                    ? 'border-gray-500 bg-[#404040] text-gray-300 hover:bg-[#505050]'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Decline
              </button>
              <button 
                type="button" 
                className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={!acceptedTerms}
                onClick={handleAccept}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`border-t mt-auto transition-colors ${
        currentTheme === 'dark' 
          ? 'bg-[#303030] border-gray-600' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className={`text-center text-sm transition-colors ${
            currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            &copy; 2025 Auction X. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsAndCondition;