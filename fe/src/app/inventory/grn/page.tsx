'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface GRNItem {
  id: number;
  quantity: string;
  unit_rate: string;
  line_cost: string;
  material_id: number;
  grn_id: number;
}

interface GRN {
  grn: {
    id: number;
    supplier_id: number;
    supplier_invoice_no: string;
    supplier_invoice_date: string;
    transport_cost: string;
    loading_cost: string;
    misc_cost: string;
    total_material_cost: string;
    total_cost: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
  grn_items: GRNItem[];
}

export default function GRNPage() {
  const [grns, setGrns] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchGRNs() {
      try {
        const response = await fetch('/api/inventory/grn');

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text);
        }

        const data = await response.json();
        setGrns(data);
      } catch (error) {
        console.error('Error fetching GRNs:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchGRNs();
  }, []);

  const handleCreateNew = () => {
    router.push('/inventory/grn/create');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Goods Receipt Notes</h1>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
        >
          + Create New GRN
        </button>
      </div>

      {/* Empty state */}
      {grns.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          No GRNs found. Create your first GRN to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {grns.map(({ grn, grn_items }) => (
            <div
              key={grn.id}
              className="border rounded-lg p-4 hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-medium">GRN #{grn.id}</h2>
                  <p className="text-sm text-gray-500">
                    Invoice: {grn.supplier_invoice_no} •{' '}
                    {format(new Date(grn.created_at), 'PPpp')}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  {grn.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-2 text-sm">
                {grn_items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>Material #{item.material_id}</span>
                    <span>
                      {item.quantity} × {item.unit_rate} = {item.line_cost}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {grn_items.length} items
                </span>
                <span className="font-medium">
                  Total: {grn.total_cost}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
