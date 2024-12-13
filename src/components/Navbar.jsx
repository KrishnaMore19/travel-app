import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle the menu visibility on smaller screens
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="text-2xl font-bold text-blue-500 hover:text-blue-400 transition duration-300">
          CryptoPulse
        </Link>
      </div>
      
      {/* Menu Toggle Button (Hamburger Icon) */}
      <div className="lg:hidden">
        <button onClick={handleMenuToggle} className="text-white">
          {isMenuOpen ? 'X' : '☰'}
        </button>
      </div>

      {/* Menu Links */}
      <div className={`lg:flex lg:space-x-6 ${isMenuOpen ? 'flex' : 'hidden'} flex-col lg:flex-row space-y-4 lg:space-y-0`}>
        <Link 
          to="/" 
          className="hover:text-blue-500 transition duration-300"
          onClick={() => setIsMenuOpen(false)}  // Close the menu when a link is clicked
        >
          Home
        </Link>
        <Link 
          to="/marketplace" 
          className="hover:text-blue-500 transition duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          Marketplace
        </Link>
        <Link 
          to="/about" 
          className="hover:text-blue-500 transition duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          About Us
        </Link>
      </div>

      {/* Sign Up Button */}
      <div className="flex items-center space-x-4">
        <button 
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

