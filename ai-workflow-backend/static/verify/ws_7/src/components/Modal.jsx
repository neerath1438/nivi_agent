import React from 'react';

const Modal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded">
        <button onClick={onClose}>Close</button>
        <div>Modal Content</div>
      </div>
    </div>
  );
};

export default Modal;