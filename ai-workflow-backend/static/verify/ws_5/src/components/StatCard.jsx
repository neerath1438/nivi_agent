import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className='bg-white bg-opacity-30 backdrop-blur-md shadow-xl p-5 rounded-lg hover:scale-105 transition-transform'>
      <h3 className='text-lg font-semibold'>{title}</h3>
      <p className='text-2xl'>{value}</p>
    </div>
  );
};

export default StatCard;