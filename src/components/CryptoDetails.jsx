import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoDetails } from '../redux/slices/cryptoSlice';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Loader2 } from 'lucide-react'; // Import spinner from Lucide React


const CryptoDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { cryptoDetails, status, error } = useSelector((state) => state.crypto);

  const [timePeriod, setTimePeriod] = useState('1w'); // Default time period: 1 week
  const [historicalPrices, setHistoricalPrices] = useState([]);

  useEffect(() => {
    dispatch(fetchCryptoDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (cryptoDetails && cryptoDetails.historical_prices) {
      setHistoricalPrices(cryptoDetails.historical_prices);
    }
  }, [cryptoDetails]);

  useEffect(() => {
    // Fetch historical prices based on selected time period
    if (cryptoDetails && cryptoDetails.id) {
      // Placeholder for time period fetching logic
      // You would need an actual API to fetch the data based on the selected period
      // For now, using cryptoDetails.historical_prices as a static data placeholder
    }
  }, [timePeriod, cryptoDetails]);

  const handleTimePeriodChange = (period) => {
    setTimePeriod(period);
  };

  // Handling loading state with a spinner
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 
          className="animate-spin text-blue-500" 
          size={48} 
          strokeWidth={2} 
        />
      </div>
    );
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  // Handle case where crypto details are missing or incomplete
  if (!cryptoDetails || !cryptoDetails.name) {
    return <div>No details available</div>;
  }

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      {/* Crypto Header */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{cryptoDetails.name}</h1>
      <p className="text-gray-400 mb-4">{cryptoDetails.symbol.toUpperCase()}</p>
      <p className="text-green-400 font-bold text-2xl mb-4">
        ${cryptoDetails.current_price ? cryptoDetails.current_price.toFixed(2) : 'N/A'}
      </p>
      <p
        className={
          cryptoDetails.price_change_percentage_24h > 0
            ? 'text-green-500'
            : cryptoDetails.price_change_percentage_24h < 0
            ? 'text-red-500'
            : 'text-gray-400'
        }
      >
        {cryptoDetails.price_change_percentage_24h
          ? cryptoDetails.price_change_percentage_24h.toFixed(2)
          : 'N/A'}{' '}
        %
      </p>

      {/* Time Period Selector */}
      <div className="flex justify-center space-x-4 mb-6">
        {['1w', '1m', '1y', '5y'].map((period) => (
          <button
            key={period}
            className={`px-4 py-2 rounded-lg ${
              timePeriod === period
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-black'
            } transition duration-300 hover:bg-blue-400`}
            onClick={() => handleTimePeriodChange(period)}
          >
            {period === '1w' && '1 Week'}
            {period === '1m' && '1 Month'}
            {period === '1y' && '1 Year'}
            {period === '5y' && '5 Years'}
          </button>
        ))}
      </div>

      {/* Conditional rendering of the LineChart if historical data is available */}
      {historicalPrices.length > 0 ? (
        <LineChart
          width={window.innerWidth < 768 ? 320 : 800} // Make the chart responsive
          height={400}
          data={historicalPrices}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      ) : (
        <div className="mt-4 text-gray-400">No historical data available</div>
      )}
    </div>
  );
};

export default CryptoDetails;
