// fe/src/app/pricing/price-lists/page.tsx
"use client";

import Link from "next/link";

export default function PriceListsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Price Lists</h1>
        <Link
          href="/pricing/price-lists/create"
          className="btn-primary"
        >
          Create Price List
        </Link>
      </div>
      
      {/* Price lists table will go here */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Mapped price lists will go here */}
          </tbody>
        </table>
      </div>
    </div>
  );
}