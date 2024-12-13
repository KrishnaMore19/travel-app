import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';  // Assuming Navbar is in the components folder
import HeroSection from './components/HeroSection';
import CryptoDetails from './components/CryptoDetails';
import Marketplace from './components/Marketplace';
import AboutUs from './components/AboutUs';

function App() {
  return (
    <Router>
      <div className="relative bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen">
        <Navbar />  {/* Importing and using Navbar component */}

        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/crypto/:id" element={<CryptoDetails />} />
          <Route path="/marketplace" element={<Marketplace/>} />
          <Route path="/about" element={<AboutUs/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;



