// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import cryptoReducer from '../redux/slices/cryptoSlice.js';

const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
  },
});

export default store;

