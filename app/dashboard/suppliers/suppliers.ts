import { useEffect, useState } from "react";

export interface Supplier {
  id: number;
  name: string;
  // Add other fields as needed
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Get JWT token from localStorage (or wherever you store it)
        const access_token = localStorage.getItem('access_token');
        
        if (!access_token) {
          throw new Error('No access token found. Please login.');
        }

        const response = await fetch("https://web-production-3f682.up.railway.app/api/suppliers/list", {
          headers: {
            Accept: "application/json",
            // Note: Your Django config uses 'JWT' not 'Bearer'
            Authorization: `JWT ${access_token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired, try to refresh
            const refreshed = await refreshToken();
            if (refreshed) {
              // Retry the request with new token
              return fetchSuppliers();
            }
            throw new Error('Authentication failed. Please login again.');
          }
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("✅ Supplier API response:", data);

        if (Array.isArray(data)) {
          setSuppliers(data);
        } else if (data.results) {
          setSuppliers(data.results);
        } else {
          console.warn("⚠️ Unexpected data structure", data);
          setSuppliers([]);
        }
      } catch (err) {
        console.error("❌ Supplier fetch error", err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  return { suppliers, loading, error };
}

// Helper function to refresh JWT token
async function refreshToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    const response = await fetch('https://web-production-3f682.up.railway.app/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}