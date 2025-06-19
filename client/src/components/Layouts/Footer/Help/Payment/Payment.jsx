
import React, { useState } from 'react';

const Payment = () => {
  const [activeTab, setActiveTab] = useState('methods');
  const [activeAccordion, setActiveAccordion] = useState('');

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? '' : id);
  };

  return (
<div className="min-h-screen bg-white dark:bg-[#191919] mt-20">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Payment Information</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to know about payments at Auction X
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'methods'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Payment Methods
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'process'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Payment Process
            </button>
            <button
              onClick={() => setActiveTab('deposits')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'deposits'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              Deposits & Withdrawals
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === 'faq'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
            >
              FAQs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-12">
          {/* Payment Methods Tab */}
          {activeTab === 'methods' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Accepted Payment Methods</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Credit/Debit Cards */}
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Credit & Debit Cards</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">We accept all major credit and debit cards for secure payments.</p>
                  <div className="flex space-x-3">
                    <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">VISA</div>
                    <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">MC</div>
                    <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">AMEX</div>
                    <div className="h-8 w-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">DISC</div>
                  </div>
                </div>

                {/* Digital Wallets */}
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Digital Wallets</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Pay quickly and securely with your preferred digital wallet.</p>
                  <div className="flex space-x-3">
                    <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">PayPal</div>
                    <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">Apple Pay</div>
                    <div className="h-8 w-20 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs">Google Pay</div>
                  </div>
                </div>

                {/* Bank Transfer */}
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bank Transfers</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Direct bank transfers available for larger purchases. Processing time is typically 1-3 business days.</p>
                </div>

                {/* Escrow */}
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Escrow Service</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Available for high-value transactions. Funds are held securely until both parties confirm successful transaction.</p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#303030] rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Currency Information</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All transactions on Auction X are processed in USD. If you're using a different currency, 
                  your payment provider will convert using their current exchange rate.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">USD (Default)</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">EUR</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">GBP</div>
                  <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-300">CAD</div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-4">Payment Security</h3>
                <p className="text-blue-700 dark:text-blue-200 mb-3">
                  All payments are securely processed with industry-standard encryption and security protocols.
                  We never store your complete payment information on our servers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800 dark:text-gray-200">PCI DSS Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800 dark:text-gray-200">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800 dark:text-gray-200">Fraud Protection</span>
                  </div>
                </div>
              </div>
            </div>
          )}
    

          {/* Payment Process Tab */}
          {activeTab === 'process' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Payment Process</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">How Payments Work at Auction X</h3>
                
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>
                  
                  <div className="space-y-6">
                    {/* Step 1 */}
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium">1</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Winning Bid or Purchase</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">When you win an auction or make a direct purchase, you'll receive a payment notification via email and on your account dashboard.</p>
                      </div>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium">2</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Payment Checkout</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">You'll be directed to our secure checkout page where you can select your preferred payment method and complete the transaction.</p>
                      </div>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium">3</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Payment Verification</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Our system verifies your payment. This typically happens instantly, but may take longer for bank transfers or certain payment methods.</p>
                      </div>
                    </div>
                    
                    {/* Step 4 */}
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium">4</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Seller Notification</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">The seller is notified of your payment and will prepare your item for shipment. For escrow services, funds are held until you confirm receipt.</p>
                      </div>
                    </div>
                    
                    {/* Step 5 */}
                    <div className="relative flex items-start">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white font-medium">5</div>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">Transaction Complete</h4>
                        <p className="mt-1 text-gray-600 dark:text-gray-300">Once payment is confirmed, the transaction is marked as complete. You'll receive a receipt and order confirmation via email.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">For Buyers</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Payment is due within 48 hours of winning an auction</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>For Buy It Now items, payment is processed immediately</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Transaction fees are included in the final price shown</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Payment receipts are available in your account history</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white dark:bg-[#303030] rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">For Sellers</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Funds are held for 24 hours after buyer payment</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Selling fees are deducted automatically from final sale</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Payment can be withdrawn to your bank or kept as credit</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>For escrow, payment is released after buyer confirms receipt</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 border border-yellow-100 dark:border-yellow-800 mb-8">
                <h3 className="text-lg font-medium text-yellow-900 dark:text-yellow-100 mb-4">Payment Processing Times</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white dark:bg-[#303030]">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</th>
                        <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Processing Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Credit/Debit Cards</td>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Instant</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">PayPal</td>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Instant</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Apple Pay / Google Pay</td>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Instant</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">Bank Transfer</td>
                        <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100">1-3 business days</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Escrow Service</td>
                        <td className="py-2 px-4 text-sm text-gray-900 dark:text-gray-100">Varies (funds held until delivery confirmation)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          {/* Deposits & Withdrawals Tab */}
          {activeTab === 'deposits' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Deposits & Withdrawals</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-green-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Depositing Funds</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Adding funds to your Auction X account is quick and easy. Pre-fund your account to make faster purchases.
                  </p>
                  
                  <ul className="space-y-3 text-gray-600 mb-4">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No minimum deposit amount</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Funds are available immediately for most payment methods</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Deposits can be made via credit/debit cards, PayPal, or bank transfer</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="mr-4 bg-blue-100 p-3 rounded-full">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Withdrawing Funds</h3>
                  </div>

                  <p className="text-gray-600 mb-4">
                    Withdraw your earnings or unused funds from your Auction X account to your bank account or PayPal.
                  </p>

                  <ul className="space-y-3 text-gray-600 mb-4">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Minimum withdrawal amount: $10</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Withdrawals typically take 1-3 business days to process</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>No fees for withdrawals to PayPal</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Bank transfers may incur a small fee depending on your bank</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Limits</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">Transaction Type</th>
                        <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-medium text-gray-700">Limit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">Daily Deposit Limit</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">$10,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">Daily Withdrawal Limit</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">$5,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">Monthly Deposit Limit</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">$50,000</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">Monthly Withdrawal Limit</td>
                        <td className="py-2 px-4 border-b border-gray-200 text-sm">$25,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                <h3 className="text-lg font-medium text-blue-900 mb-4">Security Measures</h3>
                <p className="text-blue-700 mb-3">
                  All deposits and withdrawals are protected by advanced security measures to ensure your funds are safe.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">Two-Factor Authentication (2FA)</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">Encrypted Transactions</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800">Fraud Monitoring</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faq' && (
            <div>
<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {/* FAQ Item 1 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleAccordion('faq1')}
                    className="w-full flex justify-between items-center p-6 focus:outline-none"
                  >
                    <span className="text-lg font-medium text-gray-900">What payment methods do you accept?</span>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        activeAccordion === 'faq1' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === 'faq1' && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">
                        We accept all major credit and debit cards, PayPal, Apple Pay, Google Pay, and bank transfers. For high-value transactions, we also offer escrow services.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 2 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleAccordion('faq2')}
                    className="w-full flex justify-between items-center p-6 focus:outline-none"
                  >
                    <span className="text-lg font-medium text-gray-900">Are there any fees for using Auction X?</span>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        activeAccordion === 'faq2' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === 'faq2' && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">
                        There are no additional fees for buyers. Sellers are charged a small commission fee based on the final sale price of their item.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 3 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleAccordion('faq3')}
                    className="w-full flex justify-between items-center p-6 focus:outline-none"
                  >
                    <span className="text-lg font-medium text-gray-900">How do I withdraw my earnings?</span>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        activeAccordion === 'faq3' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === 'faq3' && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">
                        You can withdraw your earnings to your bank account or PayPal. Simply go to your account settings, select "Withdraw Funds," and follow the instructions.
                      </p>
                    </div>
                  )}
                </div>

                {/* FAQ Item 4 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <button
                    onClick={() => toggleAccordion('faq4')}
                    className="w-full flex justify-between items-center p-6 focus:outline-none"
                  >
                    <span className="text-lg font-medium text-gray-900">Is my payment information secure?</span>
                    <svg
                      className={`h-6 w-6 transform transition-transform ${
                        activeAccordion === 'faq4' ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {activeAccordion === 'faq4' && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">
                        Yes, we use industry-standard encryption and security protocols to protect your payment information. We never store your complete payment details on our servers.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;