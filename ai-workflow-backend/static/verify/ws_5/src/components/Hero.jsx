import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 500 },
  { name: 'Apr', value: 700 },
];

const Hero = () => {
  return (
    <div className="bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5 rounded-lg">
      <h2 className="text-xl font-bold text-center text-white">Portfolio Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#00FFFF" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Hero;