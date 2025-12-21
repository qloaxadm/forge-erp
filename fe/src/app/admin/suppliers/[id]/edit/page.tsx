'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

/* ================= TYPES ================= */

type Supplier = {
  id: string;
  name: string;
  code: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  tax_number?: string;
  address?: string;
  payment_terms?: number;
  currency?: string;
  is_active: boolean;
};

/* ================= COMPONENT ================= */

export default function EditSupplier() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<{
    message: string;
    validationErrors?: string[];
  } | null>(null);

  const [formData, setFormData] = useState<Omit<Supplier, 'id'>>({
    name: '',
    code: '',
    contact_person: '',
    email: '',
    phone: '',
    tax_number: '',
    address: '',
    payment_terms: undefined,
    currency: 'INR',
    is_active: true,
  });

  /* ================= FETCH SUPPLIER ================= */

  useEffect(() => {
    if (!supplierId) {
      setError({ message: 'Invalid supplier ID' });
      setIsLoading(false);
      return;
    }

    const fetchSupplier = async () => {
      try {
        const response = await apiFetch<Supplier>(`/suppliers/${supplierId}`);

        setFormData({
          name: response.name,
          code: response.code,
          contact_person: response.contact_person || '',
          email: response.email || '',
          phone: response.phone || '',
          tax_number: response.tax_number || '',
          address: response.address || '',
          payment_terms: response.payment_terms,
          currency: response.currency || 'INR',
          is_active: response.is_active ?? true,
        });
      } catch (err: any) {
        setError({ message: err.message || 'Failed to load supplier' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  /* ================= HANDLERS ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    const newValue =
      type === 'number' ? (value === '' ? undefined : Number(value)) : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (!formData.name.trim()) {
        throw new Error('Supplier name is required');
      }
      if (!formData.code.trim()) {
        throw new Error('Supplier code is required');
      }

      const requestBody = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        contact_person: formData.contact_person?.trim() || undefined,
        email: formData.email?.trim() || undefined,
        phone: formData.phone?.trim() || undefined,
        tax_number: formData.tax_number?.trim() || undefined,
        address: formData.address?.trim() || undefined,
        payment_terms: formData.payment_terms,
        currency: formData.currency || 'INR',
        is_active: formData.is_active,
      };

      await apiFetch(`/suppliers/${supplierId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      router.push('/admin/suppliers');
      router.refresh();
    } catch (err: any) {
      setError({ message: err.message || 'Failed to update supplier' });
    } finally {
      setIsSaving(false);
    }
  };

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Supplier</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm bg-white border rounded-md"
          >
            Back to List
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400">
            {error.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:p-6 grid grid-cols-1 sm:grid-cols-6 gap-6">
            {/* Name */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Code */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Code *</label>
              <input
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            {/* Contact */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">
                Contact Person
              </label>
              <input
                name="contact_person"
                value={formData.contact_person || ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Email */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Phone</label>
              <input
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Tax */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium">Tax Number</label>
              <input
                name="tax_number"
                value={formData.tax_number || ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium">Address</label>
              <textarea
                name="address"
                rows={3}
                value={formData.address || ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Payment Terms */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">
                Payment Terms (days)
              </label>
              <input
                type="number"
                name="payment_terms"
                value={formData.payment_terms ?? ''}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              />
            </div>

            {/* Currency */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md px-3 py-2"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            {/* Status */}
            <div className="sm:col-span-2 flex items-end">
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-md ${
                  formData.is_active ? 'bg-green-600 text-white' : 'bg-gray-300'
                }`}
              >
                {formData.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
