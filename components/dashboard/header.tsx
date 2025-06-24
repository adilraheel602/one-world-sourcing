"use client";

import { useState, useRef, useEffect } from "react";
import { refreshAccessToken } from "@/lib/auth";
import Image from "next/image";

type DashboardHeaderProps = {
  isAdmin?: boolean;
};

import {
  Bell,
  Search,
  User,
  Check,
  Calendar,
  FileText,
  Package,
  MessageSquare,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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

// Mock notifications data
const mockNotifications = [
  {
    id: "notif-1",
    type: "quote",
    title: "Quote Response Received",
    message:
      "Your quote request for Organic Cotton T-Shirts has been updated with new pricing options.",
    time: "10:32 AM",
    date: "Today",
    read: false,
    link: "/dashboard/quotes/QUO-2023-5678",
  },
  // ... other notifications
];
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  "https://web-production-3f682.up.railway.app";

const getAccessToken = () => localStorage.getItem("accessToken");

export function DashboardHeader({ isAdmin }: DashboardHeaderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((notif) => !notif.read).length;
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // ✅ FIXED: Added proper typing
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [user, setUser] = useState<{
    first_name: string;
    last_name: string;
    company: string;
    profile_image: string | null;
  } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(
      isAdmin ? "adminAccessToken" : "accessToken"
    );
    if (!token) {
      router.push(isAdmin ? "/admin-panel/login" : "/auth/login");
      return;
    }

    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleProfileUpdate = () => fetchUser();
    window.addEventListener("userProfileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("userProfileUpdated", handleProfileUpdate);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = getAccessToken();
      if (!token) {
        console.warn("⚠️ No token found. Cannot fetch notifications.");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/notifications/my/`,
          {
            headers: {
              Authorization: `JWT ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          const text = await res.text(); // For debugging 403/500 or HTML errors
          console.error("❌ Notification API Error:", res.status, text);
          return;
        }

        // Try parsing JSON only if response is OK
        const json = await res.json();

        // 🔄 If using DRF Pagination: `results` field, otherwise fallback to raw array
        const notifications = Array.isArray(json?.results)
          ? json.results
          : json;

        console.log("📦 Fetched Notifications:", notifications);
        setNotifications(notifications); // 👈 Replace with your own useState setter
      } catch (err) {
        console.error("❌ Failed to fetch notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  // In DashboardHeader, update fetchUser to use the correct API endpoint
  // frontend/components/dashboard/header.tsx
  // frontend/components/dashboard/header.tsx
  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      let token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      let res = await fetch(`${API_BASE}/profile/`, {
        // Changed from /auth/users/me/ to /profile/
        headers: {
          Authorization: `JWT ${token}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Fetched user data in header:", data); // Debug the response
        setUser({
          first_name: data.first_name,
          last_name: data.last_name,
          company: data.company,
          profile_image: data.profile_image || null,
        });
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("User fetch failed:", res.status, errorData);
        setError(`Failed to load user data: ${res.status}`);
      }
    } catch (err) {
      console.error("User fetch error:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  }; // Rest of your component stays the same...
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = async () => {
    const token = getAccessToken();
    await fetch(
      "https://web-production-3f682.up.railway.app/notifications/mark-read/",
      {
        method: "POST",
        headers: {
          Authorization: `JWT ${token}`,
        },
      }
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Remove this duplicate block, as the logic is already handled above in markAllAsRead.

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "quote":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "order":
        return <Package className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-purple-500" />;
      case "system":
        return <Bell className="h-5 w-5 text-gray-500" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-red-600">Error: {error}</div>
          <Button onClick={fetchUser} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex-1 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 w-full"
              placeholder="Search orders, quotes, suppliers..."
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-black text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
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
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
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
                            <div className="flex-1 min-w-0">
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
                              <p className="text-sm text-gray-600 mb-1">
                                {notification.message}
                              </p>
                              <a
                                href={notification.link}
                                className="text-xs text-blue-600 hover:underline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                View Details
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <a
                    href="/dashboard/notifications"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View All Notifications
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <a href="/dashboard/settings" className="block">
              {user?.profile_image ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                  <Image
                    src={user?.profile_image || "/placeholder.svg"}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </a>
            <div className="hidden md:block">
              <p className="text-sm font-medium">
                {loading
                  ? "Loading..."
                  : user
                  ? `${user.first_name} ${user.last_name}`
                  : "User"}
              </p>
              <p className="text-xs text-gray-500">
                {user ? user.company || "No company" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
