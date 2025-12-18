'use client';

import { useState } from 'react';

interface RMLedgerItem {
  material_name: string;
  lot_no: string;
  expiry_date?: string;
  available_qty: number;
  landed_cost: number;
  stock_value: number;
  unit: string;
}

export default function RMLedger() {
  const [search, setSearch] = useState('');

  // Mock data - replace with real API call
  const data: RMLedgerItem[] = [
    {
      material_name: 'Raw Material 1',
      lot_no: 'LOT-001',
      expiry_date: '2024-12-31',
      available_qty: 100,
      landed_cost: 150.5,
      stock_value: 15050,
      unit: 'kg'
    },
    {
      material_name: 'Packing Material',
      lot_no: 'LOT-002',
      expiry_date: '2025-06-30',
      available_qty: 50,
      landed_cost: 25.75,
      stock_value: 1287.5,
      unit: 'pcs'
    },
  ];

  const filteredData = data.filter(item => 
    item.material_name.toLowerCase().includes(search.toLowerCase()) ||
    item.lot_no.toLowerCase().includes(search.toLowerCase())
  );

  const totalStockValue = filteredData.reduce((sum, item) => sum + item.stock_value, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">RM Stock Ledger</h1>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded-md w-full md:w-64"
          />
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lot No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expiry Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Qty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Landed Cost (₹)
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Value (₹)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.material_name}</div>
                    <div className="text-sm text-gray-500">{item.unit}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.lot_no}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.expiry_date || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.available_qty.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {item.landed_cost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {item.stock_value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td colSpan={5} className="px-6 py-3 text-right text-sm font-medium text-gray-700">
                  Total Stock Value:
                </td>
                <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  ₹{totalStockValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}