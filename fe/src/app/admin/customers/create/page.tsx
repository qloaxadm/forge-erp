// fe/src/app/admin/customers/create/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";
import { PriceList } from "../../../../types/price-list";

export default function CreateCustomer() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    customer_type_id: 1,
    credit_limit: 0,
    default_price_list_id: 1
  });

  useEffect(() => {
    const fetchPriceLists = async () => {
      try {
        const data = await apiFetch<PriceList[]>('/price-lists');
        if (data) {
          setPriceLists(data);
        }
      } catch (error) {
        console.error('Failed to fetch price lists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceLists();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiFetch("/customers", {
        method: "POST",
        body: JSON.stringify(form)
      });
      router.push("/admin/customers");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  const handleCustomerTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const customerTypeId = Number(e.target.value);
    // Find a price list that matches the selected customer type
    const matchingPriceList = priceLists.find(pl => pl.customer_type_id === customerTypeId);
    
    setForm(prev => ({
      ...prev,
      customer_type_id: customerTypeId,
      default_price_list_id: matchingPriceList?.id || prev.default_price_list_id
    }));
  };

  if (loading) {
    return <div className="p-6">Loading price lists...</div>;
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">Create Customer</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            className="input"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Type</label>
          <select
            className="input"
            value={form.customer_type_id}
            onChange={handleCustomerTypeChange}
            required
          >
            <option value={1}>Distributor</option>
            <option value={2}>Dealer</option>
            <option value={3}>Retailer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Price List</label>
          <select
            className="input"
            value={form.default_price_list_id}
            onChange={e => setForm({ ...form, default_price_list_id: Number(e.target.value) })}
          >
            {priceLists.map((priceList) => (
              <option key={priceList.id} value={priceList.id}>
                {priceList.name}
              </option>
            ))}
        
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Credit Limit (₹)
          </label>
          <input
            type="number"
            className="input"
            value={form.credit_limit}
            onChange={(e) => setForm({...form, credit_limit: Number(e.target.value)})}
            min="0"
            step="0.01"
            required
          />
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
            {saving ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}