"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiFetch<Supplier[]>("/suppliers");
        setSuppliers(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load suppliers";
        setError(errorMessage);
        console.error("Failed to fetch suppliers:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      await apiFetch(`/suppliers/${id}`, { method: "DELETE" });
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
      alert("Supplier deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete supplier";
      setError(errorMessage);
      console.error("Failed to delete supplier:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading suppliers...</div>
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
          <h1 className="text-xl font-semibold text-white">Suppliers</h1>
          <p className="text-sm text-gray-500">
            Manage your raw material suppliers and their contact information.
          </p>
        </div>

        <Link
          href="/admin/suppliers/create"
          className="inline-flex items-center gap-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
        >
          + New Supplier
        </Link>
      </div>

      {/* Content */}
      {suppliers.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
          No suppliers found. Add your first supplier to get started.
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {supplier.name}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Added {new Date(supplier.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {supplier.email || "No email"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {supplier.phone || "No phone"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {supplier.address || "No address"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        router.push(`/admin/suppliers/${supplier.id}/edit`)
                      }
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(supplier.id)}
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
              Showing {suppliers.length} of {suppliers.length} suppliers
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
