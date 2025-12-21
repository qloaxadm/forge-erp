"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMaterials } from "../../../hooks/useMaterials";
import { toast } from 'react-hot-toast';

export default function MaterialsPage() {
  const router = useRouter();
  const { 
    data, 
    loading, 
    error, 
    deleteMaterial, 
    processing 
  } = useMaterials();

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMaterial(id);
      toast.success('Material deleted successfully');
    } catch (error) {
      toast.error('Failed to delete material');
    }
  };

  const handleEdit = (id: string | number) => {
    router.push(`/inventory/materials/edit/${id}`);
  };

  if (loading) return <p className="p-6">Loading materials…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="h-screen px-20  bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Raw Materials
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your inventory stock and material codes efficiently.
          </p>
        </div>

        <Link
          href="/inventory/materials/create"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2  text-sm shadow transition-colors"
        >
           Add New Material
        </Link>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-gray-800  shadow border dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-black dark:bg-gray-700 text-white text-xs uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-right">Min Stock</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((m) => {
              const status =
                !m.is_active
                  ? { label: "Inactive", cls: "bg-gray-200 text-gray-700" }
                  : m.min_stock <= 0
                  ? { label: "Low Stock", cls: "bg-red-100 text-red-600" }
                  : m.min_stock < 50
                  ? { label: "Reorder", cls: "bg-yellow-100 text-yellow-700" }
                  : { label: "Active", cls: "bg-green-100 text-green-600" };

              return (
                <tr
                  key={m.id}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                    {m.name}
                  </td>

                  <td className="px-4 py-3">
                    <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs font-mono">
                      {m.code}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-right text-gray-700 dark:text-gray-300">
                    {Number(m.min_stock).toFixed(2)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        status.cls.includes("bg-gray")
                          ? "dark:bg-gray-600 dark:text-gray-100"
                          : status.cls
                      }`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEdit(m.id)}
                        disabled={processing[m.id]}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={processing[m.id]}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                        title="Delete"
                      >
                        {processing[m.id] ? (
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center px-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
          <span>Showing 1 to {data.length} results</span>

          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200">
              Previous
            </button>
            <button className="px-3 py-1 border rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
              1
            </button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-gray-200">
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="mt-56 text-center text-xs text-gray-400">
        © 2025, Inventory Management System <br /> Privacy Policy | Terms of Service
      </div>
    </div>
  );
}
