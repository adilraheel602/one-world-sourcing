"use client";

import { useEffect } from "react";

export default function AdminDashboard() {
  useEffect(() => {
    console.log("Dashboard loaded, token:", localStorage.getItem("adminAccessToken"));
  }, []);

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin</p>
      </div>
      <div>Dashboard content goes here. No redirects should occur.</div>
    </div>
  );
}