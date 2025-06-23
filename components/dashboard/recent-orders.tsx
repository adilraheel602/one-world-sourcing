"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  order_number: string;
  product: string;
  created_at: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  grand_total: string;
  quantity: number;
}

const getStatusColor = (status: Order["status"]) => {
  switch (status) {
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-yellow-100 text-yellow-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token =
        localStorage.getItem("adminAccessToken") ||
        localStorage.getItem("accessToken");
      if (!token) {
        console.error("Token not found");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/orders/my/", {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        });

        const text = await res.text();

        if (!res.ok) {
          console.error("Orders API failed:", text);
          throw new Error(`Error ${res.status}: ${text}`);
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (err) {
          console.error("Invalid JSON response for orders", err);
          return;
        }

        setOrders(data);
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading recent orders...</div>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link href="/dashboard/orders">
            <Button variant="outline" size="sm" className="rounded-full">
              View All
            </Button>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.order_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {order.product} ({order.quantity} units)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={`${getStatusColor(order.status)} border-0`}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  ${parseFloat(order.grand_total).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link
                    href={`/dashboard/orders/${order.id}`}
                    className="text-black hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
