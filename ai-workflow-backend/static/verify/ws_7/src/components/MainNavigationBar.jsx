import React from 'react';

const MainNavigationBar = () => {
  return (
    <nav className="bg-white bg-opacity-30 backdrop-blur-md p-4 fixed w-full z-10">
      <ul className="flex space-x-4">
        <li><a href="#">Dashboard</a></li>
        <li><a href="#">Reports</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">User Profile</a></li>
      </ul>
    </nav>
  );
};

export default MainNavigationBar;