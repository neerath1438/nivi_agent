import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-purple-800">Crypto Dashboard</h1>
      <button className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition">Account</button>
    </div>
  );
};

export default Navbar;