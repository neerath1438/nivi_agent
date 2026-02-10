import React from 'react';

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-xl p-5">
      <h2 className="text-3xl font-bold text-white">Your Crypto Portfolio</h2>
      <p className="text-lg text-gray-200">Track your assets in real-time</p>
    </div>
  );
};

export default HeroSection;