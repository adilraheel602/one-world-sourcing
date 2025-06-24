"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreateQuotePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supplierId = searchParams.get("supplier");

  const [product, setProduct] = useState("");
  const [productType, setProductType] = useState("Standard");
  const [quantity, setQuantity] = useState(100);
  const [region, setRegion] = useState("Global");
  const [targetPrice, setTargetPrice] = useState("");
  const [quality, setQuality] = useState("Standard");
  const [specifications, setSpecifications] = useState("");
  const [category, setCategory] = useState("Electronics & Technology");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!supplierId) {
      alert("Missing supplier ID. Cannot submit quote.");
      return;
    }

    const res = await fetch(
      "https://web-production-3f682.up.railway.app/quotes/new/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          product_name: product,
          product_type: productType,
          quantity,
          region,
          target_price: targetPrice,
          quality,
          specifications,
          supplier: parseInt(supplierId),
          category: category,
        }),
      }
    );

    let result = null;
    try {
      result = await res.json();
    } catch (err) {
      const text = await res.text();
      console.error("Raw error response:", text);
      alert("Unexpected server error. Check backend.");
      return;
    }

    if (!res.ok) {
      console.error("Quote create error:", result);
      alert(result?.error || "There was an error submitting your quote.");
      return;
    }

    // ✅ Success
    router.push(`/dashboard/quotes/${result.id}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Request a Quote</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {supplierId && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Supplier ID
            </label>
            <Input value={supplierId} disabled />
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Product Name
          </label>
          <Input
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          {/* Category Dropdown */}
          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="Textiles & Apparel">Textiles & Apparel</option>
              <option value="Steel & Metals">Steel & Metals</option>
              <option value="Machinery & Equipment">
                Machinery & Equipment
              </option>
              <option value="Electronics & Technology">
                Electronics & Technology
              </option>
              <option value="Furniture & Home Decor">
                Furniture & Home Decor
              </option>
              <option value="Automotive Parts">Automotive Parts</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Chemicals & Materials">
                Chemicals & Materials
              </option>
              <option value="Plastics & Rubber">Plastics & Rubber</option>
              <option value="Agriculture & Food Processing">
                Agriculture & Food Processing
              </option>
              <option value="Medical & Healthcare">Medical & Healthcare</option>
              <option value="Other">Other</option>
            </select>

            {/* Dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              ▼
            </div>
          </div>

          {/* Product Type Input */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Product Type
            </label>
            <Input
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Quantity</label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Region</label>
          <Input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Target Price (optional)
          </label>
          <Input
            type="text"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Quality</label>
          <Input
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Specifications
          </label>
          <Textarea
            value={specifications}
            onChange={(e) => setSpecifications(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Quote Request
        </Button>
      </form>
    </div>
  );
}
