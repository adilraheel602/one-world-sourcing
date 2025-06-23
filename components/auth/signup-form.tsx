"use client";

import type React from "react";
import { getGoogleAuthURL } from "@/lib/google";
import { useRef } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import google from "@/public/google-icon.png"; // Adjust the path as necessary

interface SignupFormProps {
  quoteData?: any; // Optional prop to pass quote data
}

declare global {
  interface Window {
    google?: any;
  }
}

export function SignupForm({ quoteData }: SignupFormProps) {
  const gsiSignupInit = useRef(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);


  // Extract email and temp_quote_id from query parameters or quoteData
  const [email, setEmail] = useState(quoteData?.email || "");
  const [tempQuoteId, setTempQuoteId] = useState("");

  useEffect(() => {
  const cancelPendingPrompt = () => {
    try {
      window.google?.accounts?.id?.cancel();
    } catch (err) {
      console.warn("GSI cancel failed:", err);
    }
  };

  if (
    typeof window !== "undefined" &&
    window.google &&
    !gsiSignupInit.current
  ) {
    gsiSignupInit.current = true;

    cancelPendingPrompt(); // ✅ force-cancel any pending prompt

    window.google.accounts.id.initialize({
  client_id: "930022934278-edbssqh41gribq8thpuk3ohh24gphs5q.apps.googleusercontent.com",
  callback: handleGoogleSignup,
  ux_mode: "popup",
  auto_select: false,
  cancel_on_tap_outside: true,
  // This line is critical to disable FedCM behavior:
  context: "signup", // <-- use context signup
});


    window.google.accounts.id.renderButton(
      document.getElementById("google-signup-btn"),
      {
        theme: "outline",
        size: "large",
        type: "standard",
        width: 300,
      }
    );
  }

  return () => {
    cancelPendingPrompt(); // ✅ again on unmount
  };
}, []);


  const handleGoogleSignup = async (response: any) => {
    if (!response?.credential) {
      console.warn("❌ Invalid Google signup credential.");
      return;
    }
    setIsGoogleLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/google/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        router.push("/dashboard");
      } else {
        console.error("Google signup failed:", data);
        alert(data?.error || "Google signup failed. Try again.");
      }
    } catch (err) {
      console.error("Google signup error:", err);
      alert("Something went wrong during Google signup.");
    }finally {
    setIsGoogleLoading(false); // Optional fallback
  }
  };

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tempQuoteIdParam = searchParams.get("temp_quote_id");
    console.log("Query Parameters:", { emailParam, tempQuoteIdParam }); // Debug log
    if (emailParam) setEmail(decodeURIComponent(emailParam));
    if (tempQuoteIdParam) setTempQuoteId(tempQuoteIdParam);
  }, [searchParams, quoteData]);

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return cookieValue ? decodeURIComponent(cookieValue.split("=")[1]) : null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!password) {
      setError("Password is required.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Submitting signup with:", { email, password });

      const res = await fetch("http://localhost:8000/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          username: email.split("@")[0] || email, // Ensure username is unique
          password,
          re_password: password, // Add this if DJOSER requires password retype
          first_name: quoteData?.name.split(" ")[0] || "",
          last_name: quoteData?.name.split(" ").slice(1).join(" ") || "",
          company: quoteData?.company || "",
        }),
        credentials: "include",
      });

      if (!res.ok) {
        let errorData: any;
        try {
          errorData = await res.json();
        } catch (e) {
          const fallback = await res.text();
          errorData = { detail: fallback };
        }

        console.error("Signup error response:", errorData);

        const firstError =
          errorData.email?.[0] ||
          errorData.password?.[0] ||
          errorData.username?.[0] ||
          errorData.detail ||
          "Signup failed. Please try again.";

        throw new Error(firstError);
      }

      console.log("Signup successful, proceeding to login...");

      const loginRes = await fetch("http://localhost:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        console.error("Login error response:", loginData);
        throw new Error(loginData.detail || "Login failed after signup");
      }

      console.log("Login successful, token:", loginData.access);
      localStorage.setItem("accessToken", loginData.access);
      localStorage.setItem("refreshToken", loginData.refresh);

      if (tempQuoteId) {
        console.log("Finalizing quote with temp_quote_id:", tempQuoteId);
        const finalizeResponse = await fetch(
          "http://localhost:8000/quote/finalize/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `JWT ${loginData.access}`,
            },
            credentials: "include",
            body: JSON.stringify({ temp_quote_id: tempQuoteId }),
          }
        );

        if (!finalizeResponse.ok) {
          const errorData = await finalizeResponse.json();
          console.error("Finalize quote error response:", errorData);
          throw new Error(errorData.error || "Failed to finalize quote");
        }
        console.log("Quote finalized successfully");
      } else {
        console.warn("No temp_quote_id provided, skipping quote finalization");
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message)
          : "Something went wrong. Please try again."
      );
    }

    setIsLoading(false);
  };
  if (isGoogleLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent" />
      <span className="ml-4 text-lg font-medium text-gray-700">Creating your account...</span>
    </div>
  );
}


  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Create Your Account</h1>
        <p className="text-gray-600 mt-2">
          {quoteData
            ? "Complete your account setup to track your quote"
            : "Sign up to access our sourcing platform"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full rounded-full bg-black text-white hover:bg-black/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium hover:text-black">
            Sign in
          </Link>
        </p>
      </div>
      <div
        className="mt-6 flex place-items-center justify-center w-full"
        id="google-signup-btn"
      />
    </div>
  );
}
