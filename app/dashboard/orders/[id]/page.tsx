"use client";

import {
  use,
  useEffect,
  useState,
  useRef,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useReactToPrint } from "react-to-print";
import OrderTimeline from "@/components/dashboard/OrderTimeline";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Download,
  FileText,
  MapPin,
  MessageSquare,
  Printer,
  Send,
  Ship,
  Truck,
  User,
  Building,
  Package,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import OrderInvoice from "./OrderInvoice";

async function getValidToken(): Promise<string | null> {
  let token = localStorage.getItem("accessToken");
  const refresh = localStorage.getItem("refreshToken");

  const check = await fetch(
    "https://web-production-3f682.up.railway.app/auth/users/me/",
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );
  if (check.status === 401 && refresh) {
    const refreshRes = await fetch(
      "https://web-production-3f682.up.railway.app/auth/jwt/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      }
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();
      localStorage.setItem("accessToken", data.access);
      return data.access;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      alert("Session expired. Please log in again.");
      window.location.href = "/login";
      return null;
    }
  }

  return token;
}
export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const printRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState("shipping");

  // const [tab, setTab] = useState(
  //   () => localStorage.getItem("activeTab") || "shipping"
  // );
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setTab(storedTab);
    }
  }, []);
  const handleTabChange = (value: string) => {
    setTab(value);
    localStorage.setItem("activeTab", value);
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle:
      order && order.order_number ? `Invoice-${order.order_number}` : "Invoice",
  });

  const fetchMessages = async () => {
    const token = await getValidToken();
    if (!token) return;

    const res = await fetch(
      `https://web-production-3f682.up.railway.app/api/orders/${id}/messages/`,
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Messages fetch failed:", res.status, errorText);
      return;
    }

    const data = await res.json();
    setMessages(data);
  };

  useEffect(() => {
    if (!id) return;
    fetchMessages();
  }, [id]);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = await getValidToken();
      if (!token) return;

      const res = await fetch(
        `https://web-production-3f682.up.railway.app/orders/${id}/`,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );

      const text = await res.text();

      if (!res.ok) {
        console.error("Order fetch failed:", text);
        return;
      }

      const data = JSON.parse(text);
      console.log("Fetched order:", data); // ✅ This logs the actual response
      setOrder(data);
      fetchEvents();
    };

    if (!id) return;
    fetchOrder();
  }, [id]);

  const fetchEvents = async () => {
    const token = await getValidToken();
    if (!token) return;

    try {
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/api/orders/${id}/timeline/`,
        {
          headers: {
            Authorization: `JWT ${token}`,
          },
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (Array.isArray(data?.events)) {
        setEvents(data.events);
      } else {
        console.error("Expected array but got:", data);
        setEvents([]); // fallback to prevent crash
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setEvents([]);
    }
  };

  if (!order) return <div className="p-6">Loading...</div>;

  const sendMessage = async () => {
    const token = await getValidToken();
    if (!token) return;

    const res = await fetch(
      `https://web-production-3f682.up.railway.app/api/orders/${id}/messages/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({
          content: newMessage,
        }),
      }
    );

    const data = await res.json();
    setNewMessage("");
    await fetchMessages(); // ✅ refetch after sending
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-indigo-100 text-indigo-800";
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* LEFT SIDE */}
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-gray-500">{order.order_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" /> Print Invoice
            </Button>
          </div>
        </div>

        {/* Hidden Printable Invoice */}
        <div className="hidden">
          <div ref={componentRef}>
            <OrderInvoice order={order} />
          </div>
        </div>

        <div className="bg-white rounded-md border p-6 space-y-4">
          <h2 className="font-semibold text-lg">Order Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Order Date</p>
              <p>{new Date(order.created_at).toDateString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p>${parseFloat(order.grand_total).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-500">Customer</p>
              <p>{order.customer.name}</p>
            </div>
            <div>
              <p className="text-gray-500">Supplier</p>
              <p>{order.supplier?.name}</p>
            </div>
          </div>
          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
        </div>

        <div className="bg-white rounded-md border p-6">
          <h2 className="font-semibold text-lg mb-4">Products</h2>
          <table className="w-full text-sm">
            <thead className="text-left bg-gray-50">
              <tr>
                <th className="py-2">Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-4">
                  {order.product}
                  <div className="text-xs text-gray-500">
                    Color: {order.details?.[0]?.color} | Size:{" "}
                    {order.details?.[0]?.size}
                  </div>
                </td>
                <td>{order.quantity}</td>
                <td>${parseFloat(order.unit_price).toFixed(2)}</td>
                <td>${parseFloat(order.total_price).toFixed(2)}</td>
              </tr>
              <tr className="border-t">
                <td colSpan={2}></td>
                <td className="py-2 font-medium">Shipping</td>
                <td>${parseFloat(order.shipping_cost).toFixed(2)}</td>
              </tr>
              <tr className="border-t">
                <td colSpan={2}></td>
                <td className="py-2 font-bold">Total</td>
                <td className="font-bold">
                  ${parseFloat(order.grand_total).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          defaultValue="shipping"
          className="w-full mt-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent
            value="shipping"
            className="bg-white border p-6 rounded-md mt-2"
          >
            <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>

            {!order.shipping ? (
              <div className="text-red-600 text-sm">
                <p className="mb-2">
                  🚨 Shipping information is missing. Please complete shipping
                  details with your supplier or contact support.
                </p>

                {order.quote_id ? (
                  <Button
                    onClick={() =>
                      router.push(
                        `/dashboard/quotes/${order.quote_id}/edit?tab=shipping`
                      )
                    }
                    className="mt-2"
                  >
                    Complete Shipping Details
                  </Button>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">
                    No quote associated. Unable to navigate to quote editor.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Method</p>
                  <p>{order.shipping?.method}</p>
                </div>
                <div>
                  <p className="text-gray-500">Carrier</p>
                  <p>{order.shipping?.carrier}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tracking</p>
                  <p>{order.shipping?.tracking_number}</p>
                </div>
                <div>
                  <p className="text-gray-500">Estimated</p>
                  <p>{order.shipping?.estimated_delivery}</p>
                </div>
                <div className="col-span-2 mt-4 flex items-start">
                  <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2" />
                  <p>{order.shipping?.shipping_address}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="payment"
            className="bg-white border p-6 rounded-md mt-2"
          >
            <p className="text-gray-500 text-sm">
              Payment section coming soon...
            </p>
          </TabsContent>

          <TabsContent
            value="messages"
            className="bg-white border p-6 rounded-md mt-2 max-h-[400px] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-4">Messages</h3>
            <div className="space-y-4">
              {Array.isArray(messages) ? (
                messages.map((msg) => (
                  <div key={msg.id} className="bg-gray-100 p-3 rounded mb-2">
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-500">{msg.sender_name}</p>
                  </div>
                ))
              ) : (
                <p className="text-red-500">No messages found.</p>
              )}
            </div>
            <div className="flex mt-4 gap-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
                placeholder="Type your message..."
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4 mr-1" />
                Send
              </Button>
            </div>
          </TabsContent>

          <TabsContent
            value="timeline"
            className="bg-white rounded-lg border p-6 mt-4"
          >
            <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>
            <div className="space-y-8 relative">
              {events.map(
                (
                  event: {
                    event: string;
                    date: string | number | Date;
                    time: string;
                    user: string;
                  },
                  index: number
                ) => (
                  <div key={index} className="flex items-start relative">
                    {index < order.events.length - 1 && (
                      <div className="absolute top-0 left-4 h-full w-px bg-gray-300 z-0"></div>
                    )}
                    <div className="z-10 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mr-4">
                      {index === 0 ? (
                        <Package className="h-4 w-4" />
                      ) : index === order.events.length - 1 ? (
                        <Truck className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium">{event.event}</p>
                      <Badge className="w-fit mt-1 bg-gray-100 text-gray-800">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{event.time}</span>
                        <span className="mx-2">•</span>
                        <User className="h-3 w-3 mr-1" />
                        <span>{event.user}</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6">
        <div className="bg-white rounded-md border p-6">
          <h2 className="font-semibold text-lg mb-4">Customer</h2>
          <p>
            <strong>Name:</strong> {order.customer.name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.customer.phone || "-"}
          </p>
          <p>
            <strong>Company:</strong> {order.customer.company || "-"}
          </p>
        </div>

        <div className="bg-white rounded-md border p-6">
          <h2 className="font-semibold text-lg mb-4">Supplier</h2>
          <div className="flex items-center gap-4">
            <Image
              src={order.supplier?.logo || "/placeholder.svg"}
              alt={order.supplier?.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
            <div>
              <p>{order.supplier?.name}</p>
              <p className="text-sm text-gray-500">
                {order.supplier?.location}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md border p-6">
          <h2 className="font-semibold text-lg mb-4">Documents</h2>
          {order.documents?.map((doc: any) => (
            <div
              key={doc.id}
              className="flex justify-between items-center border rounded-md px-4 py-2 mb-2"
            >
              <div className="flex items-center gap-2">
                <FileText className="text-gray-500" />
                <div>
                  <p className="text-sm">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.date_added}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => window.open(doc.file, "_blank")}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-md border p-6 space-y-3">
          <h2 className="font-semibold text-lg mb-2">Order Actions</h2>
          <Button
            onClick={() => router.push("/dashboard/messages")}
            className="w-full"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Supplier
          </Button>
          <Button variant="outline" className="w-full">
            <CreditCard className="h-4 w-4 mr-2" />
            View Payment Details
          </Button>
          <Button variant="outline" className="w-full">
            <Ship className="h-4 w-4 mr-2" />
            Track Shipment
          </Button>
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
        </div>
      </div>
    </div>
  );
}
