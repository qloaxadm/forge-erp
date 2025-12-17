"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function CreatePriceList() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    customer_type_id: 1
  });

  async function submit() {
    setSaving(true);
    try {
      await apiFetch("/pricing/lists", {
        method: "POST",
        body: JSON.stringify(form)
        });
      router.push("/pricing/price-lists");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-xl space-y-3">
      <h1 className="text-lg font-semibold">Create Price List</h1>

      <input className="input" placeholder="Price List Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <select className="input"
        value={form.customer_type_id}
        onChange={e => setForm({ ...form, customer_type_id: Number(e.target.value) })}
      >
        <option value={1}>Distributor</option>
        <option value={2}>Dealer</option>
        <option value={3}>Retailer</option>
      </select>

      <button className="btn-primary" disabled={saving} onClick={submit}>
        {saving ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
