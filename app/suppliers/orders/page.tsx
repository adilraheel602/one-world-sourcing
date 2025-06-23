"use client";

import { Button } from "@/components/ui/button";

export default function SupplierOrdersPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600">Manage your orders and shipments</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">You haven't received any orders yet.</p>
        <Button>Create Sample Order</Button>
      </div>
    </div>
  );
}