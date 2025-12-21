"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../../lib/api";

interface FormError {
  message: string;
  validationErrors: string[];
}

export default function CreateSupplier() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<FormError | null>(null);
  
  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    setError(null);
    
    try {
      const formValues = Object.fromEntries(formData.entries());
      
      // Log form values for debugging
      console.log('Form values:', formValues);
      
      // Basic client-side validation
      const validationErrors: string[] = [];
      if (!formValues.name?.toString().trim()) validationErrors.push('Name is required');
      if (!formValues.code?.toString().trim()) validationErrors.push('Code is required');
      
      if (validationErrors.length > 0) {
        setError({
          message: 'Please fix the following errors:',
          validationErrors,
        });
        setSaving(false);
        return;
      }
      
      // Prepare the request body according to the server schema
      const requestBody = {
        name: formValues.name.toString().trim(),
        code: formValues.code.toString().trim(),
        contact_person: formValues.contact_person?.toString().trim() || undefined,
        email: formValues.email?.toString().trim() || undefined,
        phone: formValues.phone?.toString().trim() || undefined,
        tax_number: formValues.tax_number?.toString().trim() || undefined,
        address: formValues.address?.toString().trim() || undefined,
        // Set default values for other optional fields
        is_active: true,
      };
      
      console.log('Sending request with body:', requestBody);
      
      const response = await apiFetch('/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Supplier created successfully:', response);
      
      // Force a refresh of the suppliers list
      router.push("/admin/suppliers");
      router.refresh();
    } catch (e: any) {
      console.error('Error in handleSubmit:', e);
      
      let errorMessage = 'Failed to create supplier';
      const validationErrors: string[] = [];

      // Try to extract server validation errors
      if (e?.response) {
        // Handle different error response formats
        if (Array.isArray(e.response)) {
          // Handle array of errors
          e.response.forEach((err: any) => {
            const field = err.path?.join?.('.') || err.field || 'Field';
            validationErrors.push(`${field}: ${err.message || 'Invalid value'}`);
          });
        } else if (e.response.errors) {
          // Handle errors object
          Object.entries(e.response.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => validationErrors.push(`${field}: ${msg}`));
            } else {
              validationErrors.push(`${field}: ${messages}`);
            }
          });
        } else if (e.response.message) {
          // Handle simple message
          errorMessage = e.response.message;
        } else if (e.response.error) {
          // Handle error field
          errorMessage = e.response.error;
        } else if (typeof e.response === 'string') {
          // Handle string response
          errorMessage = e.response;
        } else if (e.response.details) {
          // Handle validation error details
          Object.entries(e.response.details).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg: string) => validationErrors.push(`${field}: ${msg}`));
            } else {
              validationErrors.push(`${field}: ${messages}`);
            }
          });
        }
        
        // If we found validation errors, update the message
        if (validationErrors.length > 0) {
          errorMessage = 'Please fix the following errors:';
        }
      } else if (e.message) {
        // Handle standard Error objects
        errorMessage = e.message;
      }
      
      // Log the error for debugging
      console.log('Form submission error:', {
        error: e,
        status: e.status,
        response: e.response,
        validationErrors,
        errorMessage
      });

      setError({
        message: errorMessage,
        validationErrors,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Supplier</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error.message}</p>
              {error.validationErrors.length > 0 && (
                <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                  {error.validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Supplier name"
            />
          </div>

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              id="code"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., SUP-001"
            />
          </div>

          <div>
            <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700">
              Contact Person
            </label>
            <input
              type="text"
              name="contact_person"
              id="contact_person"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Full name of contact person"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="contact@example.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="tax_number" className="block text-sm font-medium text-gray-700">
              Tax Number
            </label>
            <input
              type="text"
              name="tax_number"
              id="tax_number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="e.g., GSTIN or VAT number"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            id="address"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save Supplier'}
          </button>
        </div>
      </form>
    </div>
  );
}
