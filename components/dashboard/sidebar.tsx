"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";

type SidebarProps = {
  isAdmin?: boolean;
};


import { useRouter } from "next/navigation";

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar({ isAdmin }: SidebarProps) {

  const pathname = usePathname();

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/auth/login"); // Redirect to login
  };

  const links: SidebarLink[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      href: "/dashboard/quotes",
      label: "Quotes",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/dashboard/suppliers",
      label: "Suppliers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/dashboard/messages",
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">1WS.</span>
        </Link>
      </div>

      <div className="px-3 py-2">
        <div className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {link.icon}
              <span className="ml-3">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="px-3 py-2 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    </div>
  );
}
