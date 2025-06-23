"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/suppliers/dashboard");
    } else {
      setChecking(false); // Only render form if no token
    }
  }, []);

  if (checking) {
    return null; // Prevents layout flashing before redirect
  }

  return <SignupForm />;
}

