"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PriceList {
  id: number;
  name: string;
  description: string;
  currency: string;
  is_active: boolean;
  customer_type_id: number;
  created_at: string;
  customer_type?: {
    name: string;
  };
}

export default function PriceListsPage() {
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPriceLists = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/pricing`);
        if (!response.ok) {
          throw new Error(`Failed to fetch price lists: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        
        if (!result.success || !Array.isArray(result.data)) {
          console.error('Invalid API response format:', result);
          throw new Error('Invalid response format from server');
        }
        
        setPriceLists(result.data);
      } catch (err) {
        console.error('Error fetching price lists:', err);
        setError(err instanceof Error ? err.message : 'Failed to load price lists');
      } finally {
        setLoading(false);
      }
    };

    fetchPriceLists();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this price list?')) return;
    
    try {
      const response = await fetch(`/api/pricing/price-lists/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete price list');
      }
      
      // Remove the deleted price list from state
      setPriceLists(prev => prev.filter(list => list.id !== id));
      
      alert('Price list deleted successfully');
    } catch (err) {
      console.error('Error deleting price list:', err);
      alert('Failed to delete price list');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading price lists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen px-20 bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Price Lists
          </h1>
          <p className="text-sm text-gray-500">
            Manage your pricing configurations and customer-specific pricing rules.
          </p>
        </div>

        <Link
          href="/pricing/price-lists/create"
          className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
        >
          + New Price List
        </Link>
      </div>

      {/* Content */}
      {priceLists.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          No price lists found. Create your first price list to get started.
        </div>
      ) : (
        <div className="border bg-white overflow-hidden rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {priceLists.map((list) => (
                <tr key={list.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{list.name}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {new Date(list.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {list.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{list.currency}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      list.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {list.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => router.push(`/pricing/price-lists/${list.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Footer */}
          <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-3">
            <span className="text-xs text-gray-500">
              Showing {priceLists.length} of {priceLists.length} price lists
            </span>
            <div className="flex space-x-2">
              <button
                disabled={true}
                className="px-3 py-1 border rounded text-gray-400 cursor-not-allowed"
              >
                Previous
              </button>
              <button className="px-3 py-1 border rounded bg-red-500 text-white">
                1
              </button>
              <button
                disabled={true}
                className="px-3 py-1 border rounded text-gray-400 cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}