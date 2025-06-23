"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Star,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupplierDetail } from "./useSupplierDetail";

export default function SupplierDetailPage() {
  const router = useRouter();
  const [newMessage, setNewMessage] = useState("");
  // Get params directly from useParams(), which returns { id: string }
  const params = useParams();
  const id = params.id as string; // Directly access id from params
  const { supplier, loading } = useSupplierDetail(id);

  if (loading || !supplier) {
    return (
      <div className="text-center py-20 text-gray-500 text-sm">
        Loading supplier details...
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const handleRequestQuote = () => {
    router.push(`/dashboard/quotes/new?supplier=${supplier.id}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Supplier Profile</h1>
            <p className="text-gray-500">
              SUP-{String(supplier.id).padStart(3, "0")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Profile
          </Button>
          <Button onClick={handleRequestQuote}>Request Quote</Button>
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left 2/3 Content */}
        <div className="col-span-3 lg:col-span-2 space-y-6">
          {/* Supplier Overview Card */}
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center">
              <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                <Image
                  src={supplier.logo || "/placeholder.svg"}
                  alt={supplier.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center">
                  <h2 className="text-xl font-bold">{supplier.name}</h2>
                  {supplier.verified && (
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center mt-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  {supplier.rating?.toFixed(1) || "—"}
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                  {supplier.location}
                </div>
              </div>
            </div>
            <div className="p-6">
              {supplier.description || "No company description provided."}{supplier.description || "No company description provided."}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="text-xs">Established</p>
                  <p className="font-medium">{supplier.established_year}</p>
                </div>
                <div>
                  <p className="text-xs">Employees</p>
                  <p className="font-medium">{supplier.employees || "—"}</p>
                </div>
                <div>
                  <p className="text-xs">Min Order Value</p>
                  <p className="font-medium">{supplier.min_order_value || "—"}</p>
                </div>
                <div>
                  <p className="text-xs">Capacity</p>
                  <p className="font-medium">{supplier.production_capacity || "—"}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-1">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.certifications?.map((cert: any) => (
                    <Badge
                      key={cert.id}
                      className="bg-blue-100 text-blue-800 text-xs"
                    >
                      {cert.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="capabilities">Certifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Products */}
            <TabsContent value="products" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {supplier.products?.map((product: any) => (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Certifications */}
            <TabsContent value="capabilities" className="mt-4 space-y-2">
              {supplier.certifications?.map((cert: any) => (
                <div key={cert.id} className="border rounded px-4 py-2 text-sm">
                  <p className="font-medium">{cert.name}</p>
                  <p className="text-gray-500">
                    {cert.issue_date} — {cert.expiry_date || "No expiry"}
                  </p>
                </div>
              ))}
            </TabsContent>
            {/* Reviews */}
            <TabsContent
              value="reviews"
              className="mt-4 bg-white rounded-lg border shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Customer Reviews</h3>
                {supplier.reviews?.length > 0 && (
                  <div className="flex items-center text-sm">
                    <div className="flex text-yellow-500 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(supplier.average_rating || 0)
                              ? "fill-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{supplier.average_rating}</span>
                    <span className="ml-1 text-gray-500">
                      ({supplier.reviews.length} review
                      {supplier.reviews.length > 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>

              {supplier.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {supplier.reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-medium">{review.user_name}</p>
                          <p className="text-sm text-gray-500">
                            {review.user_company}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No reviews available.
                </p>
              )}
            </TabsContent>

            {/* Contact Info */}
            <TabsContent value="contact" className="mt-4 text-sm space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                <a
                  href={`mailto:${supplier.contact?.email}`}
                  className="hover:underline"
                >
                  {supplier.contact?.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                <a
                  href={`tel:${supplier.contact?.phone}`}
                  className="hover:underline"
                >
                  {supplier.contact?.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                <a
                  href={`https://${supplier.contact?.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  {supplier.contact?.website}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <p>{supplier.contact?.address}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar with 3 cards */}
        <div className="col-span-3 lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <a
                  href={`mailto:${supplier.contact?.email}`}
                  className="hover:underline"
                >
                  {supplier.contact?.email}
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <a
                  href={`tel:${supplier.contact?.phone}`}
                  className="hover:underline"
                >
                  {supplier.contact?.phone}
                </a>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-gray-400 mr-3" />
                <a
                  href={`https://${supplier.contact?.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  {supplier.contact?.website}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <div className="flex">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <p>{supplier.contact?.address}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button
              className="w-full"
              onClick={() => router.push("/dashboard/messages")}
              >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Supplier
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full" onClick={handleRequestQuote}>
                <FileText className="h-4 w-4 mr-2" />
                Request Quote
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
              <Button variant="outline" className="w-full">
                <Truck className="h-4 w-4 mr-2" />
                Request Samples
              </Button>
            </div>
          </div>

          {/* Send Message */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Send Message</h2>
            <form onSubmit={handleSendMessage}>
              <Textarea
                placeholder="Type your message here..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="min-h-[120px] mb-4"
              />
              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
