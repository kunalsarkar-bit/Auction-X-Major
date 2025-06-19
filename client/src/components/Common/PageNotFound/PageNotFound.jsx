import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left visual section */}
        <div className="md:w-2/5 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 flex flex-col justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <span className="ml-3 text-white font-semibold text-xl">Auction X</span>
          </div>
          
          <div className="mt-8 md:mt-0">
            <h1 className="text-white text-7xl md:text-8xl font-bold">404</h1>
            <div className="h-1 w-16 bg-white bg-opacity-50 rounded mt-6"></div>
          </div>
          
          <div className="mt-8 md:mt-0 text-white text-opacity-80 text-sm">
            © {new Date().getFullYear()} Auction X
            <br />All rights reserved
          </div>
        </div>
        
        {/* Right content section */}
        <div className="md:w-3/5 p-8 md:p-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Page Not Found</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              We couldn't find the page you're looking for. The item may have been sold, removed, or might not exist. Please check the URL or try one of the options below.
            </p>
            
            <div className="mt-8 space-y-4">
              <button 
                onClick={() => navigate('/')} 
                className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
              >
                Return to Homepage
              </button>
              
              <button 
                onClick={() => navigate('/auctions')} 
                className="w-full py-3 px-6 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
              >
                Browse Active Auctions
              </button>
              
              <button 
                onClick={() => navigate('/search')} 
                className="w-full py-3 px-6 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow flex items-center justify-center"
              >
                Search Catalog
              </button>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="flex items-center text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="ml-2">Need help? Contact our <a href="/support" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">support team</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;