import { useState, useEffect } from 'react';
import { useThemeProvider } from '../../../utils/ThemeContext';
import { 
  Moon, 
  Sun, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  List, 
  Grid, 
  Search,
  Plus
} from 'lucide-react';
import AddProductForm from './SellGoodiesPage';
// Demo API data
const fetchProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          name: 'Premium Gaming Headset', 
          details: 'Noise cancelling with surround sound',
          price: 129.99, 
          stock: 24, 
          sold: 156,
          image: '/api/placeholder/80/80',
          category: 'headsets',
          trend: 'up'
        },
        { 
          id: 2, 
          name: 'Wireless Earbuds Pro', 
          details: 'True wireless with 24hr battery life',
          price: 89.99, 
          stock: 35, 
          sold: 211,
          image: '/api/placeholder/80/80',
          category: 'headsets',
          trend: 'up'
        },
        { 
          id: 3, 
          name: 'Developer Tee - JavaScript', 
          details: 'Cotton blend, unisex sizing',
          price: 24.99, 
          stock: 48, 
          sold: 87,
          image: '/api/placeholder/80/80',
          category: 'shirts',
          trend: 'down'
        },
        { 
          id: 4, 
          name: 'Limited Edition Hoodie', 
          details: 'Heavy cotton with embroidered logo',
          price: 49.99, 
          stock: 17, 
          sold: 62,
          image: '/api/placeholder/80/80',
          category: 'shirts',
          trend: 'stable'
        },
        { 
          id: 5, 
          name: 'Studio Headphones', 
          details: 'Professional grade audio quality',
          price: 199.99, 
          stock: 8, 
          sold: 42,
          image: '/api/placeholder/80/80',
          category: 'headsets',
          trend: 'up'
        },
        { 
          id: 6, 
          name: 'Gaming Team Jersey', 
          details: 'Official team merchandise, performance fabric',
          price: 59.99, 
          stock: 21, 
          sold: 38,
          image: '/api/placeholder/80/80',
          category: 'shirts',
          trend: 'down'
        }
      ]);
    }, 500);
  });
};

const fetchSalesData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalSales: 38642.50,
        totalItems: 596,
        categorySales: {
          headsets: 27419.82,
          shirts: 11222.68
        },
        recentSales: [
          { date: '2025-04-07', amount: 1249.95, items: 12 },
          { date: '2025-04-06', amount: 879.92, items: 8 },
          { date: '2025-04-05', amount: 1599.84, items: 14 },
          { date: '2025-04-04', amount: 1079.93, items: 10 },
          { date: '2025-04-03', amount: 1399.91, items: 13 }
        ]
      });
    }, 700);
  });
};

