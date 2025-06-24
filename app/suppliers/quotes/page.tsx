"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SupplierQuote {
  id: string;
  product_name: string;
  quantity: number;
  region: string;
  status: string;
  response?: any;
}

export default function SupplierQuotesPage() {
  const [quotes, setQuotes] = useState<SupplierQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);

  const fetchQuotes = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        "https://web-production-3f682.up.railway.app/quotes/supplier/quotes/",
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );

      if (!res.ok) {
        console.error("Failed to fetch supplier quotes");
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Supplier quote data:", data);
      setQuotes(data);
      setShowQuotes(true);
    } catch (err) {
      console.error("Error fetching quotes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quotes</h1>
        <p className="text-gray-600">Manage quote requests and responses</p>
      </div>

      {!showQuotes && (
        <div className="text-center my-6">
          <Button onClick={fetchQuotes}>View Customer Quote Requests</Button>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : showQuotes && quotes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <h3 className="text-lg font-medium mb-2">No Quote Requests</h3>
          <p className="text-gray-600 mb-4">
            You haven't received any quote requests yet.
          </p>
        </div>
      ) : (
        showQuotes && (
          <div className="space-y-4">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="bg-white p-6 border rounded shadow-sm space-y-2"
              >
                <p>
                  <strong>Product:</strong> {quote.product_name}
                </p>
                <p>
                  <strong>Quantity:</strong> {quote.quantity}
                </p>
                <p>
                  <strong>Region:</strong> {quote.region}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-blue-600">{quote.status}</span>
                </p>

                {!quote.response ? (
                  <Button
                    onClick={() =>
                      (window.location.href = `/suppliers/quotes/${quote.id}`)
                    }
                  >
                    Submit Offer
                  </Button>
                ) : (
                  <p className="text-green-600 font-medium">
                    Offer Submitted ✅
                  </p>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
