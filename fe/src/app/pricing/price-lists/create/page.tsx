// src/app/pricing/price-lists/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePriceList() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    currency: "USD",
    is_active: true,
    customer_type_id: 1
  });

  const submit = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch('/api/pricing/price-lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          currency: form.currency,
          is_active: form.is_active,
          customer_type_id: form.customer_type_id,
          effective_from: new Date().toISOString()
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to create price list");
      }

      router.push("/pricing/price-lists");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen px-20 bg-gray-50 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-6 ml-80">
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          Create Price List
        </h1>
        <p className="text-sm text-gray-500">
          Define a new price list configuration for your raw materials inventory.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Card */}
      <div className="max-w-3xl ml-80 border bg-white shadow-sm">
        <div className="p-6 space-y-6">
          {/* Price List Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price List Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Wholesale Pricing"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Enter a brief description for this price list..."
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Currency + Customer Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Customer Type
              </label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:ring-red-500"
                value={form.customer_type_id}
                onChange={(e) =>
                  setForm({ ...form, customer_type_id: Number(e.target.value) })
                }
              >
                <option value={1}>Distributor</option>
                <option value={2}>Dealer</option>
                <option value={3}>Retailer</option>
              </select>
            </div>
          </div>

          {/* Active */}
          <div className="rounded-md bg-gray-50 px-4 py-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Set as Active
                </p>
                <p className="text-xs text-gray-500">
                  Make this price list available immediately upon creation.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t bg-gray-50 px-6 py-4">
          <span className="text-xs text-gray-400 cursor-pointer">
            Read Policy Guidelines
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => router.back()}
              className="border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={saving}
              className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Price List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
