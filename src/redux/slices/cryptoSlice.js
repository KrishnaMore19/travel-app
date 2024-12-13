import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Existing fetchAllCryptos thunk
export const fetchAllCryptos = createAsyncThunk(
  'crypto/fetchAllCryptos',
  async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd');
    const data = await response.json();
    return data;
  }
);

// New fetchCryptoDetails thunk
export const fetchCryptoDetails = createAsyncThunk(
  'crypto/fetchCryptoDetails',
  async (id) => {
    // Fetch basic coin details
    const detailsResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${id}`);
    const details = await detailsResponse.json();

    // Fetch historical price data (last 30 days)
    const historicalResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=30`
    );
    const historicalData = await historicalResponse.json();

    // Transform historical prices
    const historicalPrices = historicalData.prices.map(([timestamp, price]) => ({
      date: new Date(timestamp).toLocaleDateString(),
      price: price
    }));

    return {
      ...details,
      current_price: details.market_data.current_price.usd,
      price_change_percentage_24h: details.market_data.price_change_percentage_24h,
      historical_prices: historicalPrices,
      symbol: details.symbol
    };
  }
);

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState: {
    cryptos: [],
    cryptoDetails: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCryptos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCryptos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cryptos = action.payload;
      })
      .addCase(fetchAllCryptos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add cases for fetchCryptoDetails
      .addCase(fetchCryptoDetails.pending, (state) => {
        state.status = 'loading';
        state.cryptoDetails = null;
      })
      .addCase(fetchCryptoDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cryptoDetails = action.payload;
      })
      .addCase(fetchCryptoDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.cryptoDetails = null;
      });
  },
});

export default cryptoSlice.reducer;