import React from 'react';

const Stats = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
        <h3 className="text-lg font-bold text-white">Total Value</h3>
        <p className="text-xl text-white">$10,000</p>
      </div>
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
        <h3 className="text-lg font-bold text-white">Total Assets</h3>
        <p className="text-xl text-white">5</p>
      </div>
    </div>
  );
};

export default Stats;