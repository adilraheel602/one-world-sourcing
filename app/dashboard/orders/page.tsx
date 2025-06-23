"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RecentOrders } from "@/components/dashboard/recent-orders";

export default function OrdersPage() {
  const router = useRouter();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track your orders</p>
        </div>
        <Button onClick={() => router.push("/dashboard/orders/new")}>
          + Place New Order
        </Button>
      </div>

      <RecentOrders />
    </div>
  );
}
