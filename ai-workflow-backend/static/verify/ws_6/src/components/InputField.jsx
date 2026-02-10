import React from 'react';

const InputField = ({ label, type = 'text', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block mb-2 text-gray-700">{label}</label>
      <input type={type} className="border rounded p-2 w-full" {...props} />
    </div>
  );
};

export default InputField;