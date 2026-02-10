import React from 'react';

const Stats = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800">Total Value</h3>
        <p className="text-2xl text-cyan-500">$10,000</p>
      </div>
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800">Assets</h3>
        <p className="text-2xl text-cyan-500">5</p>
      </div>
      <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
        <h3 className="text-lg font-bold text-purple-800">Transactions</h3>
        <p className="text-2xl text-cyan-500">12</p>
      </div>
    </div>
  );
};

export default Stats;