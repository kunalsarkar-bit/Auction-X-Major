import React from 'react';
import { useThemeProvider } from '../../../../AdminDashboard/utils/ThemeContext'; // Adjust path as needed

// Theme Toggle Button
const ThemeToggle = () => {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  
  return (
    <button
      onClick={() => changeCurrentTheme(currentTheme === 'light' ? 'dark' : 'light')}
      className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-white dark:bg-[#303030] border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      {currentTheme === 'light' ? (
        <svg className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
};

const Security = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] mt-20 transition-colors duration-200">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Security at Auction X</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your safety and security are our top priorities
          </p>
        </div>

        {/* Main content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-blue-50 dark:bg-[#303030] rounded-lg p-6 mb-8 border border-blue-100 dark:border-gray-600">
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mt-0">Our Commitment to You</h2>
            <p className="mb-0 text-blue-800 dark:text-blue-200">
              At Auction X, we employ industry-leading security measures to protect your personal information, 
              financial data, and transactions. We continuously monitor and upgrade our systems to stay ahead 
              of emerging threats.
            </p>
          </div>

          {/* How We Protect You Section */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">How We Protect You</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-4">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-0">Secure Transactions</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-0">
                All financial transactions are processed through our secure payment gateway with end-to-end encryption. 
                We never store your complete credit card information on our servers.
              </p>
            </div>

            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-4">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-0">Account Protection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-0">
                We offer multi-factor authentication, account activity monitoring, and suspicious login detection 
                to prevent unauthorized access to your account.
              </p>
            </div>

            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-4">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-0">Privacy Protection</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-0">
                Your personal information is safeguarded with strict access controls. We never sell your data to third parties 
                and only share information when necessary to complete transactions.
              </p>
            </div>

            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-full p-2 mr-4">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-0">Fraud Prevention</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-0">
                Our dedicated fraud detection team uses advanced algorithms to identify and prevent suspicious activities, 
                protecting both buyers and sellers from scams.
              </p>
            </div>
          </div>

          {/* Buyer & Seller Protection */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Buyer & Seller Protection</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-3 mb-4">For Buyers</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Money-back guarantee for items not as described</li>
                <li>Secure escrow payment options for high-value items</li>
                <li>Verified seller ratings and review system</li>
                <li>24/7 support for transaction issues</li>
                <li>In-platform messaging to keep communication secure</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-3 mb-4">For Sellers</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Protection against fraudulent payments</li>
                <li>Verified buyer profiles and payment methods</li>
                <li>Dispute resolution services</li>
                <li>Tools to verify buyer identity for high-value items</li>
                <li>Shipping protection and tracking integration</li>
              </ul>
            </div>
          </div>

          {/* Security Tips */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Security Best Practices</h2>
          
          <div className="bg-yellow-50 dark:bg-[#303030] rounded-lg p-6 mb-8 border border-yellow-100 dark:border-yellow-600">
            <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-300 mt-0 mb-4">Tips to Keep Your Account Secure</h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-0">Use a strong, unique password for your Auction X account</p>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-0">Enable two-factor authentication for an additional layer of security</p>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-0">Never share your login credentials or verification codes</p>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-0">Keep your devices and browsers updated with the latest security patches</p>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mr-3">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-0">Be cautious of phishing attempts - we will never ask for your password via email or phone</p>
              </div>
            </div>
          </div>

          {/* Report Security Issues */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Report Security Issues</h2>
          
          <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-600 mb-8">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Have you noticed something suspicious? We take all security concerns seriously.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-[#191919] p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Contact Our Security Team</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Email us directly at:</p>
                <a href="mailto:security@auctionx.com" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  security@auctionx.com
                </a>
              </div>
              
              <div className="bg-gray-50 dark:bg-[#191919] p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Bug Bounty Program</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-3">Help us improve our security:</p>
                <a href="#" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  View Bug Bounty Program
                </a>
              </div>
            </div>
          </div>

          {/* Security Certifications */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Our Security Certifications</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <svg className="h-8 w-8 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">PCI DSS Compliant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Payment Card Industry Data Security Standard</p>
            </div>
            
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <svg className="h-8 w-8 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">SOC 2 Certified</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Service Organization Control 2</p>
            </div>
            
            <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <svg className="h-8 w-8 text-gray-500 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">GDPR Compliant</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">General Data Protection Regulation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;