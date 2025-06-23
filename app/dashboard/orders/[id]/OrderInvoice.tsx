"use client";
import React, { forwardRef } from "react";

interface OrderInvoiceProps {
  order: any;
}

const OrderInvoice = forwardRef<HTMLDivElement, OrderInvoiceProps>(
  ({ order }, ref) => {
    return (
      <div
        ref={ref}
        className="p-8 bg-white text-black w-full max-w-[800px] mx-auto"
      >
        <h1 className="text-2xl font-bold mb-4">Invoice</h1>

        {/* Summary */}
        <div className="mb-6">
          <p>
            <strong>Order Number:</strong> {order.order_number}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.created_at).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
        </div>

        {/* Customer */}
        <div className="mb-6">
          <h2 className="font-semibold">Customer Information</h2>
          <p>{order.customer.name}</p>
          <p>{order.customer.email}</p>
          <p>{order.customer.company}</p>
        </div>

        {/* Products */}
        <div className="mb-6">
          <h2 className="font-semibold">Product</h2>
          <p>{order.product}</p>
          <p>
            Quantity: {order.quantity}, Unit Price: ${order.unit_price}, Total:
            ${order.total_price}
          </p>
          <p>
            Color: {order.details?.color}, Size: {order.details?.size}
          </p>
        </div>

        {/* Shipping */}
        <div className="mb-6">
          <h2 className="font-semibold">Shipping Info</h2>
          <p>Method: {order.shipping?.method}</p>
          <p>Carrier: {order.shipping?.carrier}</p>
          <p>Tracking: {order.shipping?.tracking_number}</p>
          <p>Address: {order.shipping?.shipping_address}</p>
        </div>

        {/* Total */}
        <div className="mt-6 border-t pt-4">
          <p>Subtotal: ${order.total_price}</p>
          <p>Shipping: ${order.shipping_cost}</p>
          <p className="font-bold text-lg">Total: ${order.grand_total}</p>
        </div>
      </div>
    );
  }
);

export default OrderInvoice;
