import React from 'react';

const StatsCards = () => {
  const stats = [
    { title: 'Total Assets', value: '5' },
    { title: 'Daily Gain/Loss', value: '+2%' },
    { title: 'Market Trends', value: 'Bullish' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
          <h3 className="text-lg font-bold">{stat.title}</h3>
          <p className="text-xl">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;