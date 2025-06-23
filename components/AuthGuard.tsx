"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/suppliers/login");
    } else {
      setChecked(true);
    }
  }, []);

  if (!checked) {
    return <div className="p-6">Checking authentication...</div>;
  }

  return <>{children}</>;
}
