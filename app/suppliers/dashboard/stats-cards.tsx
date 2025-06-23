// components/dashboard/supplier-stats-cards.tsx
import React from "react";

// Define the shape of the stats data
interface Stats {
  active_orders: number;
  quote_requests: number;
  suppliers: number;
  average_response: string;
}

// Define the props interface
interface SupplierStatsCardsProps {
  stats: Stats;
}

export function StatsCards({ stats }: SupplierStatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <p>Active Orders</p>
        <h2 className="text-xl">{stats.active_orders}</h2>
        <p>0 pending shipment <span className="text-green-500">↓24%</span></p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p>Quote Requests</p>
        <h2 className="text-xl">{stats.quote_requests}</h2>
        <p>0 awaiting response <span className="text-green-500">↑12%</span></p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p>Suppliers</p>
        <h2 className="text-xl">{stats.suppliers}</h2>
        <p>1 new this month <span className="text-green-500">↑8%</span></p>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <p>Average Response</p>
        <h2 className="text-xl">{stats.average_response}</h2>
        <p>Quote response time <span className="text-green-500">↓15%</span></p>
      </div>
    </div>
  );
}