"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import classNames from "classnames";

export default function EditQuotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    product_name: "",
    product_type: "",
    quantity: "",
    region: "",
    color: "",
    target_price: "",
    quality: "",
    specifications: "",
  });

  const requiredFields = [
    "product_name",
    "product_type",
    "quantity",
    "region",
    "quality",
    "specifications",
  ];

  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const localToken = localStorage.getItem("accessToken");
    setToken(localToken);

    if (!localToken) {
      alert("Token missing. Please log in.");
      router.push("/login");
      return;
    }

    const fetchQuote = async () => {
      try {
        const res = await fetch(
          `https://web-production-3f682.up.railway.app/quotes/${id}/`,
          {
            headers: {
              Authorization: `JWT ${localToken}`,
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch quote");

        const data = await res.json();
        setForm({
          product_name: (data.product_name || "").replace(/\[|\]|'/g, ""),
          product_type: (data.product_type || "").replace(/\[|\]|'/g, ""),
          quantity: String(data.quantity || ""),
          region: data.region || "",
          color: data.color || "",
          target_price: data.target_price || "",
          quality: data.quality || "",
          specifications: data.specifications || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        alert("Unable to fetch quote details.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getCompletionPercentage = () => {
    const filled = requiredFields.filter(
      (key) => form[key as keyof typeof form].trim() !== ""
    );
    return Math.round((filled.length / requiredFields.length) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Token missing. Please log in.");
      return;
    }

    const incompleteFields = requiredFields.filter(
      (field) => !form[field as keyof typeof form].trim()
    );
    if (incompleteFields.length > 0) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/quotes/${id}/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        const errorMsg = await res.text();
        console.error("Update failed:", res.status, errorMsg);
        alert("Update failed: " + errorMsg);
        return;
      }

      alert("Quote updated successfully!");
      router.push(`/dashboard/quotes/${id}`);
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error updating quote.");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-2">Complete Quote Details</h1>
      <p className="text-sm text-gray-500 mb-4">
        Completion: {getCompletionPercentage()}%
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {requiredFields.map((field) => {
          const isTextArea = field === "specifications";
          const value = form[field as keyof typeof form];
          const commonProps = {
            name: field,
            value,
            onChange: handleChange,
            placeholder: field
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            required: true,
            className: classNames({
              "border-red-500": !value.trim(),
            }),
          };
          return isTextArea ? (
            <Textarea key={field} {...commonProps} />
          ) : (
            <Input
              key={field}
              {...commonProps}
              type={field === "quantity" ? "number" : "text"}
            />
          );
        })}

        <Input
          name="color"
          value={form.color}
          onChange={handleChange}
          placeholder="Color"
        />
        <Input
          name="target_price"
          value={form.target_price}
          onChange={handleChange}
          placeholder="Target Price"
        />

        <Button type="submit" className="w-full">
          Update Quote
        </Button>
      </form>
    </div>
  );
}
