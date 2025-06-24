"use client";

import { useEffect, useState } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { RecentQuotes } from "@/components/dashboard/recent-quotes";
import { SupplierList } from "@/components/dashboard/supplier-list";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const res = await fetch(
        "https://web-production-3f682.up.railway.app/auth/users/me/",
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-semibold">
            {user?.first_name || user?.email || "Guest"}
          </span>
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders />
        <RecentQuotes />
      </div>

      <SupplierList />
    </div>
  );
}
