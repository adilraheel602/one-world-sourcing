// "use client"

// import { useState } from "react"
// import {
//   Bell,
//   FileText,
//   Package,
//   MessageSquare,
//   Calendar,
//   Check,
//   Filter,
//   Search,
//   Trash2,
//   ArrowDown,
//   ArrowUp,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// // Mock notifications data
// const mockNotifications = [
//   {
//     id: "notif-1",
//     type: "quote",
//     title: "Quote Response Received",
//     message: "Your quote request for Organic Cotton T-Shirts has been updated with new pricing options.",
//     time: "10:32 AM",
//     date: "Today",
//     read: false,
//     link: "/dashboard/quotes/QUO-2023-5678",
//   },
//   {
//     id: "notif-2",
//     type: "message",
//     title: "New Message",
//     message: "Michael Chen from TextilePro Manufacturing sent you a message about your recent inquiry.",
//     time: "Yesterday",
//     date: "Yesterday",
//     read: false,
//     link: "/dashboard/messages",
//   },
//   {
//     id: "notif-3",
//     type: "order",
//     title: "Order Status Update",
//     message: "Your order #ORD-2023-1234 has been shipped. Tracking number: MSK12345678",
//     time: "Apr 15, 2023",
//     date: "Apr 15, 2023",
//     read: true,
//     link: "/dashboard/orders/ORD-2023-1234",
//   },
//   {
//     id: "notif-4",
//     type: "system",
//     title: "Welcome to 1WorldSourcing",
//     message:
//       "Thank you for joining our platform. Get started by exploring our verified suppliers or requesting a quote.",
//     time: "Apr 10, 2023",
//     date: "Apr 10, 2023",
//     read: true,
//     link: "/dashboard",
//   },
//   {
//     id: "notif-5",
//     type: "quote",
//     title: "Quote Approved",
//     message: "Your quote for Recycled Polyester Jackets has been approved. Please proceed with the order.",
//     time: "Apr 8, 2023",
//     date: "Apr 8, 2023",
//     read: true,
//     link: "/dashboard/quotes/QUO-2023-5677",
//   },
//   {
//     id: "notif-6",
//     type: "supplier",
//     title: "New Supplier Match",
//     message: "We've found a new supplier that matches your sourcing criteria: ElectroTech Industries.",
//     time: "Apr 5, 2023",
//     date: "Apr 5, 2023",
//     read: true,
//     link: "/dashboard/suppliers/SUP-002",
//   },
//   {
//     id: "notif-7",
//     type: "message",
//     title: "Message from Support",
//     message: "Our support team has responded to your inquiry about shipping options.",
//     time: "Apr 3, 2023",
//     date: "Apr 3, 2023",
//     read: true,
//     link: "/dashboard/messages",
//   },
//   {
//     id: "notif-8",
//     type: "system",
//     title: "Account Verification Complete",
//     message: "Your account has been fully verified. You now have access to all platform features.",
//     time: "Apr 1, 2023",
//     date: "Apr 1, 2023",
//     read: true,
//     link: "/dashboard/settings",
//   },
//   {
//     id: "notif-9",
//     type: "order",
//     title: "Order Confirmation",
//     message: "Your order #ORD-2023-1233 for Denim Jeans has been confirmed and is now being processed.",
//     time: "Mar 28, 2023",
//     date: "Mar 28, 2023",
//     read: true,
//     link: "/dashboard/orders/ORD-2023-1233",
//   },
//   {
//     id: "notif-10",
//     type: "quote",
//     title: "Quote Request Received",
//     message: "We've received your quote request for Bamboo Socks. Our team is working on it.",
//     time: "Mar 25, 2023",
//     date: "Mar 25, 2023",
//     read: true,
//     link: "/dashboard/quotes/QUO-2023-5676",
//   },
// ]

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState(mockNotifications)
//   const [filter, setFilter] = useState("all")
//   const [searchTerm, setSearchTerm] = useState("")
//   const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

//   const markAsRead = (id: string) => {
//     setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
//   }

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
//   }

//   const deleteNotification = (id: string) => {
//     setNotifications((prev) => prev.filter((notif) => notif.id !== id))
//   }

//   const clearAllNotifications = () => {
//     setNotifications([])
//   }

//   const toggleSortDirection = () => {
//     setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"))
//   }

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case "quote":
//         return <FileText className="h-5 w-5 text-blue-500" />
//       case "order":
//         return <Package className="h-5 w-5 text-green-500" />
//       case "message":
//         return <MessageSquare className="h-5 w-5 text-purple-500" />
//       case "supplier":
//         return <Package className="h-5 w-5 text-orange-500" />
//       case "system":
//         return <Bell className="h-5 w-5 text-gray-500" />
//       default:
//         return <Calendar className="h-5 w-5 text-gray-500" />
//     }
//   }

//   // Filter and sort notifications
//   const filteredNotifications = notifications
//     .filter((notif) => {
//       // Apply type filter
//       if (filter !== "all" && notif.type !== filter) return false

//       // Apply search filter
//       if (
//         searchTerm &&
//         !notif.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !notif.message.toLowerCase().includes(searchTerm.toLowerCase())
//       ) {
//         return false
//       }

