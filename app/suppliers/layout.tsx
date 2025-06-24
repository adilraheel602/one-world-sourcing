"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SupplierHeader from "@/components/supplier/SupplierHeader";

import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  User,
  Check,
  FileText,
  Package,
  MessageSquare,
  ShoppingCart,
  Users,
  Settings,
  ClipboardList,
  UserCheck,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Mock notifications for supplier dashboard
const mockNotifications = [
  {
    id: "notif-1",
    type: "quote",
    title: "New Quote Request",
    message:
      "A new quote request has been assigned to you for Cotton T-Shirts.",
    time: "10:32 AM",
    read: false,
  },
  {
    id: "notif-2",
    type: "order",
    title: "Order Update",
    message: "Order #12345 status has been updated to 'In Production'.",
    time: "Yesterday",
    read: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "quote":
      return <FileText className="h-5 w-5 text-blue-500" />;
    case "order":
      return <Package className="h-5 w-5 text-green-500" />;
    case "message":
      return <MessageSquare className="h-5 w-5 text-purple-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

interface SupplierLayoutProps {
  children: React.ReactNode;
}

export default function SupplierLayout({ children }: SupplierLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/auth/login";
        return;
      }

      const res = await fetch(
        "https://web-production-3f682.up.railway.app/auth/users/me/",
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 401) {
        localStorage.removeItem("accessToken");
        window.location.href = "/auth/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/auth/login";
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  // Navigation items
  const navigation = [
    {
      name: "Dashboard",
      href: "/suppliers/dashboard",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/suppliers/orders",
      icon: ShoppingCart,
    },
    {
      name: "Quotes",
      href: "/suppliers/quotes",
      icon: ClipboardList,
    },
    {
      name: "Clients",
      href: "/suppliers/clients",
      icon: UserCheck,
    },
    {
      name: "Messages",
      href: "/suppliers/messages",
      icon: Mail,
    },
    {
      name: "Settings",
      href: "/suppliers/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-center border-b border-gray-200">
            <Link href="/">
              <span className="text-2xl font-bold">1WS.</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-6">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:bg-gray-100 group flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors"
            >
              <Package className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex-1 flex items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 w-full"
                  placeholder="Search orders, quotes, clients..."
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-medium">Notifications</h3>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-7 px-2"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </Button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-blue-50" : ""
                          }`}
                        >
                          <div className="flex">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium">
                                  {notification.title}
                                </p>
                                <div className="flex items-center">
                                  <p className="text-xs text-gray-500">
                                    {notification.time}
                                  </p>
                                  {!notification.read && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="ml-1 h-6 w-6 p-0"
                                      onClick={() =>
                                        markAsRead(notification.id)
                                      }
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">
                                {notification.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <SupplierHeader />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
