import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Hero from './Hero';
import Stats from './Stats';

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-5">
          <Hero />
          <Stats />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;