
import React from 'react';
import { InventoryItem } from '../types';
import { Plus, Minus } from 'lucide-react';

interface InventoryPageProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryPage: React.FC<InventoryPageProps> = ({ inventory, setInventory }) => {

  const handleStockChange = (id: string, amount: number) => {
    setInventory(prevInventory =>
      prevInventory.map(item =>
        item.id === id
          ? { ...item, currentStock: Math.max(0, item.currentStock + amount) }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 font-display">Inventory Management</h1>
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Threshold</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map(item => {
              const isLowStock = item.currentStock < item.threshold;
              return (
                <tr key={item.id} className={isLowStock ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-lg font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.currentStock} <span className="text-sm font-normal text-gray-500">{item.unit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold} {item.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <button onClick={() => handleStockChange(item.id, 1)} className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition">
                         <Plus size={16} />
                       </button>
                       <button onClick={() => handleStockChange(item.id, -1)} className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition">
                         <Minus size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
