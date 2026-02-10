import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import ProductTable from '../components/ProductTable';

const mockData = [{ name: 'Bitcoin', value: 45000 }, { name: 'Ethereum', value: 3000 }];
const mockProducts = [{ id: 1, name: 'Bitcoin', price: '$45,000', change: '+5%' }, { id: 2, name: 'Ethereum', price: '$3,000', change: '+3%' }];

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <HeroSection />
        <div className="grid grid-cols-2 gap-4 p-5">
          <StatCard title="Total Value" value="$100,000" />
          <StatCard title="Total Assets" value="5" />
        </div>
        <AnalyticsChart data={mockData} />
        <ProductTable products={mockProducts} />
      </div>
    </div>
  );
};

export default Dashboard;