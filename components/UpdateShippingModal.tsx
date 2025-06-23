"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Ship } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpdateShippingModal({
  quoteId,
  current,
  onSuccess,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(current || {});

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(
      `http://127.0.0.1:8000/quotes/${quoteId}/shipping/update/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `JWT ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    if (res.ok) {
      onSuccess();
      setIsOpen(false);
    } else {
      const err = await res.text();
      console.error("Update failed:", err);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full"
        variant="outline"
      >
        <Ship className="h-4 w-4 mr-2" /> Update Shipping
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-xl shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Update Shipping Info
          </Dialog.Title>
          <div className="grid grid-cols-2 gap-4">
            {[
              "port_name",
              "destination_country",
              "shipment_terms",
              "payment_terms",
              "shipment_method",
              "shipment_destination",
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.replace(/_/g, " ")}
                className="border p-2 rounded w-full"
                value={formData[field] || ""}
                onChange={handleChange}
              />
            ))}
            <textarea
              name="door_address"
              placeholder="Door Address"
              className="col-span-2 border p-2 rounded"
              rows={2}
              value={formData.door_address || ""}
              onChange={handleChange}
            />
            <textarea
              name="shipment_details"
              placeholder="Additional Shipment Details"
              className="col-span-2 border p-2 rounded"
              rows={2}
              value={formData.shipment_details || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
