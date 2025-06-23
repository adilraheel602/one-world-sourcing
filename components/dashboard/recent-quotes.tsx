"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    case "expired":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      setError(null);

      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("accessToken");
      if (!token) {
        setError("Please login to view quotes");
        window.location.href = "/auth/login";
        return;
      }

      const res = await fetch("http://127.0.0.1:8000/quotes/my/", {
        headers: {
          Authorization: `JWT ${token}`, // Changed from Bearer to JWT
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        // Token expired or invalid
        console.error("Authentication failed - redirecting to login");
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setQuotes(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to fetch quotes:", res.status, errorData);
        setError(`Failed to load quotes: ${res.status}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Quotes</h2>
          <Link href="/dashboard/quotes">
            <Button variant="outline" size="sm" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Recent Quotes</h2>
          <Link href="/dashboard/quotes">
            <Button variant="outline" size="sm" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
        <div className="p-6 text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchQuotes} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Quotes</h2>
        <Link href="/dashboard/quotes">
          <Button variant="outline" size="sm" className="rounded-full">
            View All
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Quote ID</th>
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Quantity</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {quotes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No quotes found
                </td>
              </tr>
            ) : (
              quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {quote.quote_number}
                  </td>
                  <td className="px-6 py-4 text-sm">{quote.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(quote.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={`${getStatusColor(quote.status)} border-0`}
                    >
                      {quote.status.charAt(0).toUpperCase() +
                        quote.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm">{quote.quantity} units</td>
                  <td className="px-6 py-4 text-sm text-right">
                    <Link
                      href={
                        quote.status === "pending" && !quote.is_complete
                          ? `/dashboard/quotes/${quote.id}/edit`
                          : `/dashboard/quotes/${quote.id}`
                      }
                      className="text-black hover:underline"
                    >
                      {quote.status === "pending" && !quote.is_complete
                        ? "Complete Now"
                        : "Details"}
                    </Link>
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
