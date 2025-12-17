"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function CreateMaterial() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    min_stock: 0,
    category_id: 1,
    uom_id: 1,
  });

  async function submit() {
    setSaving(true);
    try {
      await apiFetch("/materials", {
        method: "POST",
        body: JSON.stringify(form),
      });
      router.push("/inventory/materials");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-168 bg-gray-50 dark:bg-gray-900 p-8">
      {/* Back link */}
      <div
        onClick={() => router.push("/inventory/materials")}
        className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        ← Back to Raw Materials
      </div>

      <div className="ml-50 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {/* LEFT INFO */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Add Material
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Register a new raw material into the inventory system.
            Accurate data entry ensures efficient stock tracking.
          </p>

          {/* Naming convention box */}
          <div className="mt-6 border-l-4 border-red-500 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              NAMING CONVENTION
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Material codes must be unique. The standard format is{" "}
              <span className="font-mono text-red-600 dark:text-red-400">MAT-XXX</span>.
            </p>
          </div>
        </div>

        {/* RIGHT FORM CARD */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 p-6">
            {/* Card header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                ➕ Material Details
              </div>
              <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded">
                NEW ENTRY
              </span>
            </div>

            {/* Material Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Material Name
              </label>
              <input
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Polypropylene Granules"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* Code + Min Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Material Code
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. MAT-001"
                  value={form.code}
                  onChange={(e) =>
                    setForm({ ...form, code: e.target.value })
                  }
                />
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                  * Must be unique per item.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Minimum Stock Level
                </label>
                <input
                  type="number"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={form.min_stock}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      min_stock: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => router.push("/inventory/materials")}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                onClick={submit}
                className="px-5 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save Material"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-46 text-center text-xs text-gray-400">
        © 2025, Inventory Management System <br /> Privacy Policy | Terms of Service
      </div>
    </div>
  );
}
