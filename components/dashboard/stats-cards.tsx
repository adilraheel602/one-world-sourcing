// import type React from "react"
// import { ShoppingCart, FileText, Users, TrendingUp, Clock } from "lucide-react"

// interface StatsCardProps {
//   title: string
//   value: string
//   description: string
//   icon: React.ReactNode
//   trend?: {
//     value: string
//     positive: boolean
//   }
// }

// function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
//   return (
//     <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="text-sm font-medium text-gray-500">{title}</p>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">{icon}</div>
//       </div>
//       <div className="mt-4 flex items-center justify-between">
//         <p className="text-xs text-gray-500">{description}</p>
//         {trend && (
//           <div className={`flex items-center text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>
//             <TrendingUp className={`h-3 w-3 mr-1 ${!trend.positive && "transform rotate-180"}`} />
//             <span>{trend.value}</span>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export function StatsCards() {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//       <StatsCard
//         title="Active Orders"
//         value="12"
//         description="3 pending shipment"
//         icon={<ShoppingCart className="h-6 w-6 text-black" />}
//         trend={{ value: "24% ↑", positive: true }}
//       />
//       <StatsCard
//         title="Quote Requests"
//         value="8"
//         description="2 awaiting response"
//         icon={<FileText className="h-6 w-6 text-black" />}
//         trend={{ value: "12% ↑", positive: true }}
//       />
//       <StatsCard
//         title="Suppliers"
//         value="24"
//         description="6 new this month"
//         icon={<Users className="h-6 w-6 text-black" />}
//         trend={{ value: "8% ↑", positive: true }}
//       />
//       <StatsCard
//         title="Average Response"
//         value="18h"
//         description="Quote response time"
//         icon={<Clock className="h-6 w-6 text-black" />}
//         trend={{ value: "15% ↓", positive: true }}
//       />
//     </div>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, FileText, Users, TrendingUp, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500">{description}</p>
        {trend && (
          <div
            className={`flex items-center text-xs ${
              trend.positive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp
              className={`h-3 w-3 mr-1 ${!trend.positive && "rotate-180"}`}
            />
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function StatsCards() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/api/dashboard/stats/", {
        headers: {
          Authorization: `JWT ${token}`,
        },
      });
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  if (!stats) return <p className="text-gray-500">Loading stats...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Active Orders"
        value={stats.active_orders.toString()}
        description={`${stats.pending_shipment} pending shipment`}
        icon={<ShoppingCart className="h-6 w-6 text-black" />}
        trend={{ value: "24% ↑", positive: true }}
      />
      <StatsCard
        title="Quote Requests"
        value={stats.quote_requests.toString()}
        description={`${stats.awaiting_response} awaiting response`}
        icon={<FileText className="h-6 w-6 text-black" />}
        trend={{ value: "12% ↑", positive: true }}
      />
      <StatsCard
        title="Suppliers"
        value={stats.suppliers.toString()}
        description={`${stats.new_suppliers} new this month`}
        icon={<Users className="h-6 w-6 text-black" />}
        trend={{ value: "8% ↑", positive: true }}
      />
      <StatsCard
        title="Average Response"
        value="18h" // ← remove or replace with dummy/default if you no longer calculate this
        description="Quote response time"
        icon={<Clock className="h-6 w-6 text-black" />}
        trend={{ value: "15% ↓", positive: true }}
      />
    </div>
  );
}
