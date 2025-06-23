"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("prode@gmail.com");
  const [password, setPassword] = useState("prode");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");
    console.log("Attempting admin login with:", { email, password });

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/admin-login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      console.log("Admin login response status:", res.status);
      const data = await res.json();
      console.log("Admin login response data:", data);

      // Force redirect regardless of response (temporary)
      localStorage.setItem("adminAccessToken", "temp-token");
      router.push("/admin-panel/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
        </div>
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-center space-x-2">
            <svg
              className="h-4 w-4 text-red-500 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={error ? "border-red-500" : ""}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={error ? "border-red-500" : ""}
            />
          </div>
          <Button
            type="button"
            className="w-full rounded-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}