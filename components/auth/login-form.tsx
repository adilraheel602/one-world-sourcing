"use client";

import type React from "react";
import { getGoogleAuthURL } from "@/lib/google";
import LoadingLink from "@/components/LoadingLink";
import Cookies from "js-cookie";

// Extend the Window interface to include the 'google' property
declare global {
  interface Window {
    google?: any;
  }
}

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import google from "@/public/google-icon.png"; // Adjust the path as necessary
import { useEffect } from "react";
import { useRef } from "react";

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const promptShownRef = useRef(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleResponse = async (response: any) => {
    if (!response || !response.credential) {
      console.warn("❌ Invalid Google response. Skipping login.");
      return;
    }
    setIsGoogleLoading(true);

    try {
      const res = await fetch(
        "https://web-production-3f682.up.railway.app/auth/google/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: response.credential }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("accessToken", data.access);
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);

        // Check user role
        const userRes = await fetch(
          "https://web-production-3f682.up.railway.app/auth/users/me/",
          {
            headers: { Authorization: `JWT ${data.access}` },
          }
        );
        const userData = await userRes.json();

        if (userData.is_admin) {
          router.push("/admin-panel/dashboard");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login error");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://web-production-3f682.up.railway.app/auth/jwt/login-with-cookie/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("accessToken", data.access);
        if (data.refresh) localStorage.setItem("refreshToken", data.refresh);

        const userRes = await fetch(
          "https://web-production-3f682.up.railway.app/auth/users/me/",
          {
            headers: { Authorization: `JWT ${data.access}` },
          }
        );
        const userData = await userRes.json();

        if (userData.is_admin) {
          localStorage.setItem("adminAccessToken", data.access);
          localStorage.setItem("adminRefreshToken", data.refresh);
          router.push("/admin-panel/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.google &&
      !promptShownRef.current
    ) {
      window.google.accounts.id.initialize({
        client_id:
          "930022934278-edbssqh41gribq8thpuk3ohh24gphs5q.apps.googleusercontent.com", // ✅ REPLACE with your actual client ID
        callback: handleGoogleResponse,
        ux_mode: "popup",
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-btn"),
        {
          theme: "outline",
          size: "large",
          type: "standard",
          width: 300,
        }
      );

      window.google.accounts.id.prompt((notification: any) => {
        console.log("One Tap result:", notification);
      });

      promptShownRef.current = true;
    }
  }, []);

  if (isGoogleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent" />
        <span className="ml-4 text-lg font-medium text-gray-700">
          Signing you in...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
            value={formData.email}
            onChange={handleChange}
            className={error && error.includes("email") ? "border-red-500" : ""}
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-gray-600 hover:text-black"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              className={
                error && error.includes("password") ? "border-red-500" : ""
              }
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full rounded-full bg-black text-white hover:bg-black/90 disabled:opacity-50"
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
      </form>

      <div
        className="mt-6 flex place-items-center justify-center w-full"
        id="google-signin-btn"
      ></div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-600 text-center mt-6">
          Don't have an account?{" "}
          <LoadingLink href="/auth/signup">
            <span className="text-blue-600 hover:underline">Sign up</span>
          </LoadingLink>
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Having trouble? Contact support at{" "}
          <a
            href="mailto:support@1worldsourcing.com"
            className="text-blue-600 hover:underline"
          >
            support@1worldsourcing.com
          </a>
        </p>
      </div>
    </div>
  );
}
