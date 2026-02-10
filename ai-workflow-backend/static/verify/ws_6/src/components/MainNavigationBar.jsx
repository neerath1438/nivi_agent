import React from 'react';

const MainNavigationBar = () => {
  return (
    <nav className="bg-white bg-opacity-30 backdrop-blur-md p-4 fixed w-full z-10">
      <ul className="flex space-x-4">
        <li>Dashboard</li>
        <li>Reports</li>
        <li>Settings</li>
        <li>User Profile</li>
      </ul>
    </nav>
  );
};

export default MainNavigationBar;