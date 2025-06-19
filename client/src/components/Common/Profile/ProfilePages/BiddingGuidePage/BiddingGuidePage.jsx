import React from 'react';

const BiddingGuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 mt-20">


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - UPDATED */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-400 rounded-lg shadow-xl p-8 mb-8 text-white transform hover:scale-101 transition-transform duration-300">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">Bidding Guide</h1>
          <p className="text-lg text-white mb-6 max-w-2xl">Learn how to participate and win in our online auctions with this comprehensive guide.</p>
          <div className="w-32 h-1 bg-yellow-300 rounded-full"></div>
        </div>

        {/* Video Section - UPDATED */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg shadow-xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Watch: How to Bid
          </h2>
          <div className="aspect-w-16 aspect-h-9 bg-black bg-opacity-30 rounded-lg mb-6 overflow-hidden shadow-2xl border-2 border-indigo-300">
            {/* Placeholder for video */}
            <div className="flex items-center justify-center h-full">
              <img src="/api/placeholder/640/360" alt="Video thumbnail" className="rounded-lg transition-transform duration-300 hover:scale-105" />
              <div className="absolute">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-300 filter drop-shadow-lg transition-transform duration-300 transform hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-indigo-200 italic text-sm ml-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Video: Complete guide to bidding on Auction X
          </p>
        </div>

        {/* Bidding Steps */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-8 border-blue-500">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Bidding Process</h2>
          
          <div className="space-y-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-blue-600">Register an Account</h3>
                <p className="text-gray-700">Create your free account to access all auctions and bidding features. We'll need some basic information and a verification process to ensure security.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-fuchsia-400 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-purple-600">Browse Available Auctions</h3>
                <p className="text-gray-700">Explore our catalog of current and upcoming auctions. Filter by category, price range, or auction end date to find items of interest.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-pink-600">Place Your Bid</h3>
                <p className="text-gray-700">Enter your maximum bid amount. Our system will automatically increase your bid as needed until it reaches your maximum, helping you win at the lowest possible price.</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold">4</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-amber-600">Win and Pay</h3>
                <p className="text-gray-700">If you're the highest bidder when the auction ends, you'll receive a notification. Follow the payment instructions to complete your purchase.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bidding Tips */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-r-8 border-green-500">
          <h2 className="text-2xl font-semibold text-green-600 mb-6">Bidding Tips</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-lg border-2 border-green-300">
              <h3 className="text-xl font-semibold mb-3 text-emerald-600">Set a Budget</h3>
              <p className="text-gray-700">Decide your maximum bid before the auction starts and stick to it. Avoid getting caught in a bidding war that exceeds your budget.</p>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="text-xl font-semibold mb-3 text-cyan-600">Research the Item</h3>
              <p className="text-gray-700">Know the market value of what you're bidding on. Check comparable prices and understand the item's condition.</p>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-100 p-6 rounded-lg border-2 border-purple-300">
              <h3 className="text-xl font-semibold mb-3 text-fuchsia-600">Bid Early</h3>
              <p className="text-gray-700">Place your maximum bid early. Our system will only use what's needed to keep you as the highest bidder.</p>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 p-6 rounded-lg border-2 border-amber-300">
              <h3 className="text-xl font-semibold mb-3 text-amber-600">Watch the Clock</h3>
              <p className="text-gray-700">Be aware of when auctions end. Consider being available during the final minutes for last-minute bidding if needed.</p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-md p-8 border-t-8 border-indigo-500">
          <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-indigo-600">What is proxy bidding?</h3>
              <p className="text-gray-700">Proxy bidding allows you to set your maximum bid amount, and our system will automatically bid the minimum amount needed to keep you as the highest bidder, up to your maximum.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-purple-600">Can I cancel a bid?</h3>
              <p className="text-gray-700">Once placed, bids cannot be canceled. Please ensure you're committed to purchasing before bidding.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-pink-600">Are there any fees for bidding?</h3>
              <p className="text-gray-700">Registration and bidding are free. If you win an auction, a buyer's premium of 10% will be added to your final purchase price.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2 text-rose-600">What happens if I win?</h3>
              <p className="text-gray-700">You'll receive an email notification with payment instructions. Payment is typically required within 48 hours of the auction ending.</p>
            </div>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default BiddingGuidePage;