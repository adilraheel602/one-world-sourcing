"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [checking, setChecking] = useState(true); // Avoid flicker

  useEffect(() => {
    const token = localStorage.getItem("adminAccessToken");
    if (!token) {
      router.replace("/admin-panel/login");
    } else {
      setIsAuth(true);
    }
    setChecking(false);
  }, []);

  if (checking) return null; // Prevent flickering during check

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isAdmin />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader isAdmin />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
