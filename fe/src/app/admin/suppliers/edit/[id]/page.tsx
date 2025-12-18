'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

// Update the Supplier type to match the database schema
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

export default function EditSupplier({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<{ message: string; validationErrors?: string[] } | null>(null);
  const [formData, setFormData] = useState<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>({
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

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await apiFetch<Supplier>(`/suppliers/${params.id}`);
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
      } catch (err) {
        const error = err as Error;
        setError({ 
          message: error.message || 'Failed to load supplier',
          validationErrors: (error as any).validationErrors
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle different input types appropriately
    const newValue = type === 'number' 
      ? (value === '' ? undefined : Number(value))
      : value;
      
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.preventDefault();
    setFormData(prev => ({
      ...prev,
      is_active: !prev.is_active
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Client-side validation
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
        payment_terms: formData.payment_terms ? Number(formData.payment_terms) : undefined,
        currency: formData.currency || 'INR',
        is_active: formData.is_active,
      };

      console.log('Updating supplier with data:', requestBody);

      await apiFetch(`/suppliers/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      // Show success message and redirect
      router.push('/admin/suppliers');
      router.refresh();
    } catch (err: any) {
      console.error('Error updating supplier:', err);
      
      let errorMessage = 'Failed to update supplier';
      const validationErrors: string[] = [];

      if (err.response) {
        if (Array.isArray(err.response)) {
          err.response.forEach((err: any) => {
            const field = err.path?.join?.('.') || err.field || 'Field';
            validationErrors.push(`${field}: ${err.message || 'Invalid value'}`);
          });
        } else if (err.response.errors) {
          Object.entries(err.response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => validationErrors.push(`${field}: ${msg}`));
            } else {
              validationErrors.push(`${field}: ${messages}`);
            }
          });
        } else if (err.response.message) {
          errorMessage = err.response.message;
        } else if (err.response.error) {
          errorMessage = err.response.error;
        } else if (typeof err.response === 'string') {
          errorMessage = err.response;
        }
      }

      setError({ 
        message: errorMessage,
        validationErrors: validationErrors.length > 0 ? validationErrors : undefined
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Supplier</h1>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
          >
            Back to List
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error.message}
                  {error.validationErrors && (
                    <ul className="mt-2 list-disc pl-5">
                      {error.validationErrors.map((err, index) => (
                        <li key={index} className="text-sm text-red-700">{err}</li>
                      ))}
                    </ul>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Name */}
              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Code */}
              <div className="sm:col-span-3">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  id="code"
                  required
                  value={formData.code}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Contact Person */}
              <div className="sm:col-span-3">
                <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
                  Contact Person
                </label>
                <input
                  type="text"
                  name="contact_person"
                  id="contact_person"
                  value={formData.contact_person || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Email */}
              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Tax Number */}
              <div className="sm:col-span-3">
                <label htmlFor="tax_number" className="block text-sm font-medium text-gray-700">
                  Tax Number
                </label>
                <input
                  type="text"
                  name="tax_number"
                  id="tax_number"
                  value={formData.tax_number || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows={3}
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Payment Terms */}
              <div className="sm:col-span-2">
                <label htmlFor="payment_terms" className="block text-sm font-medium text-gray-700">
                  Payment Terms (days)
                </label>
                <input
                  type="number"
                  name="payment_terms"
                  id="payment_terms"
                  min="0"
                  value={formData.payment_terms || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Currency */}
              <div className="sm:col-span-2">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency || 'INR'}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              {/* Status */}
              <div className="sm:col-span-2 flex items-end">
                <div className="flex items-center h-10">
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`${
                      formData.is_active ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    role="switch"
                    aria-checked={formData.is_active}
                  >
                    <span className="sr-only">Toggle status</span>
                    <span
                      aria-hidden="true"
                      className={`${
                        formData.is_active ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                    ></span>
                  </button>
                  <span className="ml-3">
                    <span className="text-sm font-medium text-gray-700">
                      {formData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}