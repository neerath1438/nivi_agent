import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl rounded-lg p-5 hover:scale-105 transition-transform duration-300">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-2xl text-white">{value}</p>
    </div>
  );
};

export default StatCard;