import React from 'react';

const HeroSection = () => {
  return (
    <div className='bg-gradient-to-r from-blue-500 to-purple-500 p-10 rounded-lg shadow-xl transform transition-transform hover:scale-105'>
      <h2 className='text-white text-3xl font-bold'>Your Crypto Portfolio</h2>
      <p className='text-white mt-2'>Track your investments effortlessly.</p>
    </div>
  );
};

export default HeroSection;