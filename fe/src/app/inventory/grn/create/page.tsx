'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

type GRNItem = {
  material_id: string;
  quantity: number;
  unit_rate: number;
  batch_no: string;
  expiry_date?: string;
};

type Supplier = {
  id: string;
  name: string;
};

type Material = {
  id: string;
  name: string;
  unit: string;
};

export default function CreateGRN() {
  const router = useRouter();
  const [items, setItems] = useState<GRNItem[]>([]);
  const [supplierId, setSupplierId] = useState('');
  const [supplierInvoiceNo, setSupplierInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [transportCost, setTransportCost] = useState(0);
  const [loadingCost, setLoadingCost] = useState(0);
  const [miscCost, setMiscCost] = useState(0);
  const [saving, setSaving] = useState(false);

  // Mock data
  const suppliers: Supplier[] = [
    { id: '1', name: 'ABC Suppliers' },
    { id: '2', name: 'XYZ Traders' },
  ];

  const materials: Material[] = [
    { id: '1', name: 'Raw Material 1', unit: 'kg' },
    { id: '2', name: 'Raw Material 2', unit: 'pcs' },
    { id: '3', name: 'Packing Material', unit: 'box' },
  ];

  const totalMaterial = items.reduce(
    (sum, item) => sum + (item.quantity || 0) * (item.unit_rate || 0),
    0
  );

  const totalCost = totalMaterial + transportCost + loadingCost + miscCost;

  const addItem = () => {
    setItems([...items, { material_id: '', quantity: 0, unit_rate: 0, batch_no: '' }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof GRNItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    if (!supplierId || items.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
  try {
  const response = await fetch('/api/inventory/grn', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    supplier_id: supplierId,
    supplier_invoice_no: supplierInvoiceNo,
    supplier_invoice_date: invoiceDate,
    transport_cost: transportCost,
    loading_cost: loadingCost,
    misc_cost: miscCost,
    items: items.map(item => ({
      ...item,
      quantity: Number(item.quantity),
      unit_rate: Number(item.unit_rate),
    })),
  }),
});


      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create GRN');
      }
      router.push('/inventory/grn');
    } catch (error) {
  console.error('Error creating GRN:', error);
  const errorMessage = error instanceof Error ? error.message : 'Failed to create GRN';
  alert(errorMessage);
}
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold">Create Goods Receipt Note</h1>

      {/* Supplier Details */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold">Supplier Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Supplier *</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Select supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Supplier Invoice No</label>
            <input
              type="text"
              value={supplierInvoiceNo}
              onChange={(e) => setSupplierInvoiceNo(e.target.value)}
              placeholder="Invoice number"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Transport Cost (₹)</label>
            <input
              type="number"
              value={transportCost}
              onChange={(e) => setTransportCost(Number(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Loading Cost (₹)</label>
            <input
              type="number"
              value={loadingCost}
              onChange={(e) => setLoadingCost(Number(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Misc Cost (₹)</label>
            <input
              type="number"
              value={miscCost}
              onChange={(e) => setMiscCost(Number(e.target.value) || 0)}
              min="0"
              step="0.01"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Items</h2>
          <button
            type="button"
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2 border">Material</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Unit Rate (₹)</th>
                <th className="p-2 border">Amount (₹)</th>
                <th className="p-2 border">Batch No</th>
                <th className="p-2 border">Expiry Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 border">
                    <select
                      value={item.material_id}
                      onChange={(e) => updateItem(index, 'material_id', e.target.value)}
                      className="w-full p-1 border rounded"
                      required
                    >
                      <option value="">Select material</option>
                      {materials.map((material) => (
                        <option key={material.id} value={material.id}>
                          {material.name} ({material.unit})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.quantity || ''}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full p-1 border rounded"
                      required
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={item.unit_rate || ''}
                      onChange={(e) => updateItem(index, 'unit_rate', Number(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full p-1 border rounded"
                      required
                    />
                  </td>
                  <td className="p-2 border text-right">
                    {((item.quantity || 0) * (item.unit_rate || 0)).toFixed(2)}
                  </td>
                  <td className="p-2 border">
                    <input
                      type="text"
                      value={item.batch_no || ''}
                      onChange={(e) => updateItem(index, 'batch_no', e.target.value)}
                      placeholder="Batch no"
                      className="w-full p-1 border rounded"
                      required
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={item.expiry_date || ''}
                      onChange={(e) => updateItem(index, 'expiry_date', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No items added. Click "Add Item" to get started.
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Material Total:</span>
              <span>₹{totalMaterial.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Transport Cost:</span>
              <span>₹{transportCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Loading Cost:</span>
              <span>₹{loadingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-sm text-gray-600">Misc Cost:</span>
              <span>₹{miscCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 mt-2 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">₹{totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.push('/inventory/grn')}
          disabled={saving}
          className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save GRN'}
        </button>
      </div>
    </div>
  );
}