import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAllCryptos } from '../redux/slices/cryptoSlice';

const HeroSection = () => {
  const dispatch = useDispatch();
  const { cryptos = [], status, error } = useSelector((state) => state.crypto);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchAllCryptos());
  }, [dispatch]);

  const filteredCoins = searchQuery
    ? cryptos.filter((coin) =>
        coin.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cryptos;

  return (
    <section className="relative flex flex-col items-center text-center px-6 py-16">
      {/* Hero Section */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-blue-500">
        Largest Crypto Marketplace
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
        Discover and track the top cryptocurrencies in real-time.
      </p>

      {/* Search Bar */}
      <form
        className="flex items-center space-x-4 mb-12 justify-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search Crypto..."
          className="p-3 rounded-lg w-full sm:w-80 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {status === 'loading' && (
        <div className="col-span-full flex justify-center items-center w-full h-64">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-4 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error State */}
      {status === 'failed' && <p className="col-span-full text-red-500">{error}</p>}

      {/* Crypto Cards */}
      {status === 'succeeded' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCoins.slice(0, 10).map((crypto) => (
            <Link
              to={`/crypto/${crypto.id}`}
              key={crypto.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <img
                src={crypto.image}
                alt={crypto.name}
                className="w-16 h-16 mb-4"
              />
              <h2 className="text-xl font-bold mb-2">{crypto.name}</h2>
              <p className="text-gray-400 text-sm mb-2">{crypto.symbol.toUpperCase()}</p>
              <p className="text-green-400 font-bold mb-2">
                ${crypto.current_price.toFixed(2)}
              </p>
              <p
                className={
                  crypto.price_change_percentage_24h > 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }
              >
                {crypto.price_change_percentage_24h.toFixed(2)}%
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
