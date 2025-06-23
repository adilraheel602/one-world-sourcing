import { useEffect, useState } from "react";

export default function useAuthToken() {
  const [token, setToken] = useState<string | null>(null);

  const refresh = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return null;

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      localStorage.setItem("accessToken", data.access);
      setToken(data.access);
      return data.access;
    } catch {
      localStorage.clear();
      window.location.href = "/auth/login";
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setToken(token);
    } else {
      refresh(); // Try refresh if no token
    }
  }, []);

  return { token, refresh };
}
