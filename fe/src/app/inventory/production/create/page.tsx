// fe/src/app/inventory/production/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function CreateProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [gstError, setGstError] = useState("");

  const [form, setForm] = useState({
    name: "",
    sku: "",
    size_ml: 0,
    gst_percent: 0,
    uom_id: 1
  });

  const validateGST = (value: number) => {
    if (value < 0 || value > 28) {
      setGstError("GST must be between 0% and 28%");
      return false;
    }
    setGstError("");
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateGST(form.gst_percent)) {
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(form)
      });
      router.push("/inventory/production");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            className="input"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            className="input"
            value={form.sku}
            onChange={(e) => setForm({...form, sku: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Size (ml)</label>
          <input
            type="number"
            className="input"
            value={form.size_ml}
            onChange={(e) => setForm({...form, size_ml: Number(e.target.value)})}
            min="0"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GST %</label>
          <input
            type="number"
            className={`input ${gstError ? 'border-red-500' : ''}`}
            value={form.gst_percent}
            onChange={(e) => {
              const value = Number(e.target.value);
              setForm({...form, gst_percent: value});
              validateGST(value);
            }}
            min="0"
            max="28"
            step="0.01"
            required
          />
          {gstError && <p className="mt-1 text-sm text-red-600">{gstError}</p>}
          {form.gst_percent === 0 && (
            <p className="mt-1 text-sm text-yellow-600">
              Note: GST is set to 0%. Are you sure this is correct?
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Unit of Measure</label>
          <select
            className="input"
            value={form.uom_id}
            onChange={(e) => setForm({...form, uom_id: Number(e.target.value)})}
          >
            <option value={1}>Pieces</option>
            <option value={2}>Grams</option>
            <option value={3}>Liters</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}