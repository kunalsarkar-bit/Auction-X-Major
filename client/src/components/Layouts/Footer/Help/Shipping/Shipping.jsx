import React, { useState, useContext } from 'react';
import { useThemeProvider } from "../../../../AdminDashboard/utils/ThemeContext";

const Shipping = () => {
  // Sample data for shipping rates
  const shippingRates = [
    { destination: "United States", standard: "$8.99", express: "$19.99", delivery: "3-5 business days" },
    { destination: "Canada", standard: "$12.99", express: "$24.99", delivery: "5-7 business days" },
    { destination: "Europe", standard: "$15.99", express: "$29.99", delivery: "7-10 business days" },
    { destination: "Asia", standard: "$18.99", express: "$34.99", delivery: "10-14 business days" },
    { destination: "Australia", standard: "$19.99", express: "$39.99", delivery: "10-14 business days" },
    { destination: "Rest of World", standard: "$24.99", express: "$49.99", delivery: "12-15 business days" }
  ];

  // FAQ data
  const faqItems = [
    {
      question: "How do I track my package?",
      answer: "You'll receive a tracking number via email once your item ships. You can use this number on our website or the carrier's website to track your package in real-time."
    },
    {
      question: "What if my item arrives damaged?",
      answer: "If your item arrives damaged, please take photos and contact our customer service within 48 hours of delivery. We'll process a replacement or refund as quickly as possible."
    },
    {
      question: "Do you offer free shipping?",
      answer: "We offer free standard shipping on orders over $100 for domestic customers and over $250 for international customers."
    },
    {
      question: "Can I change my shipping address after ordering?",
      answer: "Address changes can be made if the order has not yet shipped. Please contact customer service immediately with your order number and the new shipping address."
    }
  ];

  // State to track which FAQ items are open
  const [openFaqItems, setOpenFaqItems] = useState({});
  const { currentTheme } = useThemeProvider();

  // Toggle FAQ item
  const toggleFaq = (index) => {
    setOpenFaqItems({
      ...openFaqItems,
      [index]: !openFaqItems[index]
    });
  };

  // Dark mode classes
  const darkModeClasses = {
    bg: currentTheme === 'dark' ? 'bg-[#191919]' : 'bg-white',
    containerBg: currentTheme === 'dark' ? 'bg-[#303030]' : 'bg-white',
    textPrimary: currentTheme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    border: currentTheme === 'dark' ? 'border-gray-600' : 'border-gray-200',
    cardBg: currentTheme === 'dark' ? 'bg-[#404040]' : 'bg-white',
    tableHeaderBg: currentTheme === 'dark' ? 'bg-blue-700' : 'bg-blue-600',
    tableRowBg: currentTheme === 'dark' ? 'bg-[#404040]' : 'bg-white',
    tableRowAltBg: currentTheme === 'dark' ? 'bg-[#303030]' : 'bg-gray-50',
    faqHeaderBg: currentTheme === 'dark' ? 'bg-[#404040]' : 'bg-gray-100',
    faqContentBg: currentTheme === 'dark' ? 'bg-[#303030]' : 'bg-white'
  };

  return (
    <div className={`${darkModeClasses.bg} ${darkModeClasses.textPrimary} font-sans mt-20`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-rose-500 mb-3">Shipping Information</h1>
          <p className={`text-xl ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>Everything you need to know about our shipping process</p>
        </header>
        
        {/* Info Cards Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Shipping Process Card */}
          <div className={`${darkModeClasses.cardBg} rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 border-t-4 border-rose-500`}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center text-2xl mr-4">
                  📦
                </div>
                <h3 className={`text-xl font-semibold ${darkModeClasses.textPrimary}`}>Shipping Process</h3>
              </div>
              <div className={darkModeClasses.textSecondary}>
                <p className="mb-2">All items are carefully packed and shipped within 2 business days after payment confirmation.</p>
                <p className="mb-2">We use reliable carriers to ensure your items arrive safely and on time.</p>
                <p>You'll receive a tracking number as soon as your item ships.</p>
              </div>
            </div>
          </div>
          
          {/* Delivery Areas Card */}
          <div className={`${darkModeClasses.cardBg} rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 border-t-4 border-blue-600`}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mr-4">
                  🌎
                </div>
                <h3 className={`text-xl font-semibold ${darkModeClasses.textPrimary}`}>Delivery Areas</h3>
              </div>
              <div className={darkModeClasses.textSecondary}>
                <p className="mb-2">We ship worldwide to over 100 countries. Standard delivery times:</p>
                <ul className="list-inside mb-2">
                  <li className="mb-1">Domestic: 3-5 business days</li>
                  <li className="mb-1">Europe: 7-10 business days</li>
                  <li className="mb-1">International: 10-15 business days</li>
                </ul>
                <p>Express shipping options available at checkout.</p>
              </div>
            </div>
          </div>
          
          {/* Protection & Insurance Card */}
          <div className={`${darkModeClasses.cardBg} rounded-xl shadow-lg transition-transform duration-300 hover:-translate-y-1 border-t-4 border-emerald-500`}>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl mr-4">
                  🛡️
                </div>
                <h3 className={`text-xl font-semibold ${darkModeClasses.textPrimary}`}>Protection & Insurance</h3>
              </div>
              <div className={darkModeClasses.textSecondary}>
                <p className="mb-2">All shipments include basic insurance coverage up to $100.</p>
                <p className="mb-2">Additional insurance options available for high-value items.</p>
                <p>Items are securely packaged to prevent damage during transit.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Shipping Rates Section */}
        <section className="mb-16">
          <h2 className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'} text-center mb-6`}>Shipping Rates</h2>
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full">
              <thead>
                <tr className={`${darkModeClasses.tableHeaderBg} text-white`}>
                  <th className="py-4 px-6 text-left">Destination</th>
                  <th className="py-4 px-6 text-left">Standard Shipping</th>
                  <th className="py-4 px-6 text-left">Express Shipping</th>
                  <th className="py-4 px-6 text-left">Estimated Delivery</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, index) => (
                  <tr 
                    key={index} 
                    className={`border-b ${darkModeClasses.border} ${
                      index % 2 === 0 ? darkModeClasses.tableRowBg : darkModeClasses.tableRowAltBg
                    }`}
                  >
                    <td className="py-4 px-6">{rate.destination}</td>
                    <td className="py-4 px-6">{rate.standard}</td>
                    <td className="py-4 px-6">{rate.express}</td>
                    <td className="py-4 px-6">{rate.delivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        
        {/* Shipping Images Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { src: "https://xpsship.com/wp-content/uploads/2024/10/Small-Business-Owner-Creating-Shipping-Labels-for-UPS-USPS-and-FedEx-at-a-Table-with-Shipping-Supplies-1080x669.webp", alt: "Careful packaging process", text: "Careful packaging process" },
            { src: "https://onpoint.in/News/wp-content/uploads/2023/08/5-Key-Differences.jpg", alt: "International shipping", text: "International shipping" },
            { src: "https://static.vecteezy.com/system/resources/thumbnails/054/690/701/small/packages-stacked-in-a-warehouse-aisle-ready-for-shipment-and-distribution-free-photo.jpeg", alt: "Secure delivery", text: "Secure delivery" },
            { src: "https://startupsmagazine.co.uk/sites/default/files/2022-03/AdobeStock_270177382.jpg", alt: "Package tracking", text: "Package tracking" }
          ].map((image, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden h-48 group">
              <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-blue-600 bg-opacity-70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-center p-4">
                {image.text}
              </div>
            </div>
          ))}
        </section>
        
        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-emerald-500 text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className={`border ${darkModeClasses.border} rounded-xl overflow-hidden shadow-md`}>
                <div 
                  className={`${darkModeClasses.faqHeaderBg} px-6 py-4 cursor-pointer flex justify-between items-center`}
                  onClick={() => toggleFaq(index)}
                >
                  <span className={`font-semibold ${darkModeClasses.textPrimary}`}>{faq.question}</span>
                  <span className="text-blue-600 text-2xl">{openFaqItems[index] ? '-' : '+'}</span>
                </div>
                <div 
                  className={`px-6 ${darkModeClasses.faqContentBg} transition-all duration-300 overflow-hidden ${
                    openFaqItems[index] ? 'py-4 max-h-40' : 'py-0 max-h-0'
                  }`}
                >
                  <p className={darkModeClasses.textSecondary}>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Contact Section */}
        <section className={`mb-16 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-8 text-white text-center ${
          currentTheme === 'dark' ? 'shadow-lg' : ''
        }`}>
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="max-w-2xl mx-auto mb-6">Our customer service team is available to answer any questions about shipping and delivery. We're here to ensure your items arrive safely and on time.</p>
          <a href="#" className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:-translate-y-1 transition-transform duration-300 hover:shadow-lg">Contact Support</a>
        </section>
      </div>
    </div>
  );
};

export default Shipping;