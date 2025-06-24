"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Import Params type
import useAuth from "@/hooks/useAuth";
import useAuthToken from "@/hooks/useAuthToken";
type Params = { id: string };
import UpdateShippingModal from "@/components/UpdateShippingModal";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import {
  ArrowLeft,
  Download,
  Lock,
  Calendar,
  MessageSquare,
  Package,
  FileText,
  Send,
  Clock,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import UnlockSupplierModal from "@/components/UnlockSupplierModal";

// Define interfaces for type safety
interface Quote {
  id: number;
  quote_number: string;
  product_name: string;
  quantity: number;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_company: string;
  region: string;
  product_type: string;
  color: string;
  quality: string;
  specifications: string;
  target_price: string;
  response: QuoteResponse | null;
  shipping_details: ShippingDetails | null;
  timeline: TimelineEvent[];
  conversations: { id: number; type: string }[];
  supplier?: {
    id: string;
    name: string;
    country: string;
    verified: boolean;
  };
}

interface QuoteResponse {
  provided_date: string;
  expiration_date: string;
  unit_price: number;
  total_price: number;
  shipping_cost: number;
  grand_total: number;
  lead_time: string;
  minimum_order: string;
  payment_terms: string;
  notes: string;
  alternatives: Alternative[];
  attachments: Attachment[];
}

interface ShippingDetails {
  port_name: string;
  destination_country: string;
  shipment_terms: string;
  payment_terms: string;
  shipment_method: string;
  shipment_destination: string;
  door_address?: string;
  shipment_details?: string;
}

interface Alternative {
  description: string;
  unit_price: number;
  benefits: string;
}

interface Attachment {
  name: string;
  file_size: number;
  file: string;
  created_at: string;
}

interface TimelineEvent {
  event: string;
  date: string;
  time: string;
  user: string;
}

interface Message {
  id: number;
  sender: User;
  content: string;
  sent_at: string;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  company?: string;
}

export default function QuoteDetailPage() {
  // Unwrap params using React.use() with proper typing
  useAuth();
  const { token, refresh } = useAuthToken();
  const [showShippingPrompt, setShowShippingPrompt] = useState(false);
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [matchedSuppliers, setMatchedSuppliers] = useState([]);

  const handleUnlockSupplier = () => {
    setShowUnlockModal(true);
  };

  const confirmUnlockSupplier = async () => {
    if (!quote) return;
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/quotes/${quote.id}/unlock-supplier/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
        }
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("Unlock failed:", err);
        alert("Failed to unlock supplier.");
      } else {
        alert("Supplier unlocked successfully!");
        setShowUnlockModal(false);
        fetchQuote(); // 🔁 refresh data
      }
    } catch (err) {
      console.error("Unlock error:", err);
      alert("Something went wrong.");
    }
  };

  // Rest of the code remains unchanged...
  const fetchMessages = async (
    conversationId: number | null,
    token: string
  ) => {
    if (!conversationId) {
      console.error("No conversation ID available");
      return;
    }
    try {
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/api/messages/${conversationId}/`,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      const contentType = res.headers.get("Content-Type");
      if (!res.ok) {
        const text = await res.text();
        console.error("Message fetch failed:", res.status, text);
      } else if (!contentType?.includes("application/json")) {
        const html = await res.text();
        console.error("Expected JSON in fetchMessages but got HTML:", html);
      } else {
        const updated = await res.json();
        setMessages(updated);
      }
    } catch (error) {
      console.error("Fetch messages error:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!newMessage.trim() || !token) return;

    try {
      let convId = conversationId;
      if (!convId && quote?.id) {
        const convRes = await fetch(
          `https://web-production-3f682.up.railway.app/quotes/${quote.id}/conversation/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${token}`,
            },
          }
        );
        const convData = await convRes.json();
        convId = convData.id;
        setConversationId(convId);
      }

      if (!convId) {
        console.error("Conversation ID not created");
        return;
      }

      const res = await fetch(
        `https://web-production-3f682.up.railway.app/api/messages/send/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({
            conversation_id: convId,
            content: newMessage,
          }),
        }
      );

      if (res.ok) {
        setNewMessage("");
        fetchMessages(convId, token);
      } else {
        const errText = await res.text();
        console.error("Send message failed:", errText);
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchQuote = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      console.warn("Access token missing");
      return;
    }

    try {
      const res = await fetchWithAuth(`/quotes/${id}/`, {
        method: "GET",
      });

      const contentType = res.headers.get("Content-Type");
      if (!res.ok) {
        const text = await res.text();
        console.error("Fetch failed:", res.status, text);
      } else if (!contentType?.includes("application/json")) {
        const text = await res.text();
        console.error("Expected JSON but got HTML:", text);
      } else {
        const data = await res.json();

        console.log("Fetched Quote:", data);

        // ✅ Redirect user if quote is incomplete and pending
        if (data.status === "pending" && data.is_complete === false) {
          router.push(`/dashboard/quotes/${data.id}/edit`);
          return;
        }
        if (!data.shipping_details) {
          setShowShippingPrompt(true);
        }

        setQuote(data);

        const supplierRes = await fetch(
          `https://web-production-3f682.up.railway.app/api/suppliers/match/${data.id}/`,
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );

        if (supplierRes.ok) {
          const supplierList = await supplierRes.json();
          setMatchedSuppliers(supplierList);
        } else {
          console.warn("Failed to fetch matched suppliers");
        }

        const convId = data?.conversations?.find(
          (c: any) => c.type === "quote"
        )?.id;
        if (convId) {
          setConversationId(convId);
        }

        const userRes = await fetch(
          `https://web-production-3f682.up.railway.app/auth/users/me/`,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        if (userRes.ok) {
          const user = await userRes.json();
          setCurrentUser(user);
        }
      }
    } catch (err) {
      console.error("Quote fetch error:", err);
    } finally {
      setTimelineLoading(false);
    }
  };

  // ✅ Fetch messages when conversationId is set
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (conversationId && token) {
      fetchMessages(conversationId, token);
    }
  }, [conversationId]);

  // 🔄 Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (id) fetchQuote(); // <-- This is currently missing!
  }, [id]);

  const timeline: TimelineEvent[] = quote?.timeline || [];

  if (!quote) return <div className="p-6">Loading quote...</div>;

  const handleRequestToSupplier = async () => {
    if (!quote?.supplier?.id) {
      alert("No supplier associated with this quote.");
      return;
    }

    console.log(
      "Sending request to:",
      quote.id,
      "with supplier:",
      quote.supplier?.id
    ); // ✅ Add here

    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        `https://web-production-3f682.up.railway.app/quotes/${quote.id}/request-to-supplier/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ supplier_id: quote.supplier.id }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert("Quote request sent to supplier!");
      } else {
        const err = await res.text();
        console.error("Request failed:", err);
        alert("Failed to request quote from supplier.");
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong.");
    }
  };

  const handleRequestSupplier = async () => {
    if (!quote?.supplier) {
      alert("No supplier associated with this quote.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("You must be logged in to request a quote.");
        return;
      }

      const res = await fetch(
        `https://web-production-3f682.up.railway.app/quotes/${quote.id}/request-to-supplier/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${token}`,
          },
          body: JSON.stringify({ supplier_id: quote.supplier.id }),
        }
      );

      if (!res.ok) {
        const error = await res.text();
        console.error("Quote request failed:", error);
        alert("Failed to request quote.");
      } else {
        const data = await res.json();
        alert("Quote request sent successfully.");
        console.log("Request response:", data);
      }
    } catch (err) {
      console.error("Request supplier error:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Quote Details</h1>
              <p className="text-gray-500">{quote.quote_number}</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </Button>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Quote Summary</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Product</p>
              <p>{quote.product_name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Quantity</p>
              <p>{quote.quantity || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Date Submitted</p>
              <p>{new Date(quote.created_at).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Target Price</p>
              <p>{quote.target_price?.trim() ? quote.target_price : "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Your Name</p>
              <p>{quote.customer_name || "-"}</p>
            </div>
            <div>
              <p className="text-gray-500">Company</p>
              <p>{quote.customer_company || "-"}</p>
            </div>
          </div>
        </div>

        {showShippingPrompt && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-4">
            <p>
              Please provide shipping information to proceed with this quote.
            </p>
            <UpdateShippingModal
              quoteId={quote.id.toString()}
              current={null}
              onSuccess={() => {
                setShowShippingPrompt(false);
                fetchQuote();
              }}
            />
          </div>
        )}

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mt-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="supplier">Supplier</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent
            value="details"
            className="bg-white rounded-lg border p-6 mt-4"
          >
            <h3 className="text-lg font-semibold mb-4">Product Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Region of Origin</p>
                <p className="font-medium">{quote.region || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium">{quote.product_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Type</p>
                <p className="font-medium">{quote.product_type || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quantity</p>
                <p className="font-medium">
                  {quote.quantity?.toLocaleString() || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{quote.color || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Quality</p>
                <p className="font-medium">{quote.quality || "-"}</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-gray-500">Specifications</p>
              <p className="mt-1 text-sm">{quote.specifications || "-"}</p>
            </div>

            {quote.response && (
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Quote Response</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-gray-500">Quote Provided On</p>
                    <p>
                      {new Date(
                        quote.response.provided_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Valid Until</p>
                    <p>
                      {new Date(
                        quote.response.expiration_date
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Unit Price</p>
                    <p>${quote.response.unit_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Total Price</p>
                    <p>${quote.response.total_price}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Shipping Cost</p>
                    <p>${quote.response.shipping_cost}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Grand Total</p>
                    <p className="font-bold">${quote.response.grand_total}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Lead Time</p>
                    <p>{quote.response.lead_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Minimum Order</p>
                    <p>{quote.response.minimum_order}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Payment Terms</p>
                    <p>{quote.response.payment_terms}</p>
                  </div>
                </div>

                {quote.response.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-sm">{quote.response.notes}</p>
                  </div>
                )}

                {quote.response.alternatives?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">
                      Alternative Options
                    </p>
                    <div className="space-y-3">
                      {quote.response.alternatives.map(
                        (alt: Alternative, index: number) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-md border border-gray-200"
                          >
                            <p className="font-medium">{alt.description}</p>
                            <p className="text-sm">
                              Unit Price: ${alt.unit_price}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              Benefits: {alt.benefits}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
                {quote.response.attachments?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold mb-2">
                      Supplier Attachments
                    </h3>
                    <div className="space-y-2">
                      {quote.response.attachments.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                        >
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.file_size / (1024 * 1024)).toFixed(1)} MB •{" "}
                              {file.created_at}
                            </p>
                          </div>
                          <a
                            href={file.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                          >
                            <Download className="h-4 w-4 text-gray-500" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="shipping"
            className="bg-white rounded-lg border p-6 mt-4"
          >
            <h3 className="text-lg font-semibold mb-4">Shipping Information</h3>

            {!quote.shipping_details ? (
              <div className="text-sm text-gray-600">
                <p className="mb-3">
                  Shipping information has not been provided yet.
                </p>
                <UpdateShippingModal
                  quoteId={quote.id.toString()}
                  current={null}
                  onSuccess={() => window.location.reload()}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Port Name</p>
                  <p className="font-medium">
                    {quote.shipping_details.port_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination Country</p>
                  <p className="font-medium">
                    {quote.shipping_details.destination_country}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipment Terms</p>
                  <p className="font-medium">
                    {quote.shipping_details.shipment_terms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Terms</p>
                  <p className="font-medium">
                    {quote.shipping_details.payment_terms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipment Method</p>
                  <p className="font-medium">
                    {quote.shipping_details.shipment_method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipment Destination</p>
                  <p className="font-medium">
                    {quote.shipping_details.shipment_destination}
                  </p>
                </div>
                {quote.shipping_details.door_address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Door Address</p>
                    <p className="font-medium">
                      {quote.shipping_details.door_address}
                    </p>
                  </div>
                )}
                {quote.shipping_details.shipment_details && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Additional Details</p>
                    <p className="font-medium">
                      {quote.shipping_details.shipment_details}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="supplier"
            className="bg-white border rounded-md p-6 mt-4"
          >
            {quote.supplier ? (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Supplier Information</h3>
                <p>
                  <strong>Name:</strong> {quote.supplier.name}
                </p>
                <p>
                  <strong>Country:</strong> {quote.supplier.country}
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {quote.supplier.verified ? "Yes" : "No"}
                </p>
              </div>
            ) : matchedSuppliers.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Matched Suppliers</h3>
                {matchedSuppliers.map((s: any) => (
                  <div key={s.id} className="border rounded p-4 space-y-1">
                    <p>
                      <strong>Name:</strong> {s.name}
                    </p>
                    <p>
                      <strong>Country:</strong> {s.country}
                    </p>
                    <p>
                      <strong>Categories:</strong>{" "}
                      {s.product_categories.join(", ")}
                    </p>
                    <p>
                      <strong>Verified:</strong> {s.verified ? "Yes" : "No"}
                    </p>

                    <Button
                      variant="default"
                      className="mt-2"
                      onClick={async () => {
                        const confirmed = confirm(
                          `Are you sure you want to book ${s.name} for this quote?`
                        );
                        if (!confirmed) return;

                        const token = localStorage.getItem("accessToken");

                        try {
                          const res = await fetch(
                            `https://web-production-3f682.up.railway.app/quotes/${quote.id}/book-supplier/`,
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `JWT ${token}`,
                              },
                              body: JSON.stringify({ supplier_id: s.id }),
                            }
                          );

                          if (res.ok) {
                            const data = await res.json();
                            alert("Supplier booked successfully!");
                            fetchQuote(); // refresh data
                          } else {
                            const err = await res.text();
                            console.error("Booking failed:", err);
                            alert("Failed to book supplier.");
                          }
                        } catch (err) {
                          console.error("Booking error:", err);
                          alert("Something went wrong while booking.");
                        }
                      }}
                    >
                      Book Supplier
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Supplier details not available yet.
              </p>
            )}
          </TabsContent>

          <TabsContent
            value="messages"
            className="p-4 border rounded-md bg-white"
          >
            <h3 className="text-lg font-semibold mb-4">Messages</h3>
            {!currentUser ? (
              <p>Loading user...</p>
            ) : (
              <>
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">
                    No messages yet.
                  </p>
                ) : (
                  <div className="max-h-[400px] overflow-y-auto space-y-4 mb-4">
                    {messages.map((msg) => {
                      const isMe = msg.sender.id === currentUser.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] p-4 shadow-sm rounded-lg ${
                              isMe
                                ? "bg-black text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg"
                                : "bg-gray-100 text-gray-800 rounded-tr-lg rounded-tl-lg rounded-br-lg"
                            }`}
                          >
                            <div className="text-sm font-medium">
                              {msg.sender.full_name || msg.sender.email}
                            </div>
                            <div className="text-sm mt-1 whitespace-pre-wrap">
                              {msg.content}
                            </div>
                            <div className="text-xs text-right mt-2 opacity-70">
                              {new Date(msg.sent_at).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}

                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end gap-2"
                >
                  <textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-md min-h-[60px]"
                    required
                  />
                  <Button type="submit">
                    <Send className="h-4 w-4 mr-1" /> Send
                  </Button>
                </form>
              </>
            )}
          </TabsContent>

          <TabsContent
            value="timeline"
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mt-4"
          >
            <h3 className="text-lg font-semibold mb-6">Quote Timeline</h3>

            {timelineLoading ? (
              <p>Loading timeline...</p>
            ) : timeline.length === 0 ? (
              <p>No timeline available.</p>
            ) : (
              <div className="space-y-8 relative">
                {timeline.map((event: TimelineEvent, index: number) => (
                  <div key={index} className="flex items-start relative">
                    {index < timeline.length - 1 && (
                      <div className="absolute top-0 left-4 h-full w-px bg-gray-300 z-0"></div>
                    )}
                    <div className="z-10 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mr-4">
                      {event.event.toLowerCase().includes("submit") ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium">{event.event}</p>
                      <Badge className="w-fit mt-1 bg-gray-100 text-gray-800">
                        {event.date}
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
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-md border p-6">
          <h2 className="text-lg font-semibold mb-4">Your Information</h2>
          <p>
            <strong>Name:</strong>
            {currentUser?.first_name || currentUser?.last_name
              ? `${currentUser.first_name || ""} ${
                  currentUser.last_name || ""
                }`.trim()
              : "-"}
          </p>

          <p>
            <strong>Email:</strong> {currentUser?.email || "-"}
          </p>
          <p>
            <strong>Company:</strong> {currentUser?.company || "-"}
          </p>
        </div>

        <div className="bg-white rounded-md border p-6 space-y-3">
          <h2 className="text-lg font-semibold mb-2">Quote Actions</h2>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowUnlockModal(true)}
          >
            <Lock className="h-4 w-4 mr-2" /> Unlock Supplier
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleRequestToSupplier}
          >
            <Package className="h-4 w-4 mr-2" /> Let us match you with a
            supplier
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              router.push(`/dashboard/suppliers?quoteId=${quote.id}`)
            }
          >
            Browse Matched Suppliers
          </Button>

          <Button
            variant="default"
            className="w-full"
            onClick={async () => {
              const confirmed = confirm(
                "Are you sure you want to place this order?"
              );
              if (!confirmed) return;
              if (!quote.response) {
                alert("Cannot place order. Supplier has not responded yet.");
                return;
              }
              const token = localStorage.getItem("accessToken");
              const res = await fetch(
                `https://web-production-3f682.up.railway.app/api/orders/new/`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${token}`,
                  },
                  body: JSON.stringify({ quote: quote.id }),
                }
              );

              if (res.ok) {
                const data = await res.json();
                alert("Order placed!");
                router.push(`/dashboard/orders/${data.id}`); // ✅ correct key
              } else {
                const err = await res.text();
                console.error("Order failed:", err);
                alert("Could not place order.");
              }
            }}
          >
            <Package className="h-4 w-4 mr-2" /> Place Order
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleRequestToSupplier}
          >
            <Package className="h-4 w-4 mr-2" /> Request Samples
          </Button>

          {quote.response && quote.shipping_details && (
            <Button
              variant="default"
              className="w-full"
              onClick={() =>
                router.push(`/dashboard/orders/new?quoteId=${quote.id}`)
              }
            >
              <Package className="h-4 w-4 mr-2" /> Place Order
            </Button>
          )}

          <UpdateShippingModal
            quoteId={quote.id.toString()}
            current={quote.shipping_details}
            onSuccess={() => window.location.reload()}
          />
          <Button variant="outline" className="w-full">
            <Calendar className="h-4 w-4 mr-2" /> Schedule Follow-up
          </Button>
          <Button
            variant="destructive"
            className="w-full px-4 py-2 mt-2 rounded-md border border-red-500 text-red-600 font-medium hover:bg-red-50 transition"
            onClick={async () => {
              const confirmed = confirm(
                "Are you sure you want to delete this quote?"
              );
              if (!confirmed) return;

              const token = localStorage.getItem("accessToken");
              const res = await fetch(
                `https://web-production-3f682.up.railway.app/quotes/delete/${quote.id}/`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `JWT ${token}`,
                  },
                }
              );

              if (res.ok) {
                alert("Quote deleted successfully.");
                router.push("/dashboard/quotes");
              } else {
                alert("Failed to delete quote.");
              }
            }}
          >
            Delete Quote
          </Button>
        </div>

        <UnlockSupplierModal
          open={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          onConfirm={() => setShowUnlockModal(false)} // can do more after success
          quoteId={quote.id.toString()}
        />

        <div className="bg-white rounded-md border p-6">
          <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
          <p className="text-sm text-gray-600 mb-2">
            Need assistance with your quote?
          </p>
          <Button variant="default" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" /> Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
