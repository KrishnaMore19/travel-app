import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllCryptos } from '../redux/slices/cryptoSlice';

const Marketplace = () => {
  const dispatch = useDispatch();
  const { cryptos = [], status, error } = useSelector((state) => state.crypto);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    dispatch(fetchAllCryptos());
  }, [dispatch]);

  // Sorting function
  const sortedCryptos = React.useMemo(() => {
    let sortableCryptos = [...cryptos];
    if (sortConfig.key) {
      sortableCryptos.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableCryptos;
  }, [cryptos, sortConfig]);

  // Filtering function
  const filteredCryptos = sortedCryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCryptos = filteredCryptos.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Cryptocurrency Marketplace</h1>

      {/* Search and Filter Section */}
      <div className="mb-6 flex justify-between items-center flex-wrap">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search Cryptocurrencies..."
            className="p-2 border rounded w-full sm:w-64 text-black"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="p-2 border rounded text-black"
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="market_cap">Market Cap</option>
            <option value="current_price">Price</option>
            <option value="price_change_percentage_24h">24h Change</option>
          </select>
        </div>
      </div>

      {/* Crypto Cards for Small Screens and Table for Larger Screens */}
      <div className="lg:hidden">
        {/* Card Layout for Small Screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {status === 'loading' ? (
            <div className="col-span-full text-center">Loading cryptocurrencies...</div>
          ) : status === 'failed' ? (
            <div className="col-span-full text-center text-red-500">{error}</div>
          ) : (
            currentCryptos.map((crypto, index) => (
              <div key={crypto.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                <img src={crypto.image} alt={crypto.name} className="w-16 h-16 mb-4" />
                <h2 className="text-xl font-bold mb-2">{crypto.name}</h2>
                <p className="text-gray-400 text-sm mb-2">{crypto.symbol.toUpperCase()}</p>
                <p className="text-green-400 font-bold mb-2">${crypto.current_price.toFixed(2)}</p>
                <p className={crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </p>
                <Link to={`/crypto/${crypto.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mt-4">
                  Details
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Table Layout for Larger Screens */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">#</th>
                <th
                  className="p-3 text-left cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  Name
                </th>
                <th
                  className="p-3 text-right cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('current_price')}
                >
                  Price
                </th>
                <th
                  className="p-3 text-right cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('price_change_percentage_24h')}
                >
                  24h Change
                </th>
                <th
                  className="p-3 text-right cursor-pointer hover:bg-gray-600"
                  onClick={() => handleSort('market_cap')}
                >
                  Market Cap
                </th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {status === 'loading' ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">Loading cryptocurrencies...</td>
                </tr>
              ) : status === 'failed' ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-red-500">{error}</td>
                </tr>
              ) : (
                currentCryptos.map((crypto, index) => (
                  <tr key={crypto.id} className="border-b border-gray-700 hover:bg-gray-700 transition">
                    <td className="p-3">{indexOfFirstItem + index + 1}</td>
                    <td className="p-3 flex items-center space-x-3">
                      <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                      <span>{crypto.name}</span>
                      <span className="text-gray-400 uppercase">{crypto.symbol}</span>
                    </td>
                    <td className="p-3 text-right">${crypto.current_price.toLocaleString()}</td>
                    <td className={`p-3 text-right ${crypto.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </td>
                    <td className="p-3 text-right">${crypto.market_cap.toLocaleString()}</td>
                    <td className="p-3 text-right">
                      <Link to={`/crypto/${crypto.id}`} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {Array.from(
            { length: Math.ceil(filteredCryptos.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
