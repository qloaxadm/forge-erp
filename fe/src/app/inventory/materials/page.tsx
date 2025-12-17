"use client";

import Link from "next/link";
import { useMaterials } from "../../../hooks/useMaterials";

export default function MaterialsPage() {
  const { data, loading, error } = useMaterials();

  if (loading) return <p className="p-6">Loading materials…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="h-168 px-20  bg-gray-50 dark:bg-gray-900 p-8">
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

                  <td className="px-4 py-3 text-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer">
                    ✎
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