// Card components
const StatCard = ({ title, value, icon, trend }) => {
  const { currentTheme } = useThemeProvider();
  
  return (
    <div className={`p-6 rounded-lg shadow-md ${currentTheme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${trend === 'up' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : trend === 'down' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <>
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-sm text-green-500">4.3% increase</span>
            </>
          ) : (
            <>
              <TrendingDown size={16} className="text-red-500 mr-1" />
              <span className="text-sm text-red-500">2.1% decrease</span>
            </>
          )}
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard() {
  const { currentTheme, changeCurrentTheme } = useThemeProvider();
  const [products, setProducts] = useState([]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sold');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [productsData, sales] = await Promise.all([
          fetchProducts(),
          fetchSalesData()
        ]);
        setProducts(productsData);
        setSalesData(sales);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const filteredProducts = products
    .filter(product => {
      if (filter === 'all') return true;
      return product.category === filter;
    })
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.details.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] - b[sortBy];
      } else {
        return b[sortBy] - a[sortBy];
      }
    });

  const topSellingProduct = products.length ? 
    products.reduce((prev, current) => (prev.sold > current.sold) ? prev : current) : 
    null;

  const lowestSellingProduct = products.length ? 
    products.reduce((prev, current) => (prev.sold < current.sold) ? prev : current) : 
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pb-16">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="ml-2 text-xl font-bold">GoodyGoods Admin</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => changeCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {currentTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Product Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage your exclusive products</p>
          </div>
          <div className="mt-4 md:mt-0">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
                onClick={() => setShowAddForm(true)} // Add this onClick handler
              >
                <Plus size={18} className="mr-1" />
                Add New Product
              </button>
            </div>
            {showAddForm && (
              <AddProductForm onClose={() => setShowAddForm(false)} />
            )}
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Sales" 
            value={`$${salesData.totalSales.toLocaleString()}`} 
            icon={<ShoppingBag size={24} />}
            trend="up"
          />
          <StatCard 
            title="Items Sold" 
            value={salesData.totalItems} 
            icon={<Package size={24} />}
            trend="up"
          />
          <StatCard 
            title="Headsets Revenue" 
            value={`$${salesData.categorySales.headsets.toLocaleString()}`} 
            icon={<PieChart size={24} />}
            trend="up"
          />
          <StatCard 
            title="Apparel Revenue" 
            value={`$${salesData.categorySales.shirts.toLocaleString()}`} 
            icon={<PieChart size={24} />}
            trend="down"
          />
        </div>

        {/* Top/Low performing products */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topSellingProduct && (
            <div className={`p-6 rounded-lg shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp size={20} className="text-green-500 mr-2" />
                Top Selling Product
              </h3>
              <div className="flex">
                <img 
                  src={topSellingProduct.image} 
                  alt={topSellingProduct.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg">{topSellingProduct.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{topSellingProduct.details}</p>
                  <div className="mt-2 flex items-center">
                    <span className="font-bold">${topSellingProduct.price}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-green-500 font-medium">{topSellingProduct.sold} sold</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {lowestSellingProduct && (
            <div className={`p-6 rounded-lg shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingDown size={20} className="text-red-500 mr-2" />
                Lowest Selling Product
              </h3>
              <div className="flex">
                <img 
                  src={lowestSellingProduct.image} 
                  alt={lowestSellingProduct.name}
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-lg">{lowestSellingProduct.name}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{lowestSellingProduct.details}</p>
                  <div className="mt-2 flex items-center">
                    <span className="font-bold">${lowestSellingProduct.price}</span>
                    <span className="mx-2 text-gray-500">•</span>
                    <span className="text-red-500 font-medium">{lowestSellingProduct.sold} sold</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Products list */}
        <div className={`rounded-lg shadow-md mb-8 ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="font-bold text-lg">Product Inventory & Sales</h3>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4 md:mt-0">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg w-full"
                  />
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                
                <div className="flex space-x-2">
                  <select
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg p-2"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="headsets">Headsets</option>
                    <option value="shirts">Apparel</option>
                  </select>
                  
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-1 flex">
                    <button
                      className={`p-1 rounded ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      className={`p-1 rounded ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'price') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('price');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Price
                    {sortBy === 'price' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'stock') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('stock');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Stock
                    {sortBy === 'stock' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      if (sortBy === 'sold') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('sold');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    Sold
                    {sortBy === 'sold' && (
                      <span className="ml-1">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                        <div className="ml-4">
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{product.details}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">${product.price}</td>
                    <td className="px-6 py-4 font-medium">
                      <span className={`${product.stock < 10 ? 'text-red-500' : product.stock < 20 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{product.sold}</td>
                    <td className="px-6 py-4">
                      {product.trend === 'up' ? (
                        <TrendingUp size={20} className="text-green-500" />
                      ) : product.trend === 'down' ? (
                        <TrendingDown size={20} className="text-red-500" />
                      ) : (
                        <span className="inline-block w-5 h-0.5 bg-gray-400"></span>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No products found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Recent sales activity */}
        <div className={`rounded-lg shadow-md ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-bold text-lg">Recent Sales Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {salesData.recentSales.map((sale, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{new Date(sale.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{sale.items} items sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${sale.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(sale.amount / salesData.totalSales * 100).toFixed(1)}% of monthly
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}