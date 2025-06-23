"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Package,
  Truck,
  Ship,
  Plane,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  RefreshCw,
  Download,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for shipment tracking
const getTrackingData = (id: string) => {
  return {
    id: id,
    order_id: `ORD-2023-${id.split("-")[1]}`,
    tracking_number: `MSK${Math.floor(10000000 + Math.random() * 90000000)}`,
    carrier: "Maersk Line",
    carrier_logo: "/placeholder.svg?height=40&width=40&text=ML",
    estimated_delivery: "Jun 15, 2023",
    origin: "Shanghai, China",
    destination: "Los Angeles, CA, USA",
    current_location: "Pacific Ocean",
    status: "in_transit", // in_transit, delivered, delayed, exception
    shipment_method: "sea", // sea, air, express
    last_updated: "May 10, 2023 • 14:32 GMT",
    progress_percentage: 65,
    events: [
      {
        date: "Apr 12, 2023",
        time: "09:15",
        location: "Shanghai, China",
        description: "Order confirmed",
        status: "completed",
      },
      {
        date: "Apr 15, 2023",
        time: "11:00",
        location: "Shanghai, China",
        description: "Production started",
        status: "completed",
      },
      {
        date: "May 1, 2023",
        time: "14:30",
        location: "Shanghai, China",
        description: "Production completed",
        status: "completed",
      },
      {
        date: "May 3, 2023",
        time: "08:45",
        location: "Shanghai, China",
        description: "Shipment picked up",
        status: "completed",
      },
      {
        date: "May 5, 2023",
        time: "16:20",
        location: "Shanghai Port, China",
        description: "Departed from origin port",
        status: "completed",
      },
      {
        date: "May 10, 2023",
        time: "14:32",
        location: "Pacific Ocean",
        description: "In transit to destination",
        status: "current",
      },
      {
        date: "May 30, 2023",
        time: "08:00",
        location: "Los Angeles Port, CA, USA",
        description: "Arrival at destination port",
        status: "upcoming",
      },
      {
        date: "Jun 5, 2023",
        time: "10:15",
        location: "Los Angeles, CA, USA",
        description: "Customs clearance",
        status: "upcoming",
      },
      {
        date: "Jun 10, 2023",
        time: "09:30",
        location: "Los Angeles, CA, USA",
        description: "Out for delivery",
        status: "upcoming",
      },
      {
        date: "Jun 15, 2023",
        time: "14:00",
        location: "Los Angeles, CA, USA",
        description: "Delivered",
        status: "upcoming",
      },
    ],
    documents: [
      { id: 1, name: "Bill of Lading.pdf", size: "1.2 MB", date: "May 5, 2023" },
      { id: 2, name: "Commercial Invoice.pdf", size: "0.8 MB", date: "May 5, 2023" },
      { id: 3, name: "Packing List.pdf", size: "0.5 MB", date: "May 5, 2023" },
    ],
  }
}

export default function ShipmentTrackingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tracking, setTracking] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setTracking(getTrackingData(params.id))
  }, [params.id])

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate API call to refresh tracking data
    setTimeout(() => {
      setIsRefreshing(false)
      // In a real app, you would fetch updated data
      setTracking(getTrackingData(params.id))
    }, 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "delayed":
        return "bg-yellow-100 text-yellow-800"
      case "exception":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_transit":
        return "In Transit"
      case "delivered":
        return "Delivered"
      case "delayed":
        return "Delayed"
      case "exception":
        return "Exception"
      default:
        return "Unknown"
    }
  }

  const getShipmentIcon = (method: string) => {
    switch (method) {
      case "sea":
        return <Ship className="h-5 w-5" />
      case "air":
        return <Plane className="h-5 w-5" />
      case "express":
        return <Truck className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getEventStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "current":
        return <Circle className="h-5 w-5 text-blue-500 fill-blue-500" />
      case "upcoming":
        return <Circle className="h-5 w-5 text-gray-300" />
      case "delayed":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "exception":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Circle className="h-5 w-5 text-gray-300" />
    }
  }

  if (!tracking) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading tracking information...</h2>
          <p className="text-gray-500">Please wait while we fetch the latest tracking data.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Shipment Tracking</h1>
            <p className="text-gray-500">Order #{tracking.order_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-3 lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-lg overflow-hidden mr-4">
                    <Image
                      src={tracking.carrier_logo || "/placeholder.svg"}
                      alt={tracking.carrier}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{tracking.carrier}</h2>
                    <p className="text-sm text-gray-500">Tracking #{tracking.tracking_number}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(tracking.status)}>
                  {getShipmentIcon(tracking.shipment_method)}
                  <span className="ml-1">{getStatusText(tracking.status)}</span>
                </Badge>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <div className="text-sm text-gray-500">Shipment Progress</div>
                  <div className="text-sm font-medium">{tracking.progress_percentage}%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${tracking.progress_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Origin</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="font-medium">{tracking.origin}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="font-medium">{tracking.destination}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Current Location</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="font-medium">{tracking.current_location}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="font-medium">{tracking.estimated_delivery}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Clock className="h-4 w-4 mr-2" />
                <span>Last updated: {tracking.last_updated}</span>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                <div className="space-y-6">
                  {tracking.events.map((event: any, index: number) => (
                    <div key={index} className="flex">
                      <div className="mr-4 relative">
                        <div className="w-6 h-6 flex items-center justify-center">
                          {getEventStatusIcon(event.status)}
                        </div>
                        {index < tracking.events.length - 1 && (
                          <div
                            className={`absolute top-6 bottom-0 left-1/2 w-0.5 -ml-px h-full ${
                              event.status === "completed" || event.status === "current" ? "bg-blue-200" : "bg-gray-200"
                            }`}
                          ></div>
                        )}
                      </div>
                      <div className="pb-6">
                        <div className="flex items-center">
                          <p className="font-medium">{event.description}</p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{event.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{event.time}</span>
                          <span className="mx-2">•</span>
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3 lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Shipment Details</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Tracking Number</p>
                  <p className="font-medium">{tracking.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Carrier</p>
                  <p className="font-medium">{tracking.carrier}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Shipment Method</p>
                  <div className="flex items-center">
                    {getShipmentIcon(tracking.shipment_method)}
                    <span className="ml-2 capitalize">{tracking.shipment_method}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{tracking.order_id}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <Truck className="h-4 w-4 mr-2" />
                  View on Carrier Website
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Shipping Documents</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {tracking.documents.map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center mr-3">
                        <span className="text-xs font-medium uppercase">PDF</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          {doc.size} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Need Help?</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Having issues with your shipment or need more information? Our support team is here to help.
              </p>
              <Button className="w-full">Contact Support</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
