import React from 'react';
import { LucideIcon } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5">
      <h2 className="text-xl font-bold text-center text-white">Portfolio</h2>
      <ul className="mt-5 space-y-3">
        <li className="hover:scale-105 transition-transform"><LucideIcon icon="Home" /> Overview</li>
        <li className="hover:scale-105 transition-transform"><LucideIcon icon="Wallet" /> Assets</li>
        <li className="hover:scale-105 transition-transform"><LucideIcon icon="List" /> Transactions</li>
      </ul>
    </div>
  );
};

export default Sidebar;