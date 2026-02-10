import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import ProductTable from '../components/ProductTable';

const mockData = [{ name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }];
const mockProducts = [{ id: 1, name: 'Bitcoin', price: '$40,000', change: '+5%' }, { id: 2, name: 'Ethereum', price: '$3,000', change: '+3%' }];

const Dashboard = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1'>
        <Navbar />
        <HeroSection />
        <div className='grid grid-cols-3 gap-4 p-4'>
          <StatCard title='Bitcoin' value='$40,000' />
          <StatCard title='Ethereum' value='$3,000' />
          <StatCard title='Litecoin' value='$200' />
        </div>
        <AnalyticsChart data={mockData} />
        <ProductTable products={mockProducts} />
      </div>
    </div>
  );
};

export default Dashboard;