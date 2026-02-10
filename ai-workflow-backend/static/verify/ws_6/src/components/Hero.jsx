import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const mockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
];

const Hero = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
      <h2 className="text-xl font-bold text-purple-800">Portfolio Overview</h2>
      <LineChart width={600} height={300} data={mockData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" />
        <Line type="monotone" dataKey="value" stroke="#00FFFF" />
      </LineChart>
    </div>
  );
};

export default Hero;