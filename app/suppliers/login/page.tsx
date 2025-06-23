"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {LoginForm} from "@/components/auth/login-form"; // or the correct path to your login form component

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.replace("/suppliers/dashboard");
    } else {
      setChecking(false);
    }
  }, []);

  if (checking) {
    return null;
  }

  return <LoginForm />;
}
