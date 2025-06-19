import React, { useState, useEffect } from 'react';
import { Plus, X, Send, Users, Gavel, Clock, Mail, Phone, Calendar, DollarSign, Eye, TrendingUp } from 'lucide-react';

const CustomAuctionPage = () => {
  const [currentStep, setCurrentStep] = useState('create'); // create, invite, monitor
  const [product, setProduct] = useState({
    name: '',
    description: '',
    sellerEmail: '',
    image: '',
    mobileNumber: '',
    biddingStartDate: '',
    biddingStartTime: '',
    biddingStartPrice: ''
  });
  
  const [inviteEmails, setInviteEmails] = useState(['']);
  const [bids, setBids] = useState([]);
  const [currentBid, setCurrentBid] = useState('');
  const [auctionActive, setAuctionActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour demo

  // Demo bidders for simulation
  const demoBidders = [
    { name: 'John Smith', email: 'john@email.com', avatar: 'JS' },
    { name: 'Sarah Johnson', email: 'sarah@email.com', avatar: 'SJ' },
    { name: 'Mike Wilson', email: 'mike@email.com', avatar: 'MW' },
    { name: 'Emily Davis', email: 'emily@email.com', avatar: 'ED' }
  ];

  // Simulate timer countdown
  useEffect(() => {
    if (auctionActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [auctionActive, timeRemaining]);

  // Auto-generate demo bids
  useEffect(() => {
    if (auctionActive) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance every 5 seconds
          const randomBidder = demoBidders[Math.floor(Math.random() * demoBidders.length)];
          const lastBid = bids.length > 0 ? bids[bids.length - 1].amount : parseFloat(product.biddingStartPrice);
          const newBid = lastBid + Math.floor(Math.random() * 50) + 10;
          
          setBids(prev => [...prev, {
            id: Date.now(),
            bidder: randomBidder,
            amount: newBid,
            timestamp: new Date().toLocaleTimeString()
          }]);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [auctionActive, bids, product.biddingStartPrice]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProductSubmit = () => {
    if (product.name && product.description && product.sellerEmail && product.biddingStartPrice) {
      setCurrentStep('invite');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProduct(prev => ({ ...prev, image: e.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const removeEmailField = (index) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index, value) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const sendInvites = () => {
    const validEmails = inviteEmails.filter(email => email.trim() !== '');
    if (validEmails.length > 0) {
      // Simulate sending emails
      alert(`Invites sent to ${validEmails.length} bidders!`);
      setCurrentStep('monitor');
      setAuctionActive(true);
    }
  };

  const placeBid = () => {
    const amount = parseFloat(currentBid);
    const lastBid = bids.length > 0 ? bids[bids.length - 1].amount : parseFloat(product.biddingStartPrice);
    
    if (amount > lastBid) {
      setBids(prev => [...prev, {
        id: Date.now(),
        bidder: { name: 'You', email: product.sellerEmail, avatar: 'YU' },
        amount: amount,
        timestamp: new Date().toLocaleTimeString()
      }]);
      setCurrentBid('');
    }
  };

  const getCurrentPrice = () => {
    return bids.length > 0 ? bids[bids.length - 1].amount : parseFloat(product.biddingStartPrice) || 0;
  };

  if (currentStep === 'create') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#191919] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create Your Auction</h1>
              <p className="text-gray-500 dark:text-gray-400">Set up your product for bidding</p>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      <Gavel className="inline w-4 h-4 mr-2" />
                      Product Name
                    </label>
                    <input
                      type="text"
                      required
                      value={product.name}
                      onChange={(e) => setProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Seller Email
                    </label>
                    <input
                      type="email"
                      required
                      value={product.sellerEmail}
                      onChange={(e) => setProduct(prev => ({ ...prev, sellerEmail: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={product.mobileNumber}
                      onChange={(e) => setProduct(prev => ({ ...prev, mobileNumber: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                      <DollarSign className="inline w-4 h-4 mr-2" />
                      Starting Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={product.biddingStartPrice}
                      onChange={(e) => setProduct(prev => ({ ...prev, biddingStartPrice: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Product Description</label>
                    <textarea
                      required
                      rows={4}
                      value={product.description}
                      onChange={(e) => setProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe your product in detail..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Product Image</label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors relative">
                      {product.image ? (
                        <img src={product.image} alt="Product" className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <div className="text-gray-500 dark:text-gray-400">
                          <Plus className="w-12 h-12 mx-auto mb-2" />
                          <p>Click to upload image</p>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        <Calendar className="inline w-4 h-4 mr-2" />
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={product.biddingStartDate}
                        onChange={(e) => setProduct(prev => ({ ...prev, biddingStartDate: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                        <Clock className="inline w-4 h-4 mr-2" />
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={product.biddingStartTime}
                        onChange={(e) => setProduct(prev => ({ ...prev, biddingStartTime: e.target.value }))}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProductSubmit}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Create Auction
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'invite') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#191919] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-600">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Invite Bidders</h1>
              <p className="text-gray-500 dark:text-gray-400">Send invitations to potential bidders</p>
            </div>

            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Product Summary</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Name:</strong> {product.name}</p>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Starting Price:</strong> ${product.biddingStartPrice}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Date:</strong> {product.biddingStartDate}</p>
                  <p className="text-gray-600 dark:text-gray-300"><strong>Time:</strong> {product.biddingStartTime}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  <Users className="inline w-5 h-5 mr-2" />
                  Bidder Email Addresses
                </h3>
                <button
                  onClick={addEmailField}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Email
                </button>
              </div>

              {inviteEmails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="bidder@email.com"
                    className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {inviteEmails.length > 1 && (
                    <button
                      onClick={() => removeEmailField(index)}
                      className="bg-red-600 text-white px-3 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setCurrentStep('create')}
                className="flex-1 bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white py-4 px-6 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={sendInvites}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg flex items-center justify-center"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Invitations
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Info */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-600 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
              {product.image && (
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Seller:</strong> {product.sellerEmail}</p>
                <p><strong>Phone:</strong> {product.mobileNumber}</p>
                <p><strong>Start Date:</strong> {product.biddingStartDate}</p>
                <p><strong>Start Time:</strong> {product.biddingStartTime}</p>
              </div>
            </div>

            {/* Auction Status */}
            <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Auction Status</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Time Remaining</p>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${getCurrentPrice().toFixed(2)}
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Current Bid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#303030] rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-600 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  <TrendingUp className="inline w-6 h-6 mr-2" />
                  Live Bidding
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">LIVE</span>
                </div>
              </div>

              {/* Place Bid */}
              <div className="flex gap-4 mb-6">
                <input
                  type="number"
                  value={currentBid}
                  onChange={(e) => setCurrentBid(e.target.value)}
                  placeholder={`Minimum: $${(getCurrentPrice() + 1).toFixed(2)}`}
                  min={getCurrentPrice() + 1}
                  step="0.01"
                  className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={placeBid}
                  disabled={!currentBid || parseFloat(currentBid) <= getCurrentPrice()}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Place Bid
                </button>
              </div>

              {/* Bid History */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-[#303030] pb-2">
                  <Eye className="inline w-5 h-5 mr-2" />
                  Bid History ({bids.length})
                </h3>
                {bids.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Gavel className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No bids yet. Be the first to bid!</p>
                  </div>
                ) : (
                  bids.slice().reverse().map((bid, index) => (
                    <div key={bid.id} className={`p-4 rounded-lg border-l-4 ${
                      index === 0 ? 'bg-green-50 dark:bg-green-900 border-green-500' : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            index === 0 ? 'bg-green-600' : 'bg-gray-600'
                          }`}>
                            {bid.bidder.avatar}
                          </div>
                          <div>
                            <p className="text-gray-900 dark:text-white font-semibold">{bid.bidder.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">{bid.timestamp}</p>
                          </div>
                        </div>
                        <div className={`text-right ${index === 0 ? 'text-green-400' : 'text-gray-900 dark:text-white'}`}>
                          <div className="text-xl font-bold">${bid.amount.toFixed(2)}</div>
                          {index === 0 && <div className="text-sm text-green-400">Highest Bid</div>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAuctionPage;