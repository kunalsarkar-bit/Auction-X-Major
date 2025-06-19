import React from 'react';

const ScheduledBids = () => {
  const scheduledProducts = [
    {
      id: 1,
      name: 'Vintage Rolex Watch',
      description: 'A classic vintage Rolex watch in excellent condition.',
      image: 'data:image/jpeg;base64,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',
      bidTime: '2023-10-15T14:00:00',
      price: '$5,000',
    },
    {
      id: 2,
      name: 'Antique Persian Rug',
      description: 'Handwoven Persian rug with intricate designs.',
      image: 'https://via.placeholder.com/150',
      bidTime: '2023-10-16T10:00:00',
      price: '$3,200',
    },
    {
      id: 3,
      name: 'Rare Picasso Painting',
      description: 'An original painting by Pablo Picasso.',
      image: 'https://via.placeholder.com/150',
      bidTime: '2023-10-17T18:00:00',
      price: '$1,200,000',
    },
  ];

  const handleViewItem = (productId) => {
    alert(`Viewing product with ID: ${productId}`);
    // You can replace this with a navigation to a detailed product page
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Scheduled Bids</h1>
        <div className="space-y-6">
          {scheduledProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-6"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-sm text-gray-500">
                  Bid Time: {new Date(product.bidTime).toLocaleString()}
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  Price: {product.price}
                </p>
              </div>
              <button
                onClick={() => handleViewItem(product.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                View Item
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScheduledBids;