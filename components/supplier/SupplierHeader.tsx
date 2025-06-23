"use client";

import { useEffect, useState } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupplierHeader() {
  const [user, setUser] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    // Fetch user
    fetch("http://127.0.0.1:8000/auth/users/me/", {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data));

    // Fetch supplier
    fetch("http://127.0.0.1:8000/api/suppliers/profile/", {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setSupplier(data));
  }, []);

  const badgeImage = supplier?.package_plan
    ? `/badges/${supplier.package_plan}.png`
    : null;

  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-8 h-8">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-600" />
        </div>
        {badgeImage && (
          <img
            src={badgeImage}
            alt={`${supplier.package_plan} badge`}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow"
            title={supplier.package_plan}
          />
        )}
      </div>
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user?.first_name || "Supplier"}</p>
        <p className="text-xs text-gray-500">{user?.email || "email"}</p>
      </div>
    </div>
  );
}
