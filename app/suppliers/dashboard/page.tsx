"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  UserPlus,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  TrendingUp,
} from "lucide-react";

export default function SupplierDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUserAndRegistration();
  }, []);

  const handleUpgradePlan = async (plan: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const res = await fetch(
        "https://web-production-3f682.up.railway.app/api/suppliers/checkout/",
        {
          method: "POST",
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }), // bronze, silver, gold, platinum
        }
      );

      const data = await res.json();
      if (res.ok && data.checkout_url) {
        window.location.href = data.checkout_url; // redirect to Stripe
      } else {
        alert(data.error || "Upgrade failed");
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("An error occurred while upgrading.");
    }
  };

  const checkUserAndRegistration = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        window.location.href = "/suppliers/login";
        return;
      }

      // Get user info
      const userRes = await fetch(
        "https://web-production-3f682.up.railway.app/auth/users/me/",
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (userRes.status === 401) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/suppliers/login";
        return;
      }

      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData);
      }

      // Check if supplier is registered
      const supplierRes = await fetch(
        "https://web-production-3f682.up.railway.app/api/suppliers/profile/",
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (supplierRes.ok) {
        setIsRegistered(true);
      } else if (supplierRes.status === 404) {
        setIsRegistered(false);
      }
      if (supplierRes.ok) {
        const supplierData = await supplierRes.json();
        setSupplier(supplierData);
        setIsRegistered(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Show registration prompt if not registered
  if (!isRegistered) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Supplier Registration
          </h1>

          <p className="text-xl text-gray-600 mb-8">
            Welcome {user?.email}! To start receiving quote requests, please
            complete your supplier profile.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg border p-6">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Receive Quotes</h3>
              <p className="text-gray-600 text-sm">
                Get connected with buyers worldwide
              </p>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Global Reach</h3>
              <p className="text-gray-600 text-sm">
                Access international markets
              </p>
            </div>
            <div className="bg-white rounded-lg border p-6">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Grow Business</h3>
              <p className="text-gray-600 text-sm">Expand your customer base</p>
            </div>
          </div>

          <Link href="/suppliers/register">
            <Button
              size="lg"
              className="bg-black text-white hover:bg-black/90 px-8 py-4"
            >
              Complete Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          <p className="text-sm text-gray-500 mt-4">
            Takes 10-15 minutes to complete
          </p>
        </div>
      </div>
    );
  }

  // Show normal dashboard if registered
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Supplier Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {supplier?.name || "No company"}
        </p>
      </div>

      {/* Your existing dashboard content here */}
      <div className="bg-white rounded-lg border p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Registration Complete!
        </h2>
        <p className="text-gray-600">
          Your supplier profile is active and you can now receive quote
          requests.
        </p>
      </div>
      {isRegistered && supplier && (
        <div className="mt-6 bg-white border p-6 rounded-lg text-sm text-gray-700 text-left">
          <h3 className="text-lg font-semibold mb-2">Membership Details</h3>
          <p className="mb-1">
            <strong>Current Plan:</strong>{" "}
            <span className="capitalize">{supplier.package_plan}</span>
          </p>
          <p className="mb-4">
            <strong>Supplier Tier:</strong>{" "}
            <span className="capitalize">
              {supplier.tier_level.replace("_", " ")}
            </span>
          </p>

          <div className="flex flex-wrap gap-3">
            {["silver", "gold", "platinum"].map((plan) =>
              plan !== supplier.package_plan ? (
                <button
                  key={plan}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  onClick={() => handleUpgradePlan(plan)}
                >
                  Upgrade to {plan.charAt(0).toUpperCase() + plan.slice(1)}
                </button>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
