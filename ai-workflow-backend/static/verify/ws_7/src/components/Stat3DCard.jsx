import React from 'react';

const Stat3DCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg p-4">
      <div className="flex items-center">
        {icon}
        <div className="ml-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-300">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Stat3DCard;