//       return true
//     })
//     .sort((a, b) => {
//       // Convert dates to timestamps for comparison
//       const dateA = new Date(
//         a.date === "Today" ? new Date() : a.date === "Yesterday" ? new Date(Date.now() - 86400000) : a.date,
//       ).getTime()
//       const dateB = new Date(
//         b.date === "Today" ? new Date() : b.date === "Yesterday" ? new Date(Date.now() - 86400000) : b.date,
//       ).getTime()

//       return sortDirection === "desc" ? dateB - dateA : dateA - dateB
//     })

//   const unreadCount = notifications.filter((notif) => !notif.read).length

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Notifications</h1>
//           <p className="text-gray-500 mt-1">View and manage your notifications</p>
//         </div>
//         <div className="flex items-center space-x-2">
//           {unreadCount > 0 && (
//             <Button variant="outline" onClick={markAllAsRead}>
//               <Check className="h-4 w-4 mr-2" />
//               Mark All as Read
//             </Button>
//           )}
//           <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={clearAllNotifications}>
//             <Trash2 className="h-4 w-4 mr-2" />
//             Clear All
//           </Button>
//         </div>
//       </div>

//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="relative flex-grow">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             className="pl-10 pr-4 py-2 rounded-md border border-gray-300 w-full"
//             placeholder="Search notifications..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="flex items-center" onClick={toggleSortDirection}>
//             {sortDirection === "desc" ? <ArrowDown className="h-4 w-4 mr-2" /> : <ArrowUp className="h-4 w-4 mr-2" />}
//             {sortDirection === "desc" ? "Newest First" : "Oldest First"}
//           </Button>
//           <Button variant="outline" className="flex items-center">
//             <Filter className="h-4 w-4 mr-2" />
//             Filter
//           </Button>
//         </div>
//       </div>

//       <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
//         <TabsList className="grid w-full grid-cols-6">
//           <TabsTrigger value="all">
//             All
//             <Badge className="ml-2 bg-gray-100 text-gray-800">{notifications.length}</Badge>
//           </TabsTrigger>
//           <TabsTrigger value="quote">
//             Quotes
//             <Badge className="ml-2 bg-blue-100 text-blue-800">
//               {notifications.filter((n) => n.type === "quote").length}
//             </Badge>
//           </TabsTrigger>
//           <TabsTrigger value="order">
//             Orders
//             <Badge className="ml-2 bg-green-100 text-green-800">
//               {notifications.filter((n) => n.type === "order").length}
//             </Badge>
//           </TabsTrigger>
//           <TabsTrigger value="message">
//             Messages
//             <Badge className="ml-2 bg-purple-100 text-purple-800">
//               {notifications.filter((n) => n.type === "message").length}
//             </Badge>
//           </TabsTrigger>
//           <TabsTrigger value="supplier">
//             Suppliers
//             <Badge className="ml-2 bg-orange-100 text-orange-800">
//               {notifications.filter((n) => n.type === "supplier").length}
//             </Badge>
//           </TabsTrigger>
//           <TabsTrigger value="system">
//             System
//             <Badge className="ml-2 bg-gray-100 text-gray-800">
//               {notifications.filter((n) => n.type === "system").length}
//             </Badge>
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value={filter} className="mt-6">
//           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
//             {filteredNotifications.length === 0 ? (
//               <div className="p-8 text-center">
//                 <Bell className="h-12 w-12 mx-auto text-gray-300 mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
//                 <p className="text-gray-500">
//                   {searchTerm
//                     ? "No notifications match your search criteria."
//                     : "You don't have any notifications yet."}
//                 </p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-200">
//                 {filteredNotifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
//                   >
//                     <div className="flex">
//                       <div className="flex-shrink-0 mr-4 mt-1">{getNotificationIcon(notification.type)}</div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between mb-1">
//                           <div>
//                             <p className="font-medium">{notification.title}</p>
//                             <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
//                           </div>
//                           <div className="flex flex-col items-end ml-4">
//                             <p className="text-xs text-gray-500 whitespace-nowrap">
//                               {notification.date} • {notification.time}
//                             </p>
//                             <div className="flex mt-2">
//                               {!notification.read && (
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="h-8 w-8 p-0 text-blue-600"
//                                   onClick={() => markAsRead(notification.id)}
//                                   title="Mark as read"
//                                 >
//                                   <Check className="h-4 w-4" />
//                                 </Button>
//                               )}
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-8 w-8 p-0 text-red-500"
//                                 onClick={() => deleteNotification(notification.id)}
//                                 title="Delete notification"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="mt-2">
//                           <a
//                             href={notification.link}
//                             className="text-sm text-blue-600 hover:underline"
//                             onClick={() => markAsRead(notification.id)}
//                           >
//                             View Details
//                           </a>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }


"use client";

import { useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  link: string;
};

const getAccessToken = () => localStorage.getItem("accessToken");

export default function NotificationFetcher() {
  const [notifications, setNotifications] = useState<Notification[] | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = getAccessToken();
      try {
        const res = await fetch("http://localhost:8000/notifications/my/", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    const token = getAccessToken();
    await fetch("http://localhost:8000/notifications/mark-read/", {
      method: "POST",
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? []);
  };

  if (notifications === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* render notifications here */}
      <button onClick={markAllAsRead}>Mark all as read</button>
    </div>
  );
}
