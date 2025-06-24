"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quoteId, setQuoteId] = useState<string | null>(null);

  useEffect(() => {
    if (!quoteId) {
      alert("Missing quote ID. Please go back and try again.");
      router.push("/dashboard/quotes");
    }
  }, []);

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [quote, setQuote] = useState<any>(null);
  const [shipmentMethod, setShipmentMethod] = useState("sea");
  const [shipmentDestination, setShipmentDestination] = useState("port");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [doorAddress, setDoorAddress] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Login required");
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get("quoteId");
    if (id) setQuoteId(id);
  }, [searchParams]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await fetch(
          "https://web-production-3f682.up.railway.app/api/suppliers/list/",
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        const data = await res.json();
        if (Array.isArray(data.results)) {
          setSuppliers(data.results);
        } else {
          console.error("Unexpected suppliers response:", data);
          setSuppliers([]);
        }
      } catch (err) {
        console.error("Failed to fetch suppliers:", err);
        setSuppliers([]);
      }
    };

    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!quoteId) return;
      const token = localStorage.getItem("accessToken");
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/quotes/${quoteId}/`,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setQuote(data);
      } else {
        console.error("Failed to fetch quote.");
      }
    };

    fetchQuote();
  }, [quoteId]);

  const saveShippingToQuote = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !quoteId) return false;

    const res = await fetch(
      `https://web-production-3f682.up.railway.app/quotes/${quoteId}/shipping/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          shipment_method: shipmentMethod,
          shipment_destination: shipmentDestination,
          destination_country: destinationCountry,
          door_address: doorAddress,
          shipment_details: shipmentDetails,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("Shipping save failed:", err);
      alert("Failed to save shipping details.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Please login first");
      return router.push("/login");
    }

    const ok = await saveShippingToQuote();
    if (!ok) return;

    const res = await fetch(
      "https://web-production-3f682.up.railway.app/api/orders/new/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          quote: quoteId,
          notes,
          product, // ✅ ADD THIS
          quantity, // ✅ ADD THIS
          supplier: supplierId,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error(errText);
      return alert("Order creation failed. See console for details.");
    }

    const data = await res.json();
    console.log("Access token:", token);
    router.push(`/dashboard/orders/${data.id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white border rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Place New Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Product name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required
        />
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="w-full border p-2 rounded text-sm"
          required
        >
          <option value="">Select supplier</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Optional notes"
          className="w-full border p-2 rounded text-sm"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <h2 className="text-lg font-semibold">Shipping Information</h2>
        <select
          className="w-full border p-2 rounded text-sm"
          value={shipmentMethod}
          onChange={(e) => setShipmentMethod(e.target.value)}
        >
          <option value="sea">Sea</option>
          <option value="air">Air</option>
          <option value="express">Express</option>
        </select>

        <select
          className="w-full border p-2 rounded text-sm"
          value={shipmentDestination}
          onChange={(e) => setShipmentDestination(e.target.value)}
        >
          <option value="port">To Port</option>
          <option value="door">To Door</option>
        </select>

        <Input
          placeholder="Destination Country"
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
          required
        />

        {shipmentDestination === "door" && (
          <Textarea
            placeholder="Door Address"
            value={doorAddress}
            onChange={(e) => setDoorAddress(e.target.value)}
          />
        )}

        <Textarea
          placeholder="Shipment Details (Optional)"
          value={shipmentDetails}
          onChange={(e) => setShipmentDetails(e.target.value)}
        />

        <Button type="submit" className="w-full">
          Submit Order
        </Button>
      </form>
    </div>
  );
}
