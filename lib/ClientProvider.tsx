"use client";

import { useEffect } from "react";
import { refreshAccessToken } from "@/lib/auth";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      await refreshAccessToken();
    })();
  }, []);

  return <>{children}</>;
}
