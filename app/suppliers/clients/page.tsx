"use client";

import { Button } from "@/components/ui/button";

export default function SupplierClientsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600">Manage your client relationships</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No Clients Yet</h3>
        <p className="text-gray-600 mb-4">You haven't connected with any clients yet.</p>
        <Button>Find Clients</Button>
      </div>
    </div>
  );
}