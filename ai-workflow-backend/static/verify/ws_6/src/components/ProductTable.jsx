import React from 'react';

const ProductTable = ({ products }) => {
  return (
    <table className="min-w-full bg-white bg-opacity-30 backdrop-blur-lg shadow-xl rounded-lg">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2">Name</th>
          <th className="p-2">Price</th>
          <th className="p-2">Change</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-100">
            <td className="p-2">{product.name}</td>
            <td className="p-2">{product.price}</td>
            <td className="p-2">{product.change}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;