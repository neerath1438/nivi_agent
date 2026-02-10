import React from 'react';
import { LucideIcon } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-white bg-opacity-30 backdrop-blur-lg shadow-xl p-5">
      <h2 className="text-xl font-bold text-center text-purple-800">Portfolio</h2>
      <nav className="mt-5">
        <ul>
          <li className="py-2 hover:scale-105 transition-transform"><LucideIcon name="Home" /> Overview</li>
          <li className="py-2 hover:scale-105 transition-transform"><LucideIcon name="Wallet" /> Assets</li>
          <li className="py-2 hover:scale-105 transition-transform"><LucideIcon name="List" /> Transactions</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;