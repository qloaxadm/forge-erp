"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

export default function CreateSupplier() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gst_number: "",
    address: ""
  });

  async function submit() {
    setSaving(true);
    try {
      await apiFetch("/suppliers", {
        method: "POST",
        body: JSON.stringify(form)
      });
      router.push("/admin/suppliers");
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }   

  // In your create supplier page
const handleSubmit = async (formData: FormData) => {
  try {
    console.log('Form data:', Object.fromEntries(formData.entries()));
    
    const response = await apiFetch('/suppliers', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    console.log('Success:', response);
    router.push('/admin/suppliers');
 } catch (error) {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  const status = (error as any)?.status;
  const response = (error as any)?.response;
  
  console.error('Submission failed:', {
    error: errorMessage,
    status,
    response
  });
    // Update your UI to show the error to the user
  }
};

  return (
    <div className="p-6 max-w-xl space-y-3">
      <h1 className="text-lg font-semibold">Add Supplier</h1>

      <input className="input" placeholder="Supplier Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <input className="input" placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <input className="input" placeholder="GST Number"
        value={form.gst_number}
        onChange={e => setForm({ ...form, gst_number: e.target.value })}
      />

      <textarea className="input" placeholder="Address"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
      />

     <form
  onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await handleSubmit(formData);
  }}
>
  {/* Your form fields here */}
  <button type="submit">Submit</button>
</form>
    </div>
  );
}
