import React from 'react';

const MainLayout = ({ children }) => {
  return <div className="min-h-screen bg-gray-900 text-white p-6">{children}</div>;
};

export default MainLayout;