import React from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-lg font-bold">Sidebar</h2>
      <ul>
        <li>Dashboard</li>
        <li>Settings</li>
        <li>Profile</li>
      </ul>
    </aside>
  );
};

export default Sidebar;