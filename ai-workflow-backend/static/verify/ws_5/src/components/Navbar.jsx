import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Crypto Dashboard</h1>
      <button className="text-white hover:scale-105 transition-transform">Account</button>
    </div>
  );
};

export default Navbar;