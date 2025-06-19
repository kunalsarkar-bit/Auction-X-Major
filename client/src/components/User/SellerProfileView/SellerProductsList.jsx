import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Add this import

const SellerProductsList = ({ sellerEmail, currentProductId }) => {
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize navigate
const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/products/email/${sellerEmail}`);
        const products = Array.isArray(response.data.products) ? response.data.products : [];
        setSellerProducts(products.filter(product => 
          product.status === "Active" && product._id !== currentProductId
        ));
      } catch (err) {
        setError(err.message || 'Failed to fetch seller products');
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, [sellerEmail, currentProductId]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product page
  };

  const renderStars = (rating) => {
    // ... (keep your existing renderStars function)
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Other Items from This Seller</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing active listings from this seller
        </div>
      </div>

      {sellerProducts.length > 0 ? (
        <div className="grid gap-6">
          {sellerProducts.map((product) => (
            <div 
              key={product._id} 
              onClick={() => handleProductClick(product._id)} // Add onClick handler
              className="bg-gray-50 dark:bg-[#303030] rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" // Add cursor-pointer and hover effect
            >
              <div className="flex items-center gap-4">
                {product.images && product.images.length > 0 && (
                  <img
                    src={product.images[0].secure_url}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        ${product.biddingStartPrice.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Category:</span>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {product.category}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Ends:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(product.biddingEndTime).toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Views:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.viewCount}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>Listed on {new Date(product.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <span>Rating:</span>
                      <div className="flex">
                        {renderStars(product.avgRating || 0)}
                        <span className="ml-1">({product.totalRatings || 0})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">This seller has no other active listings.</p>
        </div>
      )}
    </div>
  );
};

export default SellerProductsList;