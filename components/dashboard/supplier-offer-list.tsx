"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "active":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function SupplierOfferList() {
  const [offers, setOffers] = useState<any[]>([]); // ✅ Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Please login to view offers");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/suppliers/offers/", {
          headers: {
            Authorization: `JWT ${token}`, // ✅ Use JWT instead of Bearer
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          console.error("Authentication failed - redirecting to login");
          localStorage.removeItem("accessToken");
          window.location.href = "/auth/login";
          return;
        }

        if (res.ok) {
          const data = await res.json();
          
          // ✅ Check if data is an array, if not, handle it properly
          if (Array.isArray(data)) {
            setOffers(data);
          } else if (data && data.results && Array.isArray(data.results)) {
            // Handle paginated response
            setOffers(data.results);
          } else {
            console.error("Invalid offers format:", data);
            setOffers([]); // Set empty array as fallback
            setError("Invalid data format received");
          }
        } else {
          const errorData = await res.json().catch(() => ({}));
          console.error("Failed to fetch offers:", res.status, errorData);
          setError(`Failed to load offers: ${res.status}`);
        }
      } catch (err) {
        console.error("Network error:", err);
        setError("Network error occurred");
        setOffers([]); // ✅ Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">My Offers</h2>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">My Offers</h2>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">My Offers</h2>
          <p className="text-sm text-gray-600">Manage your product offers</p>
        </div>
        <Button className="rounded-full bg-black text-white hover:bg-black/90">
          Create New Offer
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Created</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-medium mb-2">No offers yet</p>
                    <p className="text-sm">Create your first offer to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              offers.map((offer) => (
                <tr key={offer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {offer.product_name || offer.title || "Product"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {offer.description || "No description"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    ${offer.price || "0.00"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={`${getStatusColor(offer.status || "pending")} border-0`}>
                      {offer.status ? offer.status.charAt(0).toUpperCase() + offer.status.slice(1) : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {offer.created_at ? new Date(offer.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }) : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